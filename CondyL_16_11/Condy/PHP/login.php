<?php

    //Configuração para mensagem de erro
    header("Content-Type: application/json; charset=UTF-8");

    //Conexao entre login.php e database.php
    include "database.php";

    //Declaração das variaveis
    $email = $_POST["email"];
    $senha = $_POST["senha"];

    //Conferindo os dados
    $sql = "SELECT * FROM tabelaUsuario WHERE email = ?";

    //Proteção contra SQL injection
    $statement = $conexao->prepare($sql); //Prepara o banco
    $statement->bind_param("s", $email); //Recebe o valor que esta em email
    $statement->execute(); //Executa o comando SQL

    $resultado = $statement->get_result(); //Pega o resultado do statement
    $usuario = $resultado->fetch_assoc();

    //Verificação do usuario e senha
    if ($usuario && password_verify($senha, $usuario["senha"])) {

        //Guarda o usuário logado na sessão (o upload.php usa isso)
        session_start();
        $_SESSION["idUsuario"] = $usuario["idUsuario"];
        $_SESSION["nome"] = $usuario["nome"];
        $_SESSION["apelido"] = $usuario["apelido"];

        echo json_encode([
            "sucesso" => true,
            "mensagem" => "Login realizado com sucesso!"
        ]);

        exit;

    } else {

        echo json_encode([
            "sucesso" => false,
            "mensagem" => "E-mail ou senha incorretos."
        ]);

        exit;

    }

?>