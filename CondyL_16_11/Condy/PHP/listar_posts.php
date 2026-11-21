<?php

    //Inicia a sessão para saber quem é o usuário logado
    session_start();

    //Conexao entre listar_posts.php e database.php
    include "database.php";

    // Informa que a resposta será enviada em JSON
    header("Content-Type: application/json; charset=UTF-8");

    // Trata erros do MySQL como exceções
    mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

    //Só usuários logados veem o feed
    if (!isset($_SESSION["idUsuario"])) {

        http_response_code(401);

        echo json_encode([
            "sucesso" => false,
            "mensagem" => "Você precisa estar logado."
        ]);

        exit;
    }

    //Busca as postagens (mais novas primeiro), ignorando as apagadas e de contas inativas
    $sql = "SELECT P.idPostagem, P.texto, P.idUsuarioFK, U.nome, U.apelido
            FROM tabelaPostagem P
            INNER JOIN tabelaUsuario U ON U.idUsuario = P.idUsuarioFK
            WHERE P.tipoPostagem = 'postagem'
                AND P.isDeleted = 'false'
                AND U.isActive = 'true'
            ORDER BY P.idPostagem DESC
            LIMIT 50";

    try {

        $resultado = $conexao->query($sql);
        $posts = [];
        $ids = [];

        while ($linha = $resultado->fetch_assoc()) {
            $ids[] = (int) $linha["idPostagem"];

            $posts[] = [
                "idPostagem" => (int) $linha["idPostagem"],
                "texto" => $linha["texto"],
                "nome" => $linha["nome"],
                "apelido" => $linha["apelido"],
                //Informa se o post é do usuário logado (usado para mostrar apagar ou denunciar)
                "ehDono" => ((int) $linha["idUsuarioFK"] === (int) $_SESSION["idUsuario"]),
                //Preenchido abaixo se a postagem tiver anexo
                "anexo" => null,
                //Preenchidos abaixo com as interações: quantidade de cada uma e se o usuário logado já fez
                "curtidas" => 0,
                "comentarios" => 0,
                "compartilhamentos" => 0,
                "salvamentos" => 0,
                "curtiu" => false,
                "salvou" => false
            ];
        }

        //Busca os anexos das postagens listadas (uma única consulta para todas)
        if (count($ids) > 0) {

            $marcadores = implode(",", array_fill(0, count($ids), "?"));

            $statement = $conexao->prepare("SELECT idPostagemFK, nomeAnexo FROM tabelaAnexo WHERE idPostagemFK IN ($marcadores)");
            $statement->bind_param(str_repeat("i", count($ids)), ...$ids);
            $statement->execute();

            $anexos = [];

            foreach ($statement->get_result() as $linhaAnexo) {
                //A tela mostra 1 anexo por postagem
                $anexos[(int) $linhaAnexo["idPostagemFK"]] = $linhaAnexo["nomeAnexo"];
            }

            foreach ($posts as &$post) {

                if (isset($anexos[$post["idPostagem"]])) {

                    $nomeAnexo = $anexos[$post["idPostagem"]];
                    $extensao = strtolower(pathinfo($nomeAnexo, PATHINFO_EXTENSION));

                    $post["anexo"] = [
                        "url" => "UPLOADS/" . $nomeAnexo,
                        "nome" => $nomeAnexo,
                        "ehImagem" => in_array($extensao, ["jpg", "jpeg", "png", "gif", "webp"], true)
                    ];
                }
            }

            unset($post);

            //Busca as interações das postagens listadas (também numa única consulta)
            //Para cada postagem e tipo: total = quantas pessoas fizeram | minha = quantas vezes foi o usuário logado
            $idUsuario = (int) $_SESSION["idUsuario"];

            $statement = $conexao->prepare("SELECT idPostagemFK, tipoInteracao, COUNT(*) AS total, SUM(idUsuarioFK = ?) AS minha FROM tabelaInteracao WHERE idPostagemFK IN ($marcadores) GROUP BY idPostagemFK, tipoInteracao");
            $statement->bind_param("i" . str_repeat("i", count($ids)), $idUsuario, ...$ids);
            $statement->execute();

            $interacoes = [];

            foreach ($statement->get_result() as $linhaInteracao) {
                $interacoes[(int) $linhaInteracao["idPostagemFK"]][$linhaInteracao["tipoInteracao"]] = [
                    "total" => (int) $linhaInteracao["total"],
                    "minha" => ((int) $linhaInteracao["minha"]) > 0
                ];
            }

            foreach ($posts as &$post) {

                $deste = $interacoes[$post["idPostagem"]] ?? [];

                $post["curtidas"] = $deste["curtiu"]["total"] ?? 0;
                $post["comentarios"] = $deste["comentou"]["total"] ?? 0;
                $post["compartilhamentos"] = $deste["compartilhou"]["total"] ?? 0;
                $post["salvamentos"] = $deste["salvou"]["total"] ?? 0;

                $post["curtiu"] = $deste["curtiu"]["minha"] ?? false;
                $post["salvou"] = $deste["salvou"]["minha"] ?? false;
            }

            unset($post);
        }

        echo json_encode([
            "sucesso" => true,
            "posts" => $posts
        ]);

    } catch (mysqli_sql_exception $erro) {

        http_response_code(500);

        echo json_encode([
            "sucesso" => false,
            "mensagem" => "Não foi possível carregar as postagens."
        ]);
    }

?>