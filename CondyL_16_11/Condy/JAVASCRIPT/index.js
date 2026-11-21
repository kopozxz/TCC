// ---------- VERIFICAÇÃO DE IDADE (13+) ----------

(function verificarIdade() {
    const jaConfirmou = sessionStorage.getItem('condy_idade_confirmada');

    if (jaConfirmou === 'true') {
        return; // já confirmou nesta sessão, não precisa perguntar de novo
    }

    const modalIdadeOverlay = document.getElementById('modalIdadeOverlay');
    const telaBloqueio = document.getElementById('telaBloqueio');
    const botaoIdadeSim = document.getElementById('botaoIdadeSim');
    const botaoIdadeNao = document.getElementById('botaoIdadeNao');

    function abrirModalIdade() {
        modalIdadeOverlay.style.display = 'flex';
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                modalIdadeOverlay.classList.add('ativo');
            });
        });
    }

    function fecharModalIdade() {
        modalIdadeOverlay.classList.remove('ativo');
        setTimeout(() => {
            modalIdadeOverlay.style.display = 'none';
        }, 200);
    }

    document.addEventListener('DOMContentLoaded', abrirModalIdade);

    botaoIdadeSim.addEventListener('click', () => {
        sessionStorage.setItem('condy_idade_confirmada', 'true');
        fecharModalIdade();
    });

    botaoIdadeNao.addEventListener('click', () => {
        fecharModalIdade();
        telaBloqueio.classList.add('ativo');
        document.body.style.overflow = 'hidden';
    });
})();

// ---------- ELEMENTOS PRINCIPAIS ----------

const botaoAbaLogin = document.getElementById('botaoAbaLogin');
const botaoAbaCadastro = document.getElementById('botaoAbaCadastro');
const formularioLogin = document.getElementById('formularioLogin');
const formularioCadastro = document.getElementById('formularioCadastro');
const irParaCadastro = document.getElementById('irParaCadastro');
const irParaLogin = document.getElementById('irParaLogin');

// ---------- ALTERNAR LOGIN / CADASTRO ----------

function trocarFormulario(mostrar, esconder, botaoAtivo, botaoInativo) {
    esconder.classList.remove('mostrar');

    setTimeout(() => {
        esconder.classList.remove('ativo');
        mostrar.classList.add('ativo');

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                mostrar.classList.add('mostrar');
            });
        });
    }, 150);

    botaoAtivo.classList.add('ativo');
    botaoInativo.classList.remove('ativo');
}

function mostrarLogin() {
    trocarFormulario(formularioLogin, formularioCadastro, botaoAbaLogin, botaoAbaCadastro);
}

function mostrarCadastro() {
    trocarFormulario(formularioCadastro, formularioLogin, botaoAbaCadastro, botaoAbaLogin);
}

botaoAbaLogin.addEventListener('click', mostrarLogin);
botaoAbaCadastro.addEventListener('click', mostrarCadastro);
irParaCadastro.addEventListener('click', mostrarCadastro);
irParaLogin.addEventListener('click', mostrarLogin);

// ---------- EFEITO DE LUZ/SOMBRA SEGUINDO O MOUSE ----------

const vitrineMarca = document.querySelector('.vitrine-marca');

if (vitrineMarca) {
    vitrineMarca.addEventListener('mousemove', (e) => {
        const rect = vitrineMarca.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        vitrineMarca.style.setProperty('--mouse-x', `${x}%`);
        vitrineMarca.style.setProperty('--mouse-y', `${y}%`);
    });
}

const areaAutenticacao = document.querySelector('.area-autenticacao');

if (areaAutenticacao) {
    areaAutenticacao.addEventListener('mousemove', (e) => {
        const rect = areaAutenticacao.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        areaAutenticacao.style.setProperty('--mouse-x', `${x}%`);
        areaAutenticacao.style.setProperty('--mouse-y', `${y}%`);
    });
}

// ---------- FUNÇÕES AUXILIARES DE VALIDAÇÃO ----------

function emailValido(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function mostrarErro(inputEl, erroEl, mensagem) {
    inputEl.classList.add('campo-invalido');
    erroEl.textContent = mensagem;
    erroEl.classList.add('ativo');
}

function limparErro(inputEl, erroEl) {
    inputEl.classList.remove('campo-invalido');
    erroEl.textContent = '';
    erroEl.classList.remove('ativo');
}

function calcularIdade(dataNascimento) {
    const hoje = new Date();
    // 'T00:00:00' faz o navegador usar o fuso local (sem isso a data pode "voltar" um dia)
    const nascimento = new Date(dataNascimento + 'T00:00:00');

    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mesAtual = hoje.getMonth();
    const mesNascimento = nascimento.getMonth();

    if (mesAtual < mesNascimento || (mesAtual === mesNascimento && hoje.getDate() < nascimento.getDate())) {
        idade--;
    }

    return idade;
}

// Confere as regras da senha e devolve a lista do que está faltando
function verificarRegrasSenha(senha) {
    const faltando = [];

    if (senha.length < 8) faltando.push('no mínimo 8 caracteres');
    if (!/\p{Ll}/u.test(senha)) faltando.push('uma letra minúscula');
    if (!/\p{Lu}/u.test(senha)) faltando.push('uma letra maiúscula');
    if (!/\d/.test(senha)) faltando.push('um número');
    if (!/[^\p{L}\p{N}\s]/u.test(senha)) faltando.push('um caractere especial (ex.: ! @ # $ %)');

    return faltando;
}

// Bloqueia no calendário as datas que ainda não chegaram
const campoNascimento = document.getElementById('cadastroNascimento');
if (campoNascimento) {
    campoNascimento.max = new Date().toISOString().split('T')[0];
}

// ---------- MENSAGEM DE E-MAIL JÁ CADASTRADO (para a equipe ligar ao back-end) ----------

function mostrarEmailJaUtilizado() {
    const emailInput = document.getElementById('cadastroEmail');
    const erroEmailServidor = document.getElementById('erroCadastroEmailServidor');

    emailInput.classList.add('campo-invalido');
    erroEmailServidor.textContent = 'Este e-mail já está cadastrado. Tente fazer login ou use outro e-mail.';
    erroEmailServidor.classList.add('ativo');
}

function limparEmailJaUtilizado() {
    const emailInput = document.getElementById('cadastroEmail');
    const erroEmailServidor = document.getElementById('erroCadastroEmailServidor');

    emailInput.classList.remove('campo-invalido');
    erroEmailServidor.textContent = '';
    erroEmailServidor.classList.remove('ativo');
}

// ---------- VALIDAÇÃO DO LOGIN ----------


formularioLogin.addEventListener('submit', async (e) => {

    e.preventDefault();

    const emailInput = document.getElementById('loginEmail');
    const senhaInput = document.getElementById('loginSenha');
    const erroEmail = document.getElementById('erroLoginEmail');
    const erroSenha = document.getElementById('erroLoginSenha');

    limparErro(emailInput, erroEmail);
    limparErro(senhaInput, erroSenha);

    let valido = true;

    if (!emailValido(emailInput.value.trim())) {
        mostrarErro(emailInput, erroEmail, 'Digite um e-mail válido.');
        valido = false;
    }

    if (senhaInput.value.length < 8) {
        mostrarErro(senhaInput, erroSenha, 'A senha deve ter no mínimo 8 caracteres.');
        valido = false;
    }

    if (!valido) {
        return;
    }

    try {

        const resposta = await fetch('./PHP/login.php', {
            method: 'POST',
            body: new FormData(formularioLogin)
        });

        if (!resposta.ok) {
            throw new Error('Erro na resposta do servidor.');
        }

        const dados = await resposta.json();

        if (dados.sucesso) {

            window.location.href = './principal.html';

        } else {

            mostrarErro(
                senhaInput,
                erroSenha,
                dados.mensagem
            );

        }

    } catch (erro) {

        console.error('Erro no login:', erro);

        mostrarErro(
            senhaInput,
            erroSenha,
            'Não foi possível conectar ao servidor. Tente novamente.'
        );

    }

});


// ---------- VALIDAÇÃO DO CADASTRO ----------


formularioCadastro.addEventListener('submit', async (e) => {

    // Impede o envio tradicional do formulário, que abriria a página branca do PHP
    e.preventDefault();

    const nomeInput = document.getElementById('cadastroNome');
    const nascimentoInput = document.getElementById('cadastroNascimento');
    const emailInput = document.getElementById('cadastroEmail');
    const senhaInput = document.getElementById('cadastroSenha');
    const confirmarSenhaInput = document.getElementById('cadastroConfirmarSenha');
    const aceitarTermosInput = document.getElementById('aceitarTermos');

    const erroNome = document.getElementById('erroCadastroNome');
    const erroNascimento = document.getElementById('erroCadastroNascimento');
    const erroEmail = document.getElementById('erroCadastroEmail');
    const erroSenha = document.getElementById('erroCadastroSenha');
    const erroConfirmarSenha = document.getElementById('erroCadastroConfirmarSenha');
    const erroAceitarTermos = document.getElementById('erroAceitarTermos');

    // Limpa as mensagens de erro anteriores
    limparErro(nomeInput, erroNome);
    limparErro(nascimentoInput, erroNascimento);
    limparErro(emailInput, erroEmail);
    limparEmailJaUtilizado();
    limparErro(senhaInput, erroSenha);
    limparErro(confirmarSenhaInput, erroConfirmarSenha);
    erroAceitarTermos.textContent = '';
    erroAceitarTermos.classList.remove('ativo');

    let valido = true;

    // Validação do nome
    if (nomeInput.value.trim().length < 2) {
        mostrarErro(nomeInput, erroNome, 'Digite seu nome.');
        valido = false;
    }

    // Validação da data de nascimento
    if (!nascimentoInput.value) {
        mostrarErro(nascimentoInput, erroNascimento, 'Informe sua data de nascimento.');
        valido = false;
    } else {
        const dataEscolhida = new Date(nascimentoInput.value + 'T00:00:00');
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);

        if (dataEscolhida > hoje || dataEscolhida.getFullYear() < 1900) {
            mostrarErro(nascimentoInput, erroNascimento, 'Coloque uma data válida.');
            valido = false;
        } else if (calcularIdade(nascimentoInput.value) < 13) {
            mostrarErro(nascimentoInput, erroNascimento, 'Você precisa ter 13 anos ou mais para se cadastrar.');
            valido = false;
        }
    }

    // Validação do e-mail
    if (!emailValido(emailInput.value.trim())) {
        mostrarErro(emailInput, erroEmail, 'Digite um e-mail válido.');
        valido = false;
    }

    // Validação da senha
    // Mínimo de 8 caracteres, letra minúscula, maiúscula, número e caractere especial
    const regrasFaltando = verificarRegrasSenha(senhaInput.value);

    if (regrasFaltando.length > 0) {
        mostrarErro(
            senhaInput,
            erroSenha,
            'A senha precisa ter: ' + regrasFaltando.join(', ') + '.'
        );
        valido = false;
    }

    // Validação da confirmação da senha
    if (
        confirmarSenhaInput.value !== senhaInput.value ||
        confirmarSenhaInput.value === ''
    ) {
        mostrarErro(
            confirmarSenhaInput,
            erroConfirmarSenha,
            'As senhas não coincidem.'
        );
        valido = false;
    }

    // Validação do aceite dos termos
    if (!aceitarTermosInput.checked) {
        erroAceitarTermos.textContent =
            'Você precisa ativar esta opção e aceitar os Termos de Uso e Termos de Privacidade para se cadastrar.';

        erroAceitarTermos.classList.add('ativo');
        valido = false;
    }

    // Se todas as validações passarem, envia os dados ao back-end
    if (valido) {

        try {

            // Envia os dados ao PHP sem sair da página atual
            const resposta = await fetch('./PHP/cadastro.php', {
                method: 'POST',
                body: new FormData(formularioCadastro)
            });

            // Converte a resposta do PHP de JSON para JavaScript
            const dados = await resposta.json();

            if (dados.sucesso) {

                // Cadastro realizado: volta para a página inicial
                window.location.href = './index.html';

            } else if (resposta.status === 409) {

                // O e-mail já está cadastrado
                mostrarEmailJaUtilizado();

            } else if (resposta.status === 400) {

                // A senha não atende aos requisitos do back-end
                mostrarErro(senhaInput, erroSenha, dados.mensagem);

            } else {

                // Exibe outros erros retornados pelo servidor
                mostrarErro(emailInput, erroEmail, dados.mensagem);

            }

        } catch (erro) {

            // Registra o erro no console para facilitar a identificação do problema
            console.error('Erro no cadastro:', erro);

            // Informa ao usuário que houve um problema de comunicação
            mostrarErro(
                emailInput,
                erroEmail,
                'Não foi possível conectar ao servidor. Tente novamente.'
            );

        }
    }
});


// ---------- RECUPERAÇÃO DE SENHA ----------

const modalSenhaOverlay = document.getElementById('modalSenhaOverlay');
const modalSenhaFechar = document.getElementById('modalSenhaFechar');
const abrirEsqueciSenha = document.getElementById('abrirEsqueciSenha');
const passoPedirEmail = document.getElementById('passoPedirEmail');
const passoConfirmacao = document.getElementById('passoConfirmacao');
const emailRecuperacao = document.getElementById('emailRecuperacao');
const erroEmailRecuperacao = document.getElementById('erroEmailRecuperacao');
const botaoEnviarRecuperacao = document.getElementById('botaoEnviarRecuperacao');
const botaoFecharConfirmacao = document.getElementById('botaoFecharConfirmacao');
const emailEnviadoPara = document.getElementById('emailEnviadoPara');

function abrirModalSenha() {
    passoPedirEmail.style.display = 'block';
    passoConfirmacao.style.display = 'none';
    emailRecuperacao.value = '';
    limparErro(emailRecuperacao, erroEmailRecuperacao);

    modalSenhaOverlay.style.display = 'flex';

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            modalSenhaOverlay.classList.add('ativo');
        });
    });
}

function fecharModalSenha() {
    modalSenhaOverlay.classList.remove('ativo');
    setTimeout(() => {
        modalSenhaOverlay.style.display = 'none';
    }, 200);
}

abrirEsqueciSenha.addEventListener('click', abrirModalSenha);
modalSenhaFechar.addEventListener('click', fecharModalSenha);

modalSenhaOverlay.addEventListener('click', (e) => {
    if (e.target.id === 'modalSenhaOverlay') {
        fecharModalSenha();
    }
});

botaoEnviarRecuperacao.addEventListener('click', () => {
    limparErro(emailRecuperacao, erroEmailRecuperacao);

    if (!emailValido(emailRecuperacao.value.trim())) {
        mostrarErro(emailRecuperacao, erroEmailRecuperacao, 'Digite um e-mail válido.');
        return;
    }

    // aqui normalmente entraria a chamada ao back-end de verdade
    emailEnviadoPara.textContent = emailRecuperacao.value.trim();

    passoPedirEmail.style.display = 'none';
    passoConfirmacao.style.display = 'block';
});

botaoFecharConfirmacao.addEventListener('click', fecharModalSenha);

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