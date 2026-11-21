// ---------- CARREGAR FOTO E NOME DO PERFIL (sincroniza com a página de perfil) ----------

function aplicarPerfilSalvo() {
    const fotoSalva = localStorage.getItem('condy_foto_perfil');
    const nomeSalvo = localStorage.getItem('condy_nome_perfil');

    if (fotoSalva) {
        document.querySelectorAll('.foto-perfil').forEach(img => img.src = fotoSalva);
    }

    if (nomeSalvo) {
        document.querySelectorAll('.nome-do-usuario').forEach(el => el.textContent = nomeSalvo);
    }
}

aplicarPerfilSalvo();

document.addEventListener('DOMContentLoaded', () => {

    // sincroniza foto/nome da sidebar, igual as outras páginas
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

    // marca como "lida" ao clicar na notificação (exemplo de comportamento, sem back-end de verdade)
    document.querySelectorAll('.item-notificacao').forEach(item => {
        item.addEventListener('click', (e) => {
            // não remove o "não lida" se o clique foi no botão de ir pro post
            if (e.target.closest('.ir-para-post')) return;

            item.classList.remove('nao-lida');
        });
    });

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