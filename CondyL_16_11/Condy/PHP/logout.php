<?php

    //Inicia a sessão para poder encerrar ela
    session_start();

    // Informa que a resposta será enviada em JSON
    header("Content-Type: application/json; charset=UTF-8");

    //Só aceita POST (assim ninguém derruba o login de outra pessoa só com um link)
    if ($_SERVER["REQUEST_METHOD"] !== "POST") {

        http_response_code(405);

        echo json_encode([
            "sucesso" => false,
            "mensagem" => "Método não permitido."
        ]);

        exit;
    }

    //Apaga tudo que estava guardado na sessão (idUsuario, nome e apelido)
    $_SESSION = [];

    //Apaga também o cookie da sessão no navegador
    if (ini_get("session.use_cookies")) {

        $cookie = session_get_cookie_params();

        setcookie(
            session_name(),
            "",
            time() - 42000,
            $cookie["path"],
            $cookie["domain"],
            $cookie["secure"],
            $cookie["httponly"]
        );
    }

    //Destrói a sessão no servidor
    session_destroy();

    echo json_encode([
        "sucesso" => true,
        "mensagem" => "Logout realizado com sucesso."
    ]);

?>