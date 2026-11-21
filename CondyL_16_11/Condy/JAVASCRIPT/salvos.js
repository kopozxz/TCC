document.addEventListener('DOMContentLoaded', () => {

    // ---------- SINCRONIZAR FOTO E NOME DA SIDEBAR ----------

    const fotoSalva = localStorage.getItem('condy_foto_perfil');
    const nomeSalvo = localStorage.getItem('condy_nome_perfil');

    if (fotoSalva) {
        document.querySelectorAll('.foto-perfil').forEach(img => {
            img.src = fotoSalva;
            img.onerror = () => {
                img.src = 'IMAGENS/foto_de_perfil.png';
                localStorage.removeItem('condy_foto_perfil');
            };
        });
    }

    if (nomeSalvo) {
        document.querySelectorAll('.nome-do-usuario').forEach(el => el.textContent = nomeSalvo);
    }

    // ---------- FUNÇÃO DE COMENTÁRIOS ----------

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
            <img src="IMAGENS/foto_de_perfil.png" alt="Foto de Perfil">
            <div class="comentario-conteudo">
                <p class="nome-comentario">Nome de Usuário</p>
                <p class="texto-comentario"></p>
            </div>
            <button class="remover-comentario">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                </svg>
            </button>
        `;
        comentario.querySelector('.texto-comentario').textContent = texto;
        lista.appendChild(comentario);
        campo.value = '';

        if (contadorComentario) {
            contadorComentario.textContent = (parseInt(contadorComentario.textContent) || 0) + 1;
        }
    }

    document.body.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.target.classList.contains('campo-comentario')) {
            enviarComentario(e.target.closest('.secao-comentarios'));
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

        if (top < 10) top = rect.bottom + 10;
        if (left < 10) left = 10;

        menu.style.top = `${top}px`;
        menu.style.left = `${left}px`;

        menu.querySelectorAll('button[data-acao]').forEach(btn => {
            btn._botaoOrigem = botaoCompartilhar;
        });

        return menu;
    }

    // ---------- MODAL DE POST EXPANDIDO ----------

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
            document.getElementById('modalPostContainer').innerHTML = '';
            overlay.style.display = 'none';
            document.body.style.overflow = '';
        }, 250);
    }

    document.getElementById('modalFechar').addEventListener('click', fecharModalPost);

    document.getElementById('modalOverlay').addEventListener('click', (e) => {
        if (e.target.id === 'modalOverlay') fecharModalPost();
    });

    // ---------- MODAL DE CONFIRMAÇÃO (remover dos salvos) ----------

    let postParaRemover = null;

    function abrirConfirmacao(post) {
        postParaRemover = post;
        const overlay = document.getElementById('modalConfirmacaoOverlay');
        overlay.style.display = 'flex';

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                overlay.classList.add('ativo');
            });
        });
    }

    function fecharConfirmacao() {
        const overlay = document.getElementById('modalConfirmacaoOverlay');
        overlay.classList.remove('ativo');

        setTimeout(() => {
            overlay.style.display = 'none';
            postParaRemover = null;
        }, 200);
    }

    document.getElementById('btnCancelarConfirmacao').addEventListener('click', fecharConfirmacao);

    document.getElementById('modalConfirmacaoOverlay').addEventListener('click', (e) => {
        if (e.target.id === 'modalConfirmacaoOverlay') fecharConfirmacao();
    });

    document.getElementById('btnConfirmarConfirmacao').addEventListener('click', () => {
        if (postParaRemover) {
            const estavaNoModal = postParaRemover.classList.contains('post-clonado');

            if (postParaRemover._postOriginal) {
                postParaRemover._postOriginal.remove();
            }
            postParaRemover.remove();

            if (estavaNoModal) fecharModalPost();

            verificarListaVazia();
        }
        fecharConfirmacao();
    });

    function verificarListaVazia() {
        const restantes = document.querySelectorAll('main.conteudo-principal > .post-preto').length;
        document.getElementById('mensagemVazio').classList.toggle('ativo', restantes === 0);
    }

    // ---------- LISTENER PRINCIPAL DE CLIQUE ----------

    document.body.addEventListener('click', (e) => {

        // --- FECHAR MENU DE COMPARTILHAR AO CLICAR FORA ---
        const menuAberto = document.querySelector('.menu-compartilhar');
        if (menuAberto && !e.target.closest('.menu-compartilhar') && !e.target.closest('.btn-compartilhar')) {
            menuAberto.remove();
        }

        // BOOKMARK (ativo nesta página) → abre confirmação de remoção, igual o botão dedicado
        const bookmarkButton = e.target.closest('.btn-bookmark');
        if (bookmarkButton) {
            const post = bookmarkButton.closest('.post-preto');
            if (post) abrirConfirmacao(post);
            return;
        }

        // REMOVER DOS SALVOS (ícone no topo do post)
        const botaoRemoverSalvo = e.target.closest('.remover-salvo');
        if (botaoRemoverSalvo) {
            const post = botaoRemoverSalvo.closest('.post-preto');
            if (post) abrirConfirmacao(post);
            return;
        }

        // LIKE
        const likeButton = e.target.closest('.btn-like');
        if (likeButton) {
            const svg = likeButton.querySelector('svg');
            const contador = likeButton.querySelector('.contador-like');
            let contagem = parseInt(contador.textContent) || 0;

            likeButton.classList.remove('animate');
            void likeButton.offsetWidth;
            likeButton.classList.add('animate');
            likeButton.classList.toggle('active');
            const isLiked = likeButton.dataset.liked === 'true';

            if (!isLiked) {
                svg.setAttribute('class', 'bi bi-heart-fill');
                svg.innerHTML = `<path d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"/>`;
                likeButton.dataset.liked = 'true';
                contador.textContent = contagem + 1;
            } else {
                svg.setAttribute('class', 'bi bi-heart');
                svg.innerHTML = `<path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15"/>`;
                likeButton.dataset.liked = 'false';
                contador.textContent = Math.max(0, contagem - 1);
            }
            return;
        }

        // ABRIR/FECHAR COMENTÁRIOS
        const botaoComentario = e.target.closest('.btn-comentario');
        if (botaoComentario) {
            botaoComentario.classList.remove('animate');
            void botaoComentario.offsetWidth;
            botaoComentario.classList.add('animate');
            botaoComentario.closest('.post-preto').querySelector('.secao-comentarios').classList.toggle('ativo');
            return;
        }

        // REMOVER COMENTÁRIO
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

        // ENVIAR COMENTÁRIO
        const botaoEnviarComentario = e.target.closest('.enviar-comentario');
        if (botaoEnviarComentario) {
            enviarComentario(botaoEnviarComentario.closest('.secao-comentarios'));
            return;
        }

        // ABRIR MENU COMPARTILHAR
        const botaoCompartilhar = e.target.closest('.btn-compartilhar');
        if (botaoCompartilhar) {
            document.querySelectorAll('.menu-compartilhar').forEach(m => m.remove());
            const menu = criarMenuCompartilhar(botaoCompartilhar);
            menu.classList.add('ativo');
            return;
        }

        // CLICAR NUMA OPÇÃO DO MENU COMPARTILHAR
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

        // ABRIR MODAL DE POST EXPANDIDO
        const clicouEmInterativo = e.target.closest(
            '.post-branco button, .secao-comentarios, .modal-fechar, .btn-denunciar, .menu-compartilhar'
        );
        if (!clicouEmInterativo) {
            const postClicado = e.target.closest('.post-preto');
            if (postClicado && !postClicado.classList.contains('post-clonado')) {
                abrirModalPost(postClicado);
            }
            return;
        }

    });

    verificarListaVazia();

});

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