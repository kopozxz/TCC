<?php

    //Conexao entre cadastro.php e database.php 
    include "database.php";

    // Informa que a resposta será enviada em JSON
    header("Content-Type: application/json; charset=UTF-8");

    // Trata erros do MySQL como exceções
    mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

    //Declaração das variaveis
    $nome = $_POST["nome"];
    $nascimento = $_POST["data_nascimento"];
    $email = $_POST["email"];
    $senha = $_POST["senha"];

    //Validação dos dados que serão recebidos
    if (
        strlen($senha) < 8  || //Minimo 8 caracteres
        strlen($senha) > 12 || //Maximo 12 caracteres
        !preg_match("/[a-z]/", $senha) || //Pelo menos uma letra minuscula
        !preg_match("/[A-Z]/", $senha) || //Pelo menos uma letra maiuscula
        !preg_match("/[0-9]/", $senha) || //Pelo menos um numero
        !preg_match("/[!@#$%]/", $senha) //Pelo menos um caractere especial
    ) {
        //Interrompe o cadastro
        http_response_code(400);

        echo json_encode([
            "sucesso" => false,
            "mensagem" => "A senha não atende aos requisitos."
        ]);

        exit;
    }

    $hash = password_hash($senha, PASSWORD_DEFAULT); //Transforma a senha padrão em hash 

    //Inserindo os dados
    $sql = "INSERT INTO tabelaUsuario (nome, dataNascimento, email, senha) VALUES (?, ?, ?, ?)"; 

    try {

        //Proteção contra SQL injection
        $statement = $conexao->prepare($sql); //Prepara o banco
        $statement->bind_param("ssss", $nome, $nascimento, $email, $hash); //Adiciona os valores de email, nome e senha(hash)
        $statement->execute(); //Executa o SQL 

        // Retorna uma resposta de sucesso em JSON
        echo json_encode([
            "sucesso" => true,
            "mensagem" => "Cadastro realizado com sucesso."
        ]);

    } catch (mysqli_sql_exception $erro) {

        // Verifica se o erro aconteceu por causa de um valor duplicado
        if ($erro->getCode() == 1062) {

            http_response_code(409);

            echo json_encode([
                "sucesso" => false,
                "mensagem" => "Este e-mail já foi cadastrado. Tente fazer login ou use outro e-mail."
            ]);

        } else {

            // Retorna uma mensagem para outros erros no banco
            http_response_code(500);

            echo json_encode([
                "sucesso" => false,
                "mensagem" => "Não foi possível realizar o cadastro. Tente novamente."
            ]);
        }
    }

?>