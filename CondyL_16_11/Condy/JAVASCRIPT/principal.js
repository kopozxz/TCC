// ---------- DADOS DO PERFIL SALVO (usados em posts, comentários e respostas) ----------

function obterFotoPerfil() {
    return localStorage.getItem('condy_foto_perfil') || 'IMAGENS/foto_de_perfil.png';
}

function obterNomePerfil() {
    return localStorage.getItem('condy_nome_perfil') || 'Nome de Usuário';
}

// Limpar Input de Busca
document.getElementById('botaoLimpar').addEventListener('click', function() {
    document.getElementById('campoBusca').value = '';
});

// Abrir/Fechar menu de opções (clipe)
document.getElementById('botaoClip').addEventListener('click', function() {
    document.getElementById('menuOpcoes').classList.toggle('ativo');
});

// Anexos: Imagem e Arquivo
document.getElementById('btnImagem').addEventListener('click', () => {
    document.getElementById('inputImagem').click();
});

document.getElementById('btnArquivo').addEventListener('click', () => {
    document.getElementById('inputArquivo').click();
});

// Preview do anexo escolhido
const previewAnexo = document.getElementById('previewAnexo');
let arquivoSelecionado = null;

function mostrarPreview(arquivo) {
    arquivoSelecionado = arquivo;
    previewAnexo.innerHTML = '';

    if (arquivo.type.startsWith('image/')) {
        const img = document.createElement('img');
        img.src = URL.createObjectURL(arquivo);
        previewAnexo.appendChild(img);
    }

    const nome = document.createElement('span');
    nome.className = 'nome-arquivo';
    nome.textContent = arquivo.name;
    previewAnexo.appendChild(nome);

    const btnRemover = document.createElement('button');
    btnRemover.className = 'remover-anexo';
    btnRemover.type = 'button';
    btnRemover.textContent = '✕';
    btnRemover.addEventListener('click', () => {
        limparAnexo();
    });
    previewAnexo.appendChild(btnRemover);

    previewAnexo.classList.add('ativo');
}

function limparAnexo() {
    arquivoSelecionado = null;
    previewAnexo.classList.remove('ativo');
    previewAnexo.innerHTML = '';
    document.getElementById('inputImagem').value = '';
    document.getElementById('inputArquivo').value = '';
}

document.getElementById('inputImagem').addEventListener('change', (e) => {
    const arquivo = e.target.files[0];
    if (arquivo) mostrarPreview(arquivo);
});

document.getElementById('inputArquivo').addEventListener('change', (e) => {
    const arquivo = e.target.files[0];
    if (arquivo) mostrarPreview(arquivo);
});

// ---------- CRIAR NOVO POST ----------

function criarNovoPost(texto, arquivo) {
    const post = document.createElement('div');
    post.className = 'post-preto';

    let anexoHTML = '';
    let urlAnexo = '';

    // Aceita um File (escolhido no input) ou um objeto { url, nome, ehImagem } (vindo do servidor)
    if (arquivo && !arquivo.url) {
        arquivo = {
            url: URL.createObjectURL(arquivo),
            nome: arquivo.name,
            ehImagem: arquivo.type.startsWith('image/')
        };
    }

    if (arquivo) {
        urlAnexo = arquivo.url;

        let miniaturaHTML = '';
        const ehImagem = arquivo.ehImagem;

        if (ehImagem) {
            miniaturaHTML = `<img src="${urlAnexo}" alt="Anexo">`;
            anexoHTML = `
                <a href="javascript:void(0)" class="anexo-post" data-imagem-url="${urlAnexo}">
                    ${miniaturaHTML}
                    <span class="nome-arquivo-post"></span>
                </a>
            `;
        } else {
            miniaturaHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-file-earmark" viewBox="0 0 16 16">
                    <path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5z"/>
                </svg>
            `;
            anexoHTML = `
                <a href="${urlAnexo}" download class="anexo-post">
                    ${miniaturaHTML}
                    <span class="nome-arquivo-post"></span>
                </a>
            `;
        }
    }

    post.innerHTML = `
        <div class="foto-perfil-nome-post">
            <img src="${localStorage.getItem('condy_foto_perfil') || 'IMAGENS/foto_de_perfil.png'}" class="foto-perfil-post" alt="Foto de Perfil">
            <div class="info-usuario">
                <h1 class="nome-do-usuario-post">Nome de Usuário</h1>
                <h2 class="arroba-post">@Arroba</h2>
            </div>
            <div class="btn-denunciar">
                <button class="apagar-post">
                    <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                    </svg>
                </button>
            </div>
        </div>
        <p></p>
        ${anexoHTML}
        <div class="post-branco">
            <button class="btn-like">
                <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" fill="currentColor" class="bi bi-heart" viewBox="0 0 16 16">
                    <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15"/>
                </svg>
                <span class="contador-like">0</span>
            </button>
            <button class="btn-comentario">
                <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" fill="currentColor" class="bi bi-chat" viewBox="0 0 16 16">
                    <path d="M2.678 11.894a1 1 0 0 1 .287.801 11 11 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8 8 0 0 0 8 14c3.996 0 7-2.807 7-6s-3.004-6-7-6-7 2.808-7 6c0 1.468.617 2.83 1.678 3.894m-.493 3.905a22 22 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a10 10 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9 9 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105"/>
                </svg>
                <span class="contador-comentario">0</span>
            </button>
            <button class="btn-bookmark">
                <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" fill="currentColor" class="bi bi-bookmark" viewBox="0 0 16 16">
                    <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1z"/>
                </svg>
                <span class="contador-bookmark">0</span>
            </button>
            <button class="btn-compartilhar">
                <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" fill="currentColor" class="bi bi-share" viewBox="0 0 16 16">
                    <path d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.5 2.5 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5m-8.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3m11 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3"/>
                </svg>
                <span class="contador-compartilhar">0</span>
            </button>
        </div>
        <div class="secao-comentarios">
            <div class="lista-comentarios"></div>
            <div class="input-comentario">
                <input type="text" class="campo-comentario" placeholder="Escreva um comentário...">
                <button class="enviar-comentario">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-send" viewBox="0 0 16 16">
                        <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z"/>
                    </svg>
                </button>
            </div>
        </div>
    `;

    post.querySelector('p').textContent = texto;

    const nomeSalvo = localStorage.getItem('condy_nome_perfil');
    if (nomeSalvo) {
        post.querySelector('.nome-do-usuario-post').textContent = nomeSalvo;
    }

    if (arquivo) {
        post.querySelector('.nome-arquivo-post').textContent = arquivo.nome;

        // Define o nome do download por JS (seguro contra aspas e caracteres especiais)
        const linkDownload = post.querySelector('.anexo-post[download]');
        if (linkDownload) linkDownload.setAttribute('download', arquivo.nome);
    }

    return post;
}

// ---------- ENVIAR POST PARA O SERVIDOR ----------

// Botão de denunciar (usado nos posts de outros usuários)
const HTML_BOTAO_DENUNCIAR = `
    <button class="report">
        <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" fill="currentColor" class="bi bi-exclamation-triangle" viewBox="0 0 16 16">
            <path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.15.15 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.2.2 0 0 1-.054.06.1.1 0 0 1-.066.017H1.146a.1.1 0 0 1-.066-.017.2.2 0 0 1-.054-.06.18.18 0 0 1 .002-.183L7.884 2.073a.15.15 0 0 1 .054-.057m1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767z"/>
            <path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z"/>
        </svg>
    </button>
`;

// Monta o post com os dados vindos do banco (reaproveita criarNovoPost)
function criarPostDoServidor(dados) {
    const post = criarNovoPost(dados.texto, dados.anexo || null);

    post.dataset.idPostagem = dados.idPostagem;
    post.querySelector('.nome-do-usuario-post').textContent = dados.nome;
    post.querySelector('.arroba-post').textContent = '@' + dados.apelido;

    // Curtidas e salvamentos que vieram do banco (e se o usuário logado já curtiu/salvou)
    atualizarBotaoCurtir(post.querySelector('.post-branco .btn-like'), !!dados.curtiu, dados.curtidas || 0);
    atualizarBotaoSalvar(post.querySelector('.post-branco .btn-bookmark'), !!dados.salvou, dados.salvamentos || 0);

    // Post de outra pessoa: troca a lixeira pelo botão de denunciar e usa a foto padrão
    if (!dados.ehDono) {
        post.querySelector('.btn-denunciar').innerHTML = HTML_BOTAO_DENUNCIAR;
        post.querySelector('.foto-perfil-post').src = 'IMAGENS/foto_de_perfil.png';
    }

    return post;
}

const formularioPost = document.querySelector('.criar-post');

formularioPost.addEventListener('submit', async (e) => {
    // Impede o envio padrão do formulário (que recarregaria a página)
    e.preventDefault();

    const textarea = formularioPost.querySelector('textarea');
    const botaoEnviar = formularioPost.querySelector('.enviar');
    const texto = textarea.value.trim();

    if (!texto) {
        return;
    }

    // Evita clique duplo enquanto o post está sendo enviado
    botaoEnviar.disabled = true;

    try {
        const dados = new FormData();
        dados.append('mensagem', texto);

        const resposta = await fetch('./PHP/post.php', {
            method: 'POST',
            body: dados
        });

        // Sessão expirada: volta para o login
        if (resposta.status === 401) {
            window.location.href = './index.html';
            return;
        }

        const resultado = await resposta.json();

        if (!resultado.sucesso) {
            alert(resultado.mensagem);
            return;
        }

        // Se há arquivo escolhido, envia para o upload.php anexando à postagem recém-criada
        let anexo = null;

        console.log('[Condy] Arquivo selecionado no envio:', arquivoSelecionado);

        if (arquivoSelecionado) {
            const dadosArquivo = new FormData();
            dadosArquivo.append('arquivo', arquivoSelecionado); // o upload.php espera o campo "arquivo"
            dadosArquivo.append('idPostagem', resultado.post.idPostagem);

            try {
                const respostaUpload = await fetch('./PHP/upload.php', {
                    method: 'POST',
                    body: dadosArquivo
                });

                // Lê como texto primeiro: se o PHP der erro fatal, a resposta não será JSON
                const textoUpload = await respostaUpload.text();
                console.log('[Condy] Resposta do upload.php (status ' + respostaUpload.status + '):', textoUpload);

                const resultadoUpload = JSON.parse(textoUpload);

                if (resultadoUpload.sucesso) {
                    anexo = {
                        url: resultadoUpload.url, // ex.: UPLOADS/abc123.png
                        nome: arquivoSelecionado.name,
                        ehImagem: arquivoSelecionado.type.startsWith('image/')
                    };
                } else {
                    alert('Postagem publicada, mas o anexo não foi enviado: ' + resultadoUpload.mensagem
                        + (resultadoUpload.detalhe ? '\n\nDetalhe: ' + resultadoUpload.detalhe : ''));
                }
            } catch (erroUpload) {
                console.error('[Condy] Falha no upload:', erroUpload);
                alert('Postagem publicada, mas o anexo não foi enviado. Aperte F12 e veja a aba Console para o motivo.');
            }
        }

        resultado.post.anexo = anexo;

        const novoPost = criarPostDoServidor(resultado.post);
        formularioPost.insertAdjacentElement('afterend', novoPost);

        textarea.value = '';
        limparAnexo();
        document.getElementById('menuOpcoes').classList.remove('ativo');

    } catch (erro) {
        alert('Não foi possível publicar. Tente novamente.');
    } finally {
        botaoEnviar.disabled = false;
    }
});

// ---------- COMENTÁRIOS E RESPOSTAS ----------

function enviarComentario(secaoComentarios) {
    const campo = secaoComentarios.querySelector('.campo-comentario');
    const texto = campo.value.trim();

    if (!texto) return;

    const lista = secaoComentarios.querySelector('.lista-comentarios');
    const postPreto = secaoComentarios.closest('.post-preto');
    const contadorComentario = postPreto.querySelector('.contador-comentario');

    const comentario = document.createElement('div');
    comentario.className = 'comentario';
    comentario.innerHTML = `
        <div class="comentario-linha">
            <img alt="Foto de Perfil">
            <div class="comentario-conteudo">
                <p class="nome-comentario">Nome de Usuário</p>
                <p class="texto-comentario"></p>
            </div>
            <button class="btn-like">
                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" class="bi bi-heart" viewBox="0 0 16 16">
                    <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15"/>
                </svg>
                <span class="contador-like">0</span>
            </button>
            <button class="remover-comentario">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                </svg>
            </button>
        </div>

        <div class="comentario-acoes">
            <button class="btn-responder">Responder</button>
        </div>

        <div class="lista-respostas"></div>

        <div class="input-resposta">
            <input type="text" class="campo-resposta" placeholder="Escreva uma resposta...">
            <button class="enviar-resposta">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-send" viewBox="0 0 16 16">
                    <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z"/>
                </svg>
            </button>
        </div>
    `;

    comentario.querySelector('.texto-comentario').textContent = texto;

    comentario.querySelector('img').src = obterFotoPerfil();
    comentario.querySelector('.nome-comentario').textContent = obterNomePerfil();

    lista.appendChild(comentario);
    campo.value = '';

    if (contadorComentario) {
        contadorComentario.textContent = (parseInt(contadorComentario.textContent) || 0) + 1;
    }
}

function enviarResposta(comentario) {
    const campo = comentario.querySelector('.campo-resposta');
    const texto = campo.value.trim();

    if (!texto) return;

    const listaRespostas = comentario.querySelector('.lista-respostas');
    const postPreto = comentario.closest('.post-preto');
    const contadorComentario = postPreto.querySelector('.contador-comentario');

    const resposta = document.createElement('div');
    resposta.className = 'comentario resposta';
    resposta.innerHTML = `
        <div class="comentario-linha">
            <img alt="Foto de Perfil">
            <div class="comentario-conteudo">
                <p class="nome-comentario">Nome de Usuário</p>
                <p class="texto-comentario"></p>
            </div>
            <button class="btn-like">
                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" class="bi bi-heart" viewBox="0 0 16 16">
                    <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15"/>
                </svg>
                <span class="contador-like">0</span>
            </button>
            <button class="remover-comentario">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                </svg>
            </button>
        </div>
    `;

    resposta.querySelector('.texto-comentario').textContent = texto;

    resposta.querySelector('img').src = obterFotoPerfil();
    resposta.querySelector('.nome-comentario').textContent = obterNomePerfil();

    listaRespostas.appendChild(resposta);
    campo.value = '';

    if (contadorComentario) {
        contadorComentario.textContent = (parseInt(contadorComentario.textContent) || 0) + 1;
    }
}

// Enviar comentário/resposta ao apertar Enter
document.body.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.classList.contains('campo-comentario')) {
        enviarComentario(e.target.closest('.secao-comentarios'));
    }

    if (e.key === 'Enter' && e.target.classList.contains('campo-resposta')) {
        enviarResposta(e.target.closest('.comentario'));
    }
});

// ---------- MENU COMPARTILHAR ----------

function criarMenuCompartilhar(botaoCompartilhar) {
    const menu = document.createElement('div');
    menu.className = 'menu-compartilhar';

    menu.innerHTML = `
        <button data-acao="copiar">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-link-45deg" viewBox="0 0 16 16">
                <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1 1 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4 4 0 0 1-.128-1.287z"/>
                <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243z"/>
            </svg>
            Copiar link
        </button>
        <button data-acao="whatsapp">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-whatsapp" viewBox="0 0 16 16">
                <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.336-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
            </svg>
            WhatsApp
        </button>
        <button data-acao="telegram">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-telegram" viewBox="0 0 16 16">
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.287 5.906q-1.168.486-4.666 2.01-.567.225-.595.442c-.03.243.275.339.69.47l.175.055c.408.133.958.288 1.243.294q.39.008.868-.32 3.269-2.205 3.374-2.229c.05-.012.12-.026.166.016s.042.12.037.141c-.03.129-1.227 1.241-1.846 1.817-.193.18-.33.307-.358.336a8 8 0 0 1-.188.186c-.38.366-.664.64.015 1.088.327.216.589.393.85.571.284.194.568.387.936.629q.14.092.27.187c.331.244.63.465.997.432.214-.02.435-.22.547-.82.265-1.417.786-4.486.906-5.751a1.4 1.4 0 0 0-.013-.315.34.34 0 0 0-.114-.217.53.53 0 0 0-.31-.093c-.3.005-.763.166-2.984 1.09"/>
            </svg>
            Telegram
        </button>
        <button data-acao="email">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-envelope" viewBox="0 0 16 16">
                <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm13 2.383-4.708 2.825L15 11.105zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741M1 11.105l4.708-2.897L1 5.383z"/>
            </svg>
            E-mail
        </button>
    `;

    document.body.appendChild(menu);

    const rect = botaoCompartilhar.getBoundingClientRect();
    const menuAltura = menu.offsetHeight;
    const menuLargura = menu.offsetWidth;

    let top = rect.top - menuAltura - 10;
    let left = rect.right - menuLargura;

    if (top < 10) {
        top = rect.bottom + 10;
    }

    if (left < 10) {
        left = 10;
    }

    menu.style.top = `${top}px`;
    menu.style.left = `${left}px`;

    menu.querySelectorAll('button[data-acao]').forEach(btn => {
        btn._botaoOrigem = botaoCompartilhar;
    });

    return menu;
}

// ---------- MODAL DE IMAGEM EXPANDIDA ----------

function abrirModalImagem(url) {
    const modalImagem = document.getElementById('modalImagemOverlay');
    const imgElemento = document.getElementById('modalImagemConteudo');

    imgElemento.src = url;
    modalImagem.style.display = 'flex';

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            modalImagem.classList.add('ativo');
        });
    });

    document.body.style.overflow = 'hidden';
}

function fecharModalImagem() {
    const modalImagem = document.getElementById('modalImagemOverlay');
    modalImagem.classList.remove('ativo');

    setTimeout(() => {
        modalImagem.style.display = 'none';
        document.getElementById('modalImagemConteudo').src = '';
        document.body.style.overflow = '';
    }, 250);
}

document.getElementById('modalImagemFechar').addEventListener('click', fecharModalImagem);

document.getElementById('modalImagemOverlay').addEventListener('click', (e) => {
    if (!e.target.closest('img')) {
        fecharModalImagem();
    }
});

// ---------- MODAL DE POST EXPANDIDO (usa uma cópia, post original nunca some do feed) ----------

function abrirModalPost(post) {
    const modalContainer = document.getElementById('modalPostContainer');

    modalContainer.innerHTML = '';

    const copiaPost = post.cloneNode(true);
    copiaPost.classList.add('post-clonado');
    copiaPost._postOriginal = post;
    modalContainer.appendChild(copiaPost);

    const overlay = document.getElementById('modalOverlay');
    overlay.style.display = 'flex';

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            overlay.classList.add('ativo');
        });
    });

    document.body.style.overflow = 'hidden';
}

function fecharModalPost() {
    const overlay = document.getElementById('modalOverlay');
    overlay.classList.remove('ativo');

    setTimeout(() => {
        const modalContainer = document.getElementById('modalPostContainer');
        modalContainer.innerHTML = '';
        overlay.style.display = 'none';
        document.body.style.overflow = '';
    }, 250);
}

document.getElementById('modalFechar').addEventListener('click', fecharModalPost);

document.getElementById('modalOverlay').addEventListener('click', (e) => {
    if (e.target.id === 'modalOverlay') {
        fecharModalPost();
    }
});

// ---------- CONFIRMAR AÇÃO (DENUNCIAR OU APAGAR) ----------

let postParaAcao = null;

function abrirModalConfirmacao(post, mensagem) {
    postParaAcao = post;
    const overlay = document.getElementById('modalConfirmacaoOverlay');
    const textoModal = overlay.querySelector('p');
    textoModal.textContent = mensagem;

    overlay.style.display = 'flex';

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            overlay.classList.add('ativo');
        });
    });
}

function fecharModalConfirmacao() {
    const overlay = document.getElementById('modalConfirmacaoOverlay');
    overlay.classList.remove('ativo');

    setTimeout(() => {
        overlay.style.display = 'none';
        postParaAcao = null;
    }, 200);
}

document.getElementById('btnCancelarDenuncia').addEventListener('click', fecharModalConfirmacao);

document.getElementById('modalConfirmacaoOverlay').addEventListener('click', (e) => {
    if (e.target.id === 'modalConfirmacaoOverlay') {
        fecharModalConfirmacao();
    }
});

document.getElementById('btnConfirmarDenuncia').addEventListener('click', () => {
    if (postParaAcao) {
        const estavaNoModal = postParaAcao.classList.contains('post-clonado');

        if (postParaAcao._postOriginal) {
            postParaAcao._postOriginal.remove();
        }

        postParaAcao.remove();

        if (estavaNoModal) {
            fecharModalPost();
        }
    }
    fecharModalConfirmacao();
});

// ---------- CURTIR E SALVAR (ícones, contadores e conversa com o servidor) ----------

// Desenhos dos ícones: coração vazio/cheio e marcador vazio/cheio
const ICONE_CURTIR_VAZIO = '<path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15"/>';
const ICONE_CURTIR_CHEIO = '<path d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"/>';
const ICONE_SALVAR_VAZIO = '<path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1z"/>';
const ICONE_SALVAR_CHEIO = '<path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5z"/>';

// Deixa o botão de curtir como "curtido" ou "não curtido" e escreve o total
function atualizarBotaoCurtir(botao, ativo, total) {
    const svg = botao.querySelector('svg');

    svg.setAttribute('class', ativo ? 'bi bi-heart-fill' : 'bi bi-heart');
    svg.innerHTML = ativo ? ICONE_CURTIR_CHEIO : ICONE_CURTIR_VAZIO;

    botao.classList.toggle('active', ativo);
    botao.dataset.liked = ativo ? 'true' : 'false';
    botao.querySelector('.contador-like').textContent = total;
}

// Deixa o botão de salvar como "salvo" ou "não salvo" e escreve o total
function atualizarBotaoSalvar(botao, ativo, total) {
    const svg = botao.querySelector('svg');

    svg.setAttribute('class', ativo ? 'bi bi-bookmark-fill' : 'bi bi-bookmark');
    svg.innerHTML = ativo ? ICONE_SALVAR_CHEIO : ICONE_SALVAR_VAZIO;

    botao.classList.toggle('active', ativo);
    botao.dataset.saved = ativo ? 'true' : 'false';
    botao.querySelector('.contador-bookmark').textContent = total;
}

// Curtir ou salvar uma postagem: avisa o servidor e só muda a tela quando ele confirmar
// tipo = 'curtir' ou 'salvar'
async function alternarInteracaoPost(botao, tipo) {
    const post = botao.closest('.post-preto');
    const idPostagem = post && post.dataset.idPostagem;

    if (!idPostagem) {
        return;
    }

    // Evita clique duplo enquanto espera a resposta do servidor
    if (botao.dataset.enviando === 'true') {
        return;
    }

    botao.dataset.enviando = 'true';

    try {
        const dados = new FormData();
        dados.append('idPostagem', idPostagem);
        dados.append('tipo', tipo);

        const resposta = await fetch('./PHP/interagir.php', {
            method: 'POST',
            body: dados
        });

        // Sessão expirada: volta para o login
        if (resposta.status === 401) {
            window.location.href = './index.html';
            return;
        }

        const resultado = await resposta.json();

        if (!resultado.sucesso) {
            alert(resultado.mensagem);
            return;
        }

        // Atualiza o post clicado e, se ele for a cópia aberta no modal, o original do feed também
        const postsParaAtualizar = [post];

        if (post._postOriginal) {
            postsParaAtualizar.push(post._postOriginal);
        }

        postsParaAtualizar.forEach(p => {
            if (tipo === 'curtir') {
                atualizarBotaoCurtir(p.querySelector('.post-branco .btn-like'), resultado.ativo, resultado.total);
            } else {
                atualizarBotaoSalvar(p.querySelector('.post-branco .btn-bookmark'), resultado.ativo, resultado.total);
            }
        });

    } catch (erro) {
        alert('Não foi possível concluir. Tente novamente.');
    } finally {
        botao.dataset.enviando = 'false';
    }
}

// ---------- LISTENER PRINCIPAL DE CLIQUE (delegação de eventos) ----------

document.body.addEventListener('click', (e) => {

    // --- FECHAR MENU DE COMPARTILHAR AO CLICAR FORA ---
    const menuAberto = document.querySelector('.menu-compartilhar');
    if (menuAberto && !e.target.closest('.menu-compartilhar') && !e.target.closest('.btn-compartilhar')) {
        menuAberto.remove();
    }

    // --- LIKE ---
    const likeButton = e.target.closest('.btn-like');
    if (likeButton) {
        likeButton.classList.remove('animate');
        void likeButton.offsetWidth;
        likeButton.classList.add('animate');

        if (likeButton.closest('.comentario')) {
            // Curtida de comentário: ainda é só visual (os comentários serão ligados ao banco depois)
            const contador = likeButton.querySelector('.contador-like');
            const total = parseInt(contador.textContent) || 0;
            const ativo = likeButton.dataset.liked !== 'true';

            atualizarBotaoCurtir(likeButton, ativo, ativo ? total + 1 : Math.max(0, total - 1));
        } else {
            // Curtida de postagem: vai para o banco
            alternarInteracaoPost(likeButton, 'curtir');
        }
        return;
    }

    // --- BOOKMARK (SALVAR) ---
    const bookmarkButton = e.target.closest('.btn-bookmark');
    if (bookmarkButton) {
        bookmarkButton.classList.remove('animate');
        void bookmarkButton.offsetWidth;
        bookmarkButton.classList.add('animate');

        alternarInteracaoPost(bookmarkButton, 'salvar');
        return;
    }

    // --- ABRIR/FECHAR SEÇÃO DE COMENTÁRIOS ---
    const botaoComentario = e.target.closest('.btn-comentario');
    if (botaoComentario) {
        botaoComentario.classList.remove('animate');
        void botaoComentario.offsetWidth;
        botaoComentario.classList.add('animate');

        const secao = botaoComentario.closest('.post-preto').querySelector('.secao-comentarios');
        secao.classList.toggle('ativo');
        return;
    }

    // --- REMOVER COMENTÁRIO ---
    const botaoRemoverComentario = e.target.closest('.remover-comentario');
    if (botaoRemoverComentario) {
        const postPreto = botaoRemoverComentario.closest('.post-preto');
        const contadorComentario = postPreto.querySelector('.contador-comentario');

        botaoRemoverComentario.closest('.comentario').remove();

        if (contadorComentario) {
            const atual = parseInt(contadorComentario.textContent) || 0;
            contadorComentario.textContent = Math.max(0, atual - 1);
        }
        return;
    }

    // --- ENVIAR COMENTÁRIO (clique no botão) ---
    const botaoEnviarComentario = e.target.closest('.enviar-comentario');
    if (botaoEnviarComentario) {
        enviarComentario(botaoEnviarComentario.closest('.secao-comentarios'));
        return;
    }

    // --- ABRIR/FECHAR CAMPO DE RESPOSTA ---
    const botaoResponder = e.target.closest('.btn-responder');
    if (botaoResponder) {
        const comentario = botaoResponder.closest('.comentario');
        const inputResposta = comentario.querySelector('.input-resposta');
        inputResposta.classList.toggle('ativo');
        return;
    }

    // --- ENVIAR RESPOSTA (clique no botão) ---
    const botaoEnviarResposta = e.target.closest('.enviar-resposta');
    if (botaoEnviarResposta) {
        const comentario = botaoEnviarResposta.closest('.comentario');
        enviarResposta(comentario);
        return;
    }

    // --- ABRIR MENU COMPARTILHAR ---
    const botaoCompartilhar = e.target.closest('.btn-compartilhar');
    if (botaoCompartilhar) {
        document.querySelectorAll('.menu-compartilhar').forEach(m => m.remove());
        const menu = criarMenuCompartilhar(botaoCompartilhar);
        menu.classList.add('ativo');
        return;
    }

    // --- CLICAR NUMA OPÇÃO DO MENU COMPARTILHAR ---
    const opcao = e.target.closest('.menu-compartilhar button');
    if (opcao) {
        const acao = opcao.dataset.acao;
        const linkPost = 'visitante.html';
        const botaoOrigem = opcao._botaoOrigem;

        function incrementarContador() {
            if (!botaoOrigem) return;
            const contador = botaoOrigem.querySelector('.contador-compartilhar');
            if (contador) {
                contador.textContent = (parseInt(contador.textContent) || 0) + 1;
            }
        }

        if (acao === 'copiar') {
            navigator.clipboard.writeText(linkPost);
            opcao.textContent = 'Link copiado!';
            incrementarContador();
            setTimeout(() => {
                opcao.closest('.menu-compartilhar')?.remove();
            }, 800);
            return;
        }

        if (acao === 'whatsapp') {
            window.open(`https://wa.me/?text=${encodeURIComponent(linkPost)}`, '_blank');
            incrementarContador();
        }

        if (acao === 'telegram') {
            window.open(`https://t.me/share/url?url=${encodeURIComponent(linkPost)}`, '_blank');
            incrementarContador();
        }

        if (acao === 'email') {
            window.location.href = `mailto:?subject=Confira este post&body=${encodeURIComponent(linkPost)}`;
            incrementarContador();
        }

        opcao.closest('.menu-compartilhar')?.remove();
        return;
    }

    // --- ABRIR MODAL DE IMAGEM (clique na miniatura do anexo) ---
    const anexoImagem = e.target.closest('.anexo-post[data-imagem-url]');
    if (anexoImagem) {
        abrirModalImagem(anexoImagem.dataset.imagemUrl);
        return;
    }

    // --- ABRIR CONFIRMAÇÃO DE DENÚNCIA OU APAGAR ---
    const botaoDenunciarOuApagar = e.target.closest('.btn-denunciar');
    if (botaoDenunciarOuApagar) {
        const post = botaoDenunciarOuApagar.closest('.post-preto');
        const ehApagar = botaoDenunciarOuApagar.querySelector('.apagar-post');

        if (post) {
            if (ehApagar) {
                abrirModalConfirmacao(post, 'Tem certeza que deseja apagar este post?');
            } else {
                abrirModalConfirmacao(post, 'Tem certeza que deseja denunciar e apagar este post?');
            }
        }
        return;
    }

    // --- ABRIR MODAL DE POST EXPANDIDO ---
    const clicouEmInterativo = e.target.closest(
        '.post-branco button, .secao-comentarios, .anexo-post, .menu-compartilhar, .modal-fechar'
    );
    if (!clicouEmInterativo) {
        const postClicado = e.target.closest('.post-preto');
        if (postClicado && !postClicado.classList.contains('post-clonado')) {
            abrirModalPost(postClicado);
            return;
        }
    }

});

// ---------- ESCONDER/MOSTRAR BARRA DE CRIAR POST AO ROLAR ----------

const scrollContainer = document.querySelector('.conteudo-principal');
const criarPost = document.querySelector('.criar-post');
let ultimoScroll = 0;

if (scrollContainer && criarPost) {
    scrollContainer.addEventListener('scroll', () => {
        const scrollAtual = scrollContainer.scrollTop;

        if (scrollAtual <= 0) {
            criarPost.classList.remove('escondido');
        } else if (scrollAtual > ultimoScroll) {
            criarPost.classList.add('escondido');
        } else {
            criarPost.classList.remove('escondido');
        }

        ultimoScroll = scrollAtual;
    });
}

const modalTermosOverlay = document.getElementById('modalTermosOverlay');
const modalTermosFechar = document.getElementById('modalTermosFechar');

function abrirModalTermos() {
    modalTermosOverlay.style.display = 'flex';
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            modalTermosOverlay.classList.add('ativo');
        });
    });
}

function fecharModalTermos() {
    modalTermosOverlay.classList.remove('ativo');
    setTimeout(() => {
        modalTermosOverlay.style.display = 'none';
    }, 200);
}

document.querySelectorAll('.abrir-termos').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        abrirModalTermos();
    });
});

modalTermosFechar.addEventListener('click', fecharModalTermos);

modalTermosOverlay.addEventListener('click', (e) => {
    if (e.target.id === 'modalTermosOverlay') {
        fecharModalTermos();
    }
});

// ---------- CARREGAR FOTO E NOME DO PERFIL (sincroniza com a página de perfil) ----------

function aplicarPerfilSalvo() {
    const fotoSalva = localStorage.getItem('condy_foto_perfil');
    const nomeSalvo = localStorage.getItem('condy_nome_perfil');

    if (fotoSalva) {
        document.querySelectorAll('.foto-perfil').forEach(img => {
            img.src = fotoSalva;
            // se por algum motivo a imagem salva estiver corrompida, volta pra padrão automaticamente
            img.onerror = () => {
                img.src = 'IMAGENS/foto_de_perfil.png';
                localStorage.removeItem('condy_foto_perfil'); // limpa o dado ruim
            };
        });
    }

    if (nomeSalvo) {
        document.querySelectorAll('.nome-do-usuario').forEach(el => el.textContent = nomeSalvo);
    }
}

aplicarPerfilSalvo();

// ---------- CARREGAR USUÁRIO LOGADO E FEED DO BANCO ----------

async function carregarPosts() {
    const resposta = await fetch('./PHP/listar_posts.php');
    const resultado = await resposta.json();

    if (!resultado.sucesso) {
        return;
    }

    // Os posts já chegam do mais novo para o mais antigo: cada um entra logo após o anterior
    let anterior = document.querySelector('.criar-post');

    resultado.posts.forEach(dados => {
        const post = criarPostDoServidor(dados);
        anterior.insertAdjacentElement('afterend', post);
        anterior = post;
    });
}

async function iniciarPagina() {
    try {
        // O sessao.js (carregado antes deste arquivo) já busca o usuário e preenche nome e @ no header
        const usuario = await window.condySessao;

        // Sem login: o sessao.js já redirecionou para a página inicial
        if (!usuario) {
            return;
        }

        await carregarPosts();

    } catch (erro) {
        console.error('Erro ao carregar a página:', erro);
    }
}

iniciarPagina();