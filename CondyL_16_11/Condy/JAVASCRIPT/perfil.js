document.addEventListener('DOMContentLoaded', () => {

    // ---------- VERIFICAÇÃO: todos os elementos necessários existem no HTML? ----------

    const IDS_OBRIGATORIOS = [
        'fotoPerfilGrande', 'imagemBanner', 'nomePerfilGrande', 'bioPerfil',
        'inputImagemPerfil', 'botaoEditarPerfil',
        'modalEditarOverlay', 'modalEditarFechar', 'botaoCancelarEditar', 'botaoSalvarEditar',
        'previewBannerEditar', 'previewFotoEditar',
        'editarAlterarFoto', 'editarRemoverFoto', 'editarAlterarBanner', 'editarRemoverBanner',
        'campoNome', 'erroNomeEditar', 'campoBio', 'contadorBio',
        'modalRecorteOverlay', 'tituloRecorte', 'areaRecorte', 'imagemRecorte',
        'molduraRecorte', 'controleZoom', 'botaoCancelarRecorte', 'botaoConfirmarRecorte',
        'modalTermosOverlay', 'modalTermosFechar'
    ];

    const idsFaltando = IDS_OBRIGATORIOS.filter(id => !document.getElementById(id));

    if (idsFaltando.length > 0) {
        alert(
            'Faltam estes elementos no perfil.html (o id precisa ser exatamente igual):\n\n' +
            idsFaltando.join('\n')
        );
        return; // para aqui, para não dar erro em cascata
    }

    // ---------- CONSTANTES ----------

    const FOTO_PADRAO = 'IMAGENS/foto_de_perfil.png';
    const BANNER_PADRAO = 'IMAGENS/Banner.png'; // exemplo: troque depois por um banner padrão de verdade
    const NOME_PADRAO = 'Nome de Usuário';

    const CHAVE_FOTO = 'condy_foto_perfil';
    const CHAVE_NOME = 'condy_nome_perfil';
    const CHAVE_BANNER = 'condy_banner_perfil';
    const CHAVE_BIO = 'condy_bio_perfil';

    // Configuração do recorte de cada tipo de imagem
    // area = caixa onde se arrasta | moldura = parte que será salva | saida = resolução final
    const CONFIG_RECORTE = {
        foto: {
            titulo: 'Ajuste sua foto',
            areaL: 400, areaH: 400,
            molduraL: 340, molduraH: 340, circulo: true,
            saidaL: 400, saidaH: 400, qualidade: 0.85
        },
        banner: {
            titulo: 'Ajuste seu banner',
            areaL: 540, areaH: 180,
            molduraL: 540, molduraH: 180, circulo: false,
            saidaL: 1200, saidaH: 400, qualidade: 0.8
        }
    };

    // ---------- ELEMENTOS ----------

    const fotoPerfilGrande = document.getElementById('fotoPerfilGrande');
    const imagemBanner = document.getElementById('imagemBanner');
    const nomePerfilGrande = document.getElementById('nomePerfilGrande');
    const bioPerfil = document.getElementById('bioPerfil');
    const inputImagemPerfil = document.getElementById('inputImagemPerfil');

    // ---------- UTILITÁRIOS ----------

    function salvarChave(chave, valor) {
        try {
            localStorage.setItem(chave, valor);
            return true;
        } catch (erro) {
            alert('A imagem ficou grande demais para salvar. Tente uma imagem menor.');
            console.error('Erro ao salvar:', erro);
            return false;
        }
    }

    function abrirOverlay(overlay) {
        overlay.style.display = 'flex';
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                overlay.classList.add('ativo');
            });
        });
    }

    function fecharOverlay(overlay, depois) {
        overlay.classList.remove('ativo');
        setTimeout(() => {
            overlay.style.display = 'none';
            if (depois) depois();
        }, 200);
    }

    // ---------- LER DADOS SALVOS ----------

    function fotoAtual() {
        return localStorage.getItem(CHAVE_FOTO) || FOTO_PADRAO;
    }

    function bannerAtual() {
        return localStorage.getItem(CHAVE_BANNER) || BANNER_PADRAO;
    }

    function nomeAtual() {
        return localStorage.getItem(CHAVE_NOME) || NOME_PADRAO;
    }

    function bioAtual() {
        return localStorage.getItem(CHAVE_BIO) || '';
    }

    // ---------- APLICAR DADOS NA TELA ----------

    function aplicarFoto() {
        fotoPerfilGrande.src = fotoAtual();

        // foto da sidebar
        document.querySelectorAll('.foto-perfil').forEach(img => {
            img.src = fotoAtual();
        });
    }

    function aplicarNome() {
        const nome = nomeAtual();
        nomePerfilGrande.textContent = nome;

        // nome da sidebar
        document.querySelectorAll('.nome-do-usuario').forEach(el => {
            el.textContent = nome;
        });
    }

    function aplicarBanner() {
        imagemBanner.src = bannerAtual();
    }

    function aplicarBio() {
        const bio = bioAtual();

        if (bio) {
            bioPerfil.textContent = bio; // textContent: nada digitado vira HTML
            bioPerfil.classList.remove('vazia');
        } else {
            bioPerfil.textContent = 'Sem bio por enquanto. Clique em "Editar perfil" para adicionar uma.';
            bioPerfil.classList.add('vazia');
        }
    }

    // Se uma imagem salva estiver corrompida, volta para a padrão
    fotoPerfilGrande.onerror = () => {
        localStorage.removeItem(CHAVE_FOTO);
        fotoPerfilGrande.onerror = null;
        fotoPerfilGrande.src = FOTO_PADRAO;
    };

    imagemBanner.onerror = () => {
        localStorage.removeItem(CHAVE_BANNER);
        imagemBanner.onerror = null;
        imagemBanner.src = BANNER_PADRAO;
    };

    // Carrega tudo ao abrir a página
    aplicarFoto();
    aplicarNome();
    aplicarBanner();
    aplicarBio();

    // ---------- ESCOLHER IMAGEM -> RECORTAR ----------

    let tipoPendente = null;
    let callbackPendente = null;

    function escolherImagem(tipo, aoConfirmar) {
        tipoPendente = tipo;
        callbackPendente = aoConfirmar;
        inputImagemPerfil.click();
    }

    inputImagemPerfil.addEventListener('change', (e) => {
        const arquivo = e.target.files[0];
        if (!arquivo) return;

        const leitor = new FileReader();
        leitor.onload = (evento) => {
            abrirRecorte(tipoPendente, evento.target.result, callbackPendente);
        };
        leitor.readAsDataURL(arquivo);

        inputImagemPerfil.value = ''; // permite escolher o mesmo arquivo de novo depois
    });

    // ---------- RECORTE (serve para foto e banner) ----------

    const modalRecorteOverlay = document.getElementById('modalRecorteOverlay');
    const tituloRecorte = document.getElementById('tituloRecorte');
    const areaRecorte = document.getElementById('areaRecorte');
    const imagemRecorte = document.getElementById('imagemRecorte');
    const molduraRecorte = document.getElementById('molduraRecorte');
    const controleZoom = document.getElementById('controleZoom');

    let cfgAtual = null;
    let callbackRecorte = null;
    let escalaBase = 1;
    let escalaAtual = 1;
    let posX = 0;
    let posY = 0;
    let larguraOriginal = 0;
    let alturaOriginal = 0;
    let arrastando = false;
    let inicioArrasteX = 0;
    let inicioArrasteY = 0;

    function abrirRecorte(tipo, urlImagem, aoConfirmar) {
        cfgAtual = CONFIG_RECORTE[tipo];
        callbackRecorte = aoConfirmar;

        tituloRecorte.textContent = cfgAtual.titulo;

        areaRecorte.style.width = cfgAtual.areaL + 'px';
        areaRecorte.style.height = cfgAtual.areaH + 'px';

        molduraRecorte.style.width = cfgAtual.molduraL + 'px';
        molduraRecorte.style.height = cfgAtual.molduraH + 'px';
        molduraRecorte.classList.toggle('circulo', cfgAtual.circulo);
        molduraRecorte.classList.toggle('retangulo', !cfgAtual.circulo);

        imagemRecorte.src = urlImagem;
        abrirOverlay(modalRecorteOverlay);
    }

    function fecharRecorte() {
        fecharOverlay(modalRecorteOverlay, () => {
            imagemRecorte.removeAttribute('src');
        });
    }

    imagemRecorte.addEventListener('load', () => {
        if (!cfgAtual) return;

        larguraOriginal = imagemRecorte.naturalWidth;
        alturaOriginal = imagemRecorte.naturalHeight;

        // escala mínima para cobrir a ÁREA inteira (nunca sobram faixas vazias)
        escalaBase = Math.max(cfgAtual.areaL / larguraOriginal, cfgAtual.areaH / alturaOriginal);
        escalaAtual = escalaBase;
        controleZoom.value = 1;

        posX = (cfgAtual.areaL - larguraOriginal * escalaAtual) / 2;
        posY = (cfgAtual.areaH - alturaOriginal * escalaAtual) / 2;

        aplicarTransformacao();
    });

    function aplicarTransformacao() {
        imagemRecorte.style.transform = `translate(${posX}px, ${posY}px) scale(${escalaAtual})`;
    }

    function limitarPosicao() {
        const minX = cfgAtual.areaL - larguraOriginal * escalaAtual;
        const minY = cfgAtual.areaH - alturaOriginal * escalaAtual;

        posX = Math.min(0, Math.max(minX, posX));
        posY = Math.min(0, Math.max(minY, posY));
    }

    controleZoom.addEventListener('input', () => {
        if (!cfgAtual) return;

        const centroX = cfgAtual.areaL / 2;
        const centroY = cfgAtual.areaH / 2;

        // ponto da imagem que está no centro, antes de mudar o zoom
        const pontoImgX = (centroX - posX) / escalaAtual;
        const pontoImgY = (centroY - posY) / escalaAtual;

        escalaAtual = escalaBase * parseFloat(controleZoom.value);

        posX = centroX - pontoImgX * escalaAtual;
        posY = centroY - pontoImgY * escalaAtual;

        limitarPosicao();
        aplicarTransformacao();
    });

    // arrastar (mouse e toque)
    areaRecorte.addEventListener('pointerdown', (e) => {
        arrastando = true;
        inicioArrasteX = e.clientX - posX;
        inicioArrasteY = e.clientY - posY;
        areaRecorte.setPointerCapture(e.pointerId);
    });

    areaRecorte.addEventListener('pointermove', (e) => {
        if (!arrastando || !cfgAtual) return;

        posX = e.clientX - inicioArrasteX;
        posY = e.clientY - inicioArrasteY;

        limitarPosicao();
        aplicarTransformacao();
    });

    areaRecorte.addEventListener('pointerup', () => { arrastando = false; });
    areaRecorte.addEventListener('pointercancel', () => { arrastando = false; });

    document.getElementById('botaoCancelarRecorte').addEventListener('click', fecharRecorte);

    document.getElementById('botaoConfirmarRecorte').addEventListener('click', () => {
        const canvas = document.createElement('canvas');
        canvas.width = cfgAtual.saidaL;
        canvas.height = cfgAtual.saidaH;
        const ctx = canvas.getContext('2d');

        // fundo branco (JPEG não tem transparência)
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const fator = cfgAtual.saidaL / cfgAtual.molduraL;
        const offsetX = (cfgAtual.areaL - cfgAtual.molduraL) / 2;
        const offsetY = (cfgAtual.areaH - cfgAtual.molduraH) / 2;

        ctx.drawImage(
            imagemRecorte,
            0, 0, larguraOriginal, alturaOriginal,
            (posX - offsetX) * fator,
            (posY - offsetY) * fator,
            larguraOriginal * escalaAtual * fator,
            alturaOriginal * escalaAtual * fator
        );

        // JPEG comprimido: arquivo bem menor, evita estourar o limite do localStorage
        const resultado = canvas.toDataURL('image/jpeg', cfgAtual.qualidade);
        const aoConfirmar = callbackRecorte;

        fecharRecorte();
        if (aoConfirmar) aoConfirmar(resultado);
    });

    // ---------- EDITAR PERFIL (modal: banner + foto + nome + bio) ----------

    const modalEditarOverlay = document.getElementById('modalEditarOverlay');
    const previewBannerEditar = document.getElementById('previewBannerEditar');
    const previewFotoEditar = document.getElementById('previewFotoEditar');
    const campoNome = document.getElementById('campoNome');
    const erroNomeEditar = document.getElementById('erroNomeEditar');
    const campoBio = document.getElementById('campoBio');
    const contadorBio = document.getElementById('contadorBio');

    // undefined = sem mudança | null = remover | texto = nova imagem
    let rascunhoFoto;
    let rascunhoBanner;

    function atualizarContadorBio() {
        contadorBio.textContent = `${campoBio.value.length}/${campoBio.maxLength}`;
    }

    function limparErroNome() {
        erroNomeEditar.textContent = '';
        erroNomeEditar.classList.remove('ativo');
    }

    function abrirEditarPerfil() {
        rascunhoFoto = undefined;
        rascunhoBanner = undefined;

        previewFotoEditar.src = fotoAtual();
        previewBannerEditar.src = bannerAtual();
        campoNome.value = nomeAtual();
        campoBio.value = bioAtual();
        limparErroNome();
        atualizarContadorBio();

        abrirOverlay(modalEditarOverlay);
    }

    function fecharEditarPerfil() {
        fecharOverlay(modalEditarOverlay);
    }

    document.getElementById('botaoEditarPerfil').addEventListener('click', abrirEditarPerfil);
    document.getElementById('modalEditarFechar').addEventListener('click', fecharEditarPerfil);
    document.getElementById('botaoCancelarEditar').addEventListener('click', fecharEditarPerfil);

    campoBio.addEventListener('input', atualizarContadorBio);
    campoNome.addEventListener('input', limparErroNome);

    // foto
    document.getElementById('editarAlterarFoto').addEventListener('click', () => {
        escolherImagem('foto', (dataUrl) => {
            rascunhoFoto = dataUrl;
            previewFotoEditar.src = dataUrl;
        });
    });

    document.getElementById('editarRemoverFoto').addEventListener('click', () => {
        rascunhoFoto = null;
        previewFotoEditar.src = FOTO_PADRAO;
    });

    // banner
    document.getElementById('editarAlterarBanner').addEventListener('click', () => {
        escolherImagem('banner', (dataUrl) => {
            rascunhoBanner = dataUrl;
            previewBannerEditar.src = dataUrl;
        });
    });

    document.getElementById('editarRemoverBanner').addEventListener('click', () => {
        rascunhoBanner = null;
        previewBannerEditar.src = BANNER_PADRAO;
    });

    // salvar tudo de uma vez
    function salvarEdicao() {

        // nome (valida primeiro, antes de aplicar qualquer mudança)
        const novoNome = campoNome.value.trim();
        if (novoNome.length < 2) {
            erroNomeEditar.textContent = 'Digite um nome com pelo menos 2 letras.';
            erroNomeEditar.classList.add('ativo');
            campoNome.focus();
            return;
        }

        // foto
        if (rascunhoFoto === null) {
            localStorage.removeItem(CHAVE_FOTO);
        } else if (typeof rascunhoFoto === 'string') {
            if (!salvarChave(CHAVE_FOTO, rascunhoFoto)) return;
        }

        // banner
        if (rascunhoBanner === null) {
            localStorage.removeItem(CHAVE_BANNER);
        } else if (typeof rascunhoBanner === 'string') {
            if (!salvarChave(CHAVE_BANNER, rascunhoBanner)) return;
        }

        // nome
        localStorage.setItem(CHAVE_NOME, novoNome);

        // bio
        const bio = campoBio.value.trim();
        if (bio) {
            localStorage.setItem(CHAVE_BIO, bio);
        } else {
            localStorage.removeItem(CHAVE_BIO);
        }

        aplicarFoto();
        aplicarBanner();
        aplicarNome();
        aplicarBio();

        fecharEditarPerfil();
    }

    document.getElementById('botaoSalvarEditar').addEventListener('click', salvarEdicao);

    // Enter no campo de nome também salva
    campoNome.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') salvarEdicao();
    });

    // ---------- MODAL DE TERMOS ----------

    const modalTermosOverlay = document.getElementById('modalTermosOverlay');

    document.querySelectorAll('.abrir-termos').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            abrirOverlay(modalTermosOverlay);
        });
    });

    document.getElementById('modalTermosFechar').addEventListener('click', () => {
        fecharOverlay(modalTermosOverlay);
    });

    modalTermosOverlay.addEventListener('click', (e) => {
        if (e.target.id === 'modalTermosOverlay') fecharOverlay(modalTermosOverlay);
    });

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