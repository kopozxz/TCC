<?php

    $servidor = "localhost:3306"; //endereço do servidor
    $usuario = "root"; //seu usuario
    $senha = "1234"; //senha do banco
    $banco = "tcc2026_condy"; //nome do banco

    $conexao = new mysqli($servidor, $usuario, $senha, $banco);

    //Garante acentos e emojis nos textos das postagens
    $conexao->set_charset("utf8mb4");

    // if ($conexao->connect_error) {
    //     die("Erro na Conexão: ". $conexao->connect_error);
    // }
    // echo "conectado com sucesso";
    
?>