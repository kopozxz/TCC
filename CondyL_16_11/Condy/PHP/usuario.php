<?php

    //Inicia a sessão para ler quem está logado
    session_start();

    // Informa que a resposta será enviada em JSON
    header("Content-Type: application/json; charset=UTF-8");

    // Impede o navegador de guardar essa resposta
    header("Cache-Control: no-store");

    //Se não houver login, o front redireciona para a página inicial
    if (!isset($_SESSION["idUsuario"])) {

        http_response_code(401);

        echo json_encode(["logado" => false]);

        exit;
    }

    echo json_encode([
        "logado" => true,
        "nome" => $_SESSION["nome"],
        "apelido" => $_SESSION["apelido"]
    ]);

?>