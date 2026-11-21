// ---------- SESSÃO DO USUÁRIO (usado em todas as páginas com o menu lateral) ----------
// Faz duas coisas:
//   1) Mostra o nome e o @ do usuário logado no menu lateral (header)
//   2) Faz o botão "Sair" encerrar a sessão no servidor antes de voltar para o index

// Pergunta ao servidor quem está logado e devolve { nome, apelido } (ou null se não houver login)
async function buscarUsuarioLogado() {
    try {
        // no-store: nunca usar resposta guardada em cache, senão poderia mostrar um usuário que já saiu
        const resposta = await fetch('./PHP/usuario.php', { cache: 'no-store' });

        // Sem login: volta para a página inicial
        if (resposta.status === 401) {
            window.location.href = './index.html';
            return null;
        }

        return await resposta.json();

    } catch (erro) {
        console.error('Erro ao buscar o usuário logado:', erro);
        return null;
    }
}

// Coloca o nome e o @ no header
function mostrarUsuarioNoHeader(usuario) {

    if (!usuario) {
        return;
    }

    document.querySelectorAll('.arroba').forEach(el => el.textContent = '@' + usuario.apelido);

    // O nome salvo no perfil (localStorage) continua tendo prioridade
    if (!localStorage.getItem('condy_nome_perfil')) {
        document.querySelectorAll('.nome-do-usuario').forEach(el => el.textContent = usuario.nome);
    }
}

// Carrega o usuário e preenche o header. As páginas podem aguardar esta promessa (principal.js faz isso)
function iniciarSessao() {
    window.condySessao = buscarUsuarioLogado().then(usuario => {
        mostrarUsuarioNoHeader(usuario);
        return usuario;
    });

    return window.condySessao;
}

iniciarSessao();

// Se o usuário sair e apertar "voltar" no navegador, a página antiga pode ser reaberta do cache.
// Quando isso acontecer, confere o login de novo.
window.addEventListener('pageshow', (evento) => {
    if (evento.persisted) {
        iniciarSessao();
    }
});

// ---------- BOTÃO SAIR ----------

async function sair(evento) {

    // Impede o link de ir direto para o index sem encerrar a sessão
    evento.preventDefault();

    try {

        const resposta = await fetch('./PHP/logout.php', { method: 'POST' });
        const dados = await resposta.json();

        if (!dados.sucesso) {
            throw new Error(dados.mensagem);
        }

        // replace() tira a página atual do histórico, então "voltar" não leva ao conteúdo logado
        window.location.replace('./index.html');

    } catch (erro) {

        console.error('Erro ao sair:', erro);
        alert('Não foi possível sair da conta. Tente novamente.');

    }
}

// Escuta o clique no document, assim funciona para qualquer botão Sair da página
document.addEventListener('click', (evento) => {
    const botaoSair = evento.target.closest('.sair, [data-sair]');

    if (botaoSair) {
        sair(evento);
    }
});