<?php

    //Conexao entre upload.php e database.php
    include "database.php";

    // Informa que a resposta será enviada em JSON
    header("Content-Type: application/json; charset=UTF-8");

    // Trata erros do MySQL como exceções
    mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

    // Função auxiliar: devolve uma resposta JSON e encerra o script
    function responder($codigo, $sucesso, $mensagem, $extra = []) {
        http_response_code($codigo);
        echo json_encode(array_merge([
            "sucesso"  => $sucesso,
            "mensagem" => $mensagem
        ], $extra));
        exit;
    }

    //DEPURAÇÃO: com true, a resposta de erro mostra o motivo real (ex.: tabela inexistente).
    //Depois que tudo funcionar, mude para false.
    $depurar = true;

    //Configurações do upload
    $pastaUpload   = __DIR__ . "/../UPLOADS/"; //Pasta onde os arquivos ficam (Condy/UPLOADS)
    $tamanhoMaximo = 24 * 1024 * 1024;          //25 MB (o php.ini também limita: upload_max_filesize e post_max_size)

    //Extensões permitidas e os tipos MIME aceitos para cada uma.
    //Todas têm no máximo 4 letras: nomeAnexo é varchar(37) = 32 (nome) + 1 (ponto) + 4 (extensão)
    $permitidos = [
        "jpg"  => ["image/jpeg"],
        "jpeg" => ["image/jpeg"],
        "png"  => ["image/png"],
        "gif"  => ["image/gif"],
        "webp" => ["image/webp"],
        "pdf"  => ["application/pdf"],
        "txt"  => ["text/plain"],
        "doc"  => ["application/msword", "application/vnd.ms-office", "application/octet-stream"],
        "docx" => ["application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/zip", "application/octet-stream"],
        "xls"  => ["application/vnd.ms-excel", "application/vnd.ms-office", "application/octet-stream"],
        "xlsx" => ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/zip", "application/octet-stream"],
        "ppt"  => ["application/vnd.ms-powerpoint", "application/vnd.ms-office", "application/octet-stream"],
        "pptx" => ["application/vnd.openxmlformats-officedocument.presentationml.presentation", "application/zip", "application/octet-stream"],
        "zip"  => ["application/zip", "application/x-zip-compressed", "application/octet-stream"]
    ];

    //Só aceita requisições POST
    if ($_SERVER["REQUEST_METHOD"] !== "POST") {
        responder(405, false, "Método não permitido.");
    }

    //Identifica o usuário logado. O login.php precisa gravar $_SESSION["idUsuario"]
    session_start();

    if (!isset($_SESSION["idUsuario"])) {
        responder(401, false, "Faça login para enviar arquivos.");
    }

    $idUsuario = (int) $_SESSION["idUsuario"];

    //Verifica se o arquivo chegou (o campo do formulário deve se chamar "arquivo")
    if (!isset($_FILES["arquivo"])) {
        responder(400, false, "Nenhum arquivo foi enviado.");
    }

    $arquivo = $_FILES["arquivo"];

    //Trata os erros do upload do PHP
    if ($arquivo["error"] !== UPLOAD_ERR_OK) {
        switch ($arquivo["error"]) {
            case UPLOAD_ERR_NO_FILE:
                responder(400, false, "Nenhum arquivo foi enviado.");
            case UPLOAD_ERR_INI_SIZE:
            case UPLOAD_ERR_FORM_SIZE:
                responder(413, false, "O arquivo é maior que o limite permitido.");
            default:
                responder(500, false, "Erro ao receber o arquivo. Tente novamente.");
        }
    }

    //Valida o tamanho
    if ($arquivo["size"] > $tamanhoMaximo) {
        responder(413, false, "O arquivo deve ter no máximo 25 MB.");
    }

    //Valida a extensão
    $nomeOriginal = basename($arquivo["name"]);
    $extensao = strtolower(pathinfo($nomeOriginal, PATHINFO_EXTENSION));

    if (!array_key_exists($extensao, $permitidos)) {
        responder(415, false, "Tipo de arquivo não permitido.");
    }

    //Valida o tipo real do arquivo (não confia apenas na extensão)
    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mime = $finfo->file($arquivo["tmp_name"]);

    if (!in_array($mime, $permitidos[$extensao], true)) {
        responder(415, false, "O conteúdo do arquivo não corresponde à extensão.");
    }

    //Se for imagem, confirma que o PHP consegue ler as dimensões
    if (strpos($mime, "image/") === 0 && getimagesize($arquivo["tmp_name"]) === false) {
        responder(415, false, "A imagem enviada está corrompida ou é inválida.");
    }

    //Cria a pasta de uploads se ela não existir e bloqueia execução de PHP dentro dela
    if (!is_dir($pastaUpload)) {
        mkdir($pastaUpload, 0755, true);
    }

    $htaccess = $pastaUpload . ".htaccess";

    if (!file_exists($htaccess)) {
        file_put_contents($htaccess, "<FilesMatch \"\\.(php|phtml|phar)$\">\n    Require all denied\n</FilesMatch>\n");
    }

    //Gera um nome único: 32 caracteres aleatórios + "." + extensão (cabe nos 37 do nomeAnexo)
    $nomeAnexo = bin2hex(random_bytes(16)) . "." . $extensao;
    $caminho = $pastaUpload . $nomeAnexo;

    //Define a postagem a qual o anexo pertence:
    //- se o front enviar "idPostagem", anexa nessa postagem (precisa ser do próprio usuário)
    //- se não enviar, cria uma nova postagem com o "texto" informado
    $idPostagem = isset($_POST["idPostagem"]) ? (int) $_POST["idPostagem"] : 0;
    $texto = isset($_POST["texto"]) ? trim($_POST["texto"]) : "";
    $tipoPostagem = isset($_POST["tipoPostagem"]) ? $_POST["tipoPostagem"] : "postagem";

    if (!in_array($tipoPostagem, ["postagem", "comentario", "replica"], true)) {
        responder(400, false, "Tipo de postagem inválido.");
    }

    $arquivoMovido = false;

    try {

        //Transação: ou grava tudo (postagem, anexo e auditoria) ou não grava nada
        $conexao->begin_transaction();

        if ($idPostagem > 0) {

            //Confere se a postagem existe e pertence ao usuário logado
            $statement = $conexao->prepare("SELECT idPostagem FROM tabelaPostagem WHERE idPostagem = ? AND idUsuarioFK = ?");
            $statement->bind_param("ii", $idPostagem, $idUsuario);
            $statement->execute();

            if ($statement->get_result()->num_rows === 0) {
                $conexao->rollback();
                responder(404, false, "Postagem não encontrada.");
            }

        } else {

            //Cria a nova postagem. O idPostagem é gerado aqui (mesma regra do banco)
            //e tenta de novo caso o valor já exista.
            $statement = $conexao->prepare("INSERT INTO tabelaPostagem (idPostagem, tipoPostagem, idUsuarioFK, texto) VALUES (?, ?, ?, ?)");

            for ($tentativa = 0; $tentativa < 5; $tentativa++) {
                $idPostagem = time() + random_int(0, 999);

                try {
                    $statement->bind_param("isis", $idPostagem, $tipoPostagem, $idUsuario, $texto);
                    $statement->execute();
                    break;
                } catch (mysqli_sql_exception $erro) {
                    if ($erro->getCode() != 1062 || $tentativa === 4) {
                        throw $erro;
                    }
                }
            }
        }

        //Move o arquivo para a pasta de uploads
        if (!move_uploaded_file($arquivo["tmp_name"], $caminho)) {
            throw new Exception("Falha ao salvar o arquivo no servidor.");
        }

        $arquivoMovido = true;

        //Registra o anexo no banco
        $statement = $conexao->prepare("INSERT INTO tabelaAnexo (idPostagemFK, nomeAnexo) VALUES (?, ?)");
        $statement->bind_param("is", $idPostagem, $nomeAnexo);
        $statement->execute();

        //Registra o upload na auditoria (guarda o nome original e o tamanho, que a tabelaAnexo não armazena)
        $registro = "Upload do arquivo \"" . mb_substr($nomeOriginal, 0, 200) . "\" salvo como " . $nomeAnexo
                  . " (" . $arquivo["size"] . " bytes) na postagem " . $idPostagem;

        $statement = $conexao->prepare("INSERT INTO tabelaAuditoria (idUsuarioFK, registro) VALUES (?, ?)");
        $statement->bind_param("is", $idUsuario, $registro);
        $statement->execute();

        $conexao->commit();

        responder(201, true, "Arquivo enviado com sucesso.", [
            "idPostagem" => $idPostagem,
            "nomeAnexo"  => $nomeAnexo,
            "url"        => "UPLOADS/" . $nomeAnexo
        ]);

    } catch (Throwable $erro) {

        //Desfaz o que foi gravado no banco e remove o arquivo salvo
        $conexao->rollback();

        if ($arquivoMovido && file_exists($caminho)) {
            unlink($caminho);
        }

        responder(500, false, "Não foi possível registrar o upload. Tente novamente.",
            $depurar ? ["detalhe" => $erro->getMessage()] : []);
    }

?>
