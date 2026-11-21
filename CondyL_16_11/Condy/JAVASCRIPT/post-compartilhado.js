document.addEventListener('DOMContentLoaded', () => {

    // ---------- MODAL DE LOGIN NECESSÁRIO ----------

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

    // ---------- ABRIR / FECHAR COMENTÁRIOS ----------

    document.body.addEventListener('click', (e) => {
        const botaoComentario = e.target.closest('.btn-comentario');
        if (!botaoComentario) return;

        botaoComentario.classList.remove('animate');
        void botaoComentario.offsetWidth;
        botaoComentario.classList.add('animate');

        const secao = botaoComentario.closest('.post-preto').querySelector('.secao-comentarios');
        secao.classList.toggle('ativo');
    });

    // Curtir, salvar, compartilhar, responder e escrever comentário exigem login
    // (o ícone de comentário fica de fora: não faz nada ao clicar)
    const seletoresBloqueados = [
        '.btn-like',
        '.btn-bookmark',
        '.btn-compartilhar',
        '.btn-responder',
        '.enviar-comentario',
        '.campo-comentario'
    ].join(', ');

    document.body.addEventListener('click', (e) => {
        const alvoBloqueado = e.target.closest(seletoresBloqueados);
        if (alvoBloqueado) {
            e.preventDefault();
            abrirModalLogin();
        }
    });

    // ---------- MODAL DE TERMOS ----------

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

});