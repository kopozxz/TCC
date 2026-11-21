// Página estática por enquanto — reservado para futuras interações
// (ex: animação de entrada dos cards ao rolar a página)

document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.card-membro');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                entry.target.style.animation = `surgirCard 0.5s ease forwards`;
                entry.target.style.animationDelay = `${index * 0.07}s`;
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    cards.forEach(card => {
        card.style.opacity = '0';
        observer.observe(card);
    });
});

document.addEventListener('DOMContentLoaded', () => {

    // ---------- EFEITO DE RASTRO DO MOUSE ----------

    document.body.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth) * 100;
        const y = (e.clientY / window.innerHeight) * 100;

        document.body.style.setProperty('--mouse-x', `${x}%`);
        document.body.style.setProperty('--mouse-y', `${y}%`);
    });

    // ---------- ANIMAÇÃO DE ENTRADA DOS CARDS (já existente) ----------

    const cards = document.querySelectorAll('.card-membro');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                entry.target.style.animation = `surgirCard 0.5s ease forwards`;
                entry.target.style.animationDelay = `${index * 0.07}s`;
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    cards.forEach(card => {
        card.style.opacity = '0';
        observer.observe(card);
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


const botaoVoltar = document.getElementById('botaoVoltar');

if (botaoVoltar) {
    botaoVoltar.addEventListener('click', () => {
        window.close();

        // se a aba não fechou (navegador bloqueou por segurança), redireciona como alternativa
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 100);
    });
}