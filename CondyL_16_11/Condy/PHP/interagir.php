<?php

    //Inicia a sessão para saber quem é o usuário logado
    session_start();

    //Conexao entre interagir.php e database.php
    include "database.php";

    // Informa que a resposta será enviada em JSON
    header("Content-Type: application/json; charset=UTF-8");

    // Trata erros do MySQL como exceções
    mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

    //Só aceita POST (o JavaScript envia os dados com fetch)
    if ($_SERVER["REQUEST_METHOD"] !== "POST") {

        http_response_code(405);

        echo json_encode([
            "sucesso" => false,
            "mensagem" => "Método não permitido."
        ]);

        exit;
    }

    //Só usuários logados podem curtir e salvar
    if (!isset($_SESSION["idUsuario"])) {

        http_response_code(401);

        echo json_encode([
            "sucesso" => false,
            "mensagem" => "Você precisa estar logado."
        ]);

        exit;
    }

    //Declaração das variaveis
    $idUsuario = (int) $_SESSION["idUsuario"];
    $idPostagem = (int) ($_POST["idPostagem"] ?? 0);
    $tipo = $_POST["tipo"] ?? "";

    //Tipos aceitos: o que o JavaScript manda => o valor que fica no banco (enum da tabelaInteracao)
    $tiposPermitidos = [
        "curtir" => "curtiu",
        "salvar" => "salvou"
    ];

    //Validação dos dados recebidos
    if ($idPostagem <= 0 || !isset($tiposPermitidos[$tipo])) {

        http_response_code(400);

        echo json_encode([
            "sucesso" => false,
            "mensagem" => "Dados inválidos."
        ]);

        exit;
    }

    $tipoInteracao = $tiposPermitidos[$tipo];

    try {

        //Confere se a postagem existe e não foi apagada
        $sql = "SELECT idPostagem FROM tabelaPostagem WHERE idPostagem = ? AND isDeleted = 'false'";

        //Proteção contra SQL injection
        $statement = $conexao->prepare($sql); //Prepara o banco
        $statement->bind_param("i", $idPostagem); //Adiciona o valor
        $statement->execute(); //Executa o SQL

        if (!$statement->get_result()->fetch_assoc()) {

            http_response_code(404);

            echo json_encode([
                "sucesso" => false,
                "mensagem" => "Postagem não encontrada."
            ]);

            exit;
        }

        //Confere se esse usuário já fez essa interação nessa postagem (ex.: já curtiu)
        $sql = "SELECT COUNT(*) AS total FROM tabelaInteracao WHERE idUsuarioFK = ? AND idPostagemFK = ? AND tipoInteracao = ?";

        $statement = $conexao->prepare($sql);
        $statement->bind_param("iis", $idUsuario, $idPostagem, $tipoInteracao);
        $statement->execute();

        $jaFez = $statement->get_result()->fetch_assoc()["total"] > 0;

        if ($jaFez) {

            //Já tinha curtido/salvo: remove (descurtir / tirar dos salvos)
            $sql = "DELETE FROM tabelaInteracao WHERE idUsuarioFK = ? AND idPostagemFK = ? AND tipoInteracao = ?";
            $ativo = false;

        } else {

            //Ainda não tinha: cria (curtir / salvar)
            $sql = "INSERT INTO tabelaInteracao (idUsuarioFK, idPostagemFK, tipoInteracao) VALUES (?, ?, ?)";
            $ativo = true;
        }

        $statement = $conexao->prepare($sql);
        $statement->bind_param("iis", $idUsuario, $idPostagem, $tipoInteracao);
        $statement->execute();

        //Conta quantas pessoas curtiram/salvaram essa postagem (valor já atualizado)
        $sql = "SELECT COUNT(*) AS total FROM tabelaInteracao WHERE idPostagemFK = ? AND tipoInteracao = ?";

        $statement = $conexao->prepare($sql);
        $statement->bind_param("is", $idPostagem, $tipoInteracao);
        $statement->execute();

        $total = (int) $statement->get_result()->fetch_assoc()["total"];

        // Retorna uma resposta de sucesso em JSON: se ficou ativo e o novo total
        echo json_encode([
            "sucesso" => true,
            "ativo" => $ativo,
            "total" => $total
        ]);

    } catch (mysqli_sql_exception $erro) {

        // Retorna uma mensagem para erros no banco
        http_response_code(500);

        echo json_encode([
            "sucesso" => false,
            "mensagem" => "Não foi possível concluir. Tente novamente."
        ]);
    }

?>