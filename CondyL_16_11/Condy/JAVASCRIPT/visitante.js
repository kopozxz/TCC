document.addEventListener('DOMContentLoaded', () => {

    const modalLoginOverlay = document.getElementById('modalLoginOverlay');
    const modalLoginFechar = document.getElementById('modalLoginFechar');

    function abrirModalLogin() {
        modalLoginOverlay.style.display = 'flex';

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                modalLoginOverlay.classList.add('ativo');
            });
        });
    }

    function fecharModalLogin() {
        modalLoginOverlay.classList.remove('ativo');
        setTimeout(() => {
            modalLoginOverlay.style.display = 'none';
        }, 200);
    }

    modalLoginFechar.addEventListener('click', fecharModalLogin);

    modalLoginOverlay.addEventListener('click', (e) => {
        if (e.target.id === 'modalLoginOverlay') {
            fecharModalLogin();
        }
    });

    // Qualquer interação de post, comentário ou criação exige login
    const seletoresBloqueados = [
        '.btn-like',
        '.btn-comentario',
        '.btn-bookmark',
        '.btn-compartilhar',
        '.botao .enviar',
        '#botaoClip',
        '.container-post-branco textarea'
    ].join(', ');

    document.body.addEventListener('click', (e) => {
        const alvoBloqueado = e.target.closest(seletoresBloqueados);
        if (alvoBloqueado) {
            e.preventDefault();
            abrirModalLogin();
        }
    });

    // impede digitação no campo de post (mesmo sendo readonly, reforça o clique)
    const textareaCriarPost = document.querySelector('.container-post-branco textarea');
    if (textareaCriarPost) {
        textareaCriarPost.addEventListener('focus', (e) => {
            e.target.blur();
            abrirModalLogin();
        });
    }

});