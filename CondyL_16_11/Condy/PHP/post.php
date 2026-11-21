<?php

    //Inicia a sessão para saber quem é o usuário logado
    session_start();

    //Conexao entre post.php e database.php
    include "database.php";

    // Informa que a resposta será enviada em JSON
    header("Content-Type: application/json; charset=UTF-8");

    // Trata erros do MySQL como exceções
    mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

    //Só usuários logados podem postar
    if (!isset($_SESSION["idUsuario"])) {

        http_response_code(401);

        echo json_encode([
            "sucesso" => false,
            "mensagem" => "Você precisa estar logado para postar."
        ]);

        exit;
    }

    //Declaração das variaveis
    $idUsuario = $_SESSION["idUsuario"];
    $texto = trim($_POST["mensagem"] ?? ""); //trim remove espaços e quebras no começo e no fim
    $limiteCaracteres = 1000; //Altere se quiser outro limite

    //Validação do texto
    if ($texto === "") {

        http_response_code(400);

        echo json_encode([
            "sucesso" => false,
            "mensagem" => "Escreva algo antes de postar."
        ]);

        exit;
    }

    if (mb_strlen($texto, "UTF-8") > $limiteCaracteres) {

        http_response_code(400);

        echo json_encode([
            "sucesso" => false,
            "mensagem" => "A postagem pode ter no máximo $limiteCaracteres caracteres."
        ]);

        exit;
    }

    //Inserindo os dados
    //O id é gerado aqui com a mesma fórmula do default da tabela (timestamp + número de 0 a 999)
    //para podermos devolver o id da nova postagem ao JavaScript
    $sql = "INSERT INTO tabelaPostagem (idPostagem, tipoPostagem, idUsuarioFK, texto) VALUES (?, 'postagem', ?, ?)";

    $tentativas = 0;

    while (true) {

        $idPostagem = time() + random_int(0, 999);

        try {

            //Proteção contra SQL injection
            $statement = $conexao->prepare($sql); //Prepara o banco
            $statement->bind_param("iis", $idPostagem, $idUsuario, $texto); //Adiciona os valores
            $statement->execute(); //Executa o SQL

            break; //Deu certo, sai do laço

        } catch (mysqli_sql_exception $erro) {

            //Como o id é aleatório, pode (raramente) repetir: tenta de novo com outro id
            if ($erro->getCode() == 1062 && $tentativas < 5) {
                $tentativas++;
                continue;
            }

            // Retorna uma mensagem para outros erros no banco
            http_response_code(500);

            echo json_encode([
                "sucesso" => false,
                "mensagem" => "Não foi possível publicar. Tente novamente."
            ]);

            exit;
        }
    }

    // Retorna uma resposta de sucesso em JSON, já com os dados para o front montar o post
    echo json_encode([
        "sucesso" => true,
        "mensagem" => "Postagem publicada.",
        "post" => [
            "idPostagem" => $idPostagem,
            "texto" => $texto,
            "nome" => $_SESSION["nome"],
            "apelido" => $_SESSION["apelido"],
            "ehDono" => true
        ]
    ]);

?>