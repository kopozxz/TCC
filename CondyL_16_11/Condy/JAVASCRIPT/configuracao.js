document.addEventListener('DOMContentLoaded', () => {

    // ---------- AJUDANTE: pega um elemento e anota se ele não existe no HTML ----------

    const idsFaltando = [];

    function pegar(id) {
        const elemento = document.getElementById(id);
        if (!elemento) idsFaltando.push(id);
        return elemento;
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

    // ---------- SINCRONIZAR FOTO E NOME DA SIDEBAR ----------

    (function sincronizarSidebar() {
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
            document.querySelectorAll('.nome-do-usuario').forEach(el => {
                el.textContent = nomeSalvo;
            });
        }
    })();

    // ---------- MODAL DE CONFIRMAÇÃO (apagar conta / alterar senha) ----------

    const modalConfirmacaoOverlay = pegar('modalConfirmacaoOverlay');
    const textoConfirmacao = pegar('textoConfirmacao');
    const btnCancelarConfirmacao = pegar('btnCancelarConfirmacao');
    const btnConfirmarConfirmacao = pegar('btnConfirmarConfirmacao');
    const botaoApagarConta = pegar('botaoApagarConta');
    const botaoAlterarSenha = pegar('botaoAlterarSenha');

    if (modalConfirmacaoOverlay && textoConfirmacao && btnCancelarConfirmacao && btnConfirmarConfirmacao) {

        let acaoConfirmada = null;

        function abrirConfirmacao(mensagem, aoConfirmar) {
            textoConfirmacao.textContent = mensagem;
            acaoConfirmada = aoConfirmar;
            abrirOverlay(modalConfirmacaoOverlay);
        }

        function fecharConfirmacao() {
            fecharOverlay(modalConfirmacaoOverlay, () => {
                acaoConfirmada = null;
            });
        }

        btnCancelarConfirmacao.addEventListener('click', fecharConfirmacao);

        modalConfirmacaoOverlay.addEventListener('click', (e) => {
            if (e.target.id === 'modalConfirmacaoOverlay') fecharConfirmacao();
        });

        btnConfirmarConfirmacao.addEventListener('click', () => {
            if (typeof acaoConfirmada === 'function') acaoConfirmada();
            fecharConfirmacao();
        });

        // apagar conta
        if (botaoApagarConta) {
            botaoApagarConta.addEventListener('click', () => {
                abrirConfirmacao('Deseja mesmo apagar esta conta?', () => {
                    localStorage.removeItem('condy_foto_perfil');
                    localStorage.removeItem('condy_nome_perfil');
                    localStorage.removeItem('condy_banner_perfil');
                    localStorage.removeItem('condy_bio_perfil');
                    localStorage.removeItem('condy_config_email');
                    localStorage.removeItem('condy_config_perfil_publico');
                    localStorage.removeItem('condy_config_contadores');

                    window.location.href = 'index.html';
                });
            });
        }

        // alterar senha
        if (botaoAlterarSenha) {
            botaoAlterarSenha.addEventListener('click', () => {
                abrirConfirmacao('Enviaremos um link de alteração de senha para o seu e-mail. Deseja continuar?', () => {
                    // aqui entraria a chamada ao back-end de verdade
                    alert('Link de alteração enviado para o seu e-mail cadastrado.');
                });
            });
        }
    }

    // ---------- INTERRUPTORES (hoje bloqueados por "Em Manutenção") ----------

    [
        { id: 'switchEmail', chave: 'condy_config_email' },
        { id: 'switchPerfilPublico', chave: 'condy_config_perfil_publico' },
        { id: 'switchContadores', chave: 'condy_config_contadores' }
    ].forEach(({ id, chave }) => {
        const elemento = document.getElementById(id);
        if (!elemento) return;

        const salvo = localStorage.getItem(chave);
        if (salvo !== null) elemento.checked = salvo === 'true';

        elemento.addEventListener('change', () => {
            localStorage.setItem(chave, elemento.checked);
        });
    });

    // ---------- MODAL DE TERMOS ----------

    const modalTermosOverlay = pegar('modalTermosOverlay');
    const modalTermosFechar = pegar('modalTermosFechar');

    if (modalTermosOverlay && modalTermosFechar) {
        document.querySelectorAll('.abrir-termos').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                abrirOverlay(modalTermosOverlay);
            });
        });

        modalTermosFechar.addEventListener('click', () => fecharOverlay(modalTermosOverlay));

        modalTermosOverlay.addEventListener('click', (e) => {
            if (e.target.id === 'modalTermosOverlay') fecharOverlay(modalTermosOverlay);
        });
    }

    // ---------- VERIFICAÇÃO DE IDADE: ADICIONAR DOCUMENTOS ----------

    const TAMANHO_MAXIMO = 5 * 1024 * 1024; // 5 MB por arquivo
    const MAX_ARQUIVOS = 2;                  // frente e verso
    const EXTENSOES_PERMITIDAS = ['jpg', 'jpeg', 'png', 'pdf'];

    const docOverlay = pegar('modalDocumentoOverlay');
    const botaoAbrirDoc = pegar('botaoVerificarIdade');
    const botaoFecharDoc = pegar('modalDocumentoFechar');
    const botaoCancelarDoc = pegar('btnCancelarDocumento');
    const botaoEnviarDoc = pegar('btnEnviarDocumento');
    const botaoEntendiDoc = pegar('btnFecharDocumentoEnviado');
    const passoEnviar = pegar('passoEnviarDocumento');
    const passoEnviado = pegar('passoDocumentoEnviado');
    const selectTipo = pegar('tipoDocumento');
    const erroTipo = pegar('erroTipoDocumento');
    const areaUpload = pegar('areaUpload');
    const inputDocumento = pegar('inputDocumento');
    const erroArquivo = pegar('erroArquivoDocumento');
    const listaDocumentos = pegar('listaDocumentos');

    const documentoCompleto = docOverlay && botaoAbrirDoc && botaoFecharDoc && botaoCancelarDoc &&
        botaoEnviarDoc && botaoEntendiDoc && passoEnviar && passoEnviado && selectTipo &&
        erroTipo && areaUpload && inputDocumento && erroArquivo && listaDocumentos;

    if (documentoCompleto) {

        let arquivos = [];

        // ----- PONTO DE INTEGRAÇÃO COM O BACK-END -----
        // Aqui entra o envio de verdade. Exemplo:
        //
        //   const dados = new FormData();
        //   dados.append('tipo_documento', tipo);
        //   arquivosSelecionados.forEach(a => dados.append('documentos[]', a));
        //   const resposta = await fetch('./PHP/verificar_idade.php', { method: 'POST', body: dados });
        //
        // Por enquanto não envia nada: só confirma na tela.
        function aoEnviarDocumentos(tipo, arquivosSelecionados) {
            console.log('Documentos prontos para envio:', tipo, arquivosSelecionados);
        }

        function formatarTamanho(bytes) {
            if (bytes < 1024 * 1024) return Math.max(1, Math.round(bytes / 1024)) + ' KB';
            return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
        }

        function extensaoDe(nome) {
            const partes = nome.toLowerCase().split('.');
            return partes.length > 1 ? partes.pop() : '';
        }

        function mostrar(elemento, mensagem) {
            elemento.textContent = mensagem;
            elemento.classList.add('ativo');
        }

        function limpar(elemento) {
            elemento.textContent = '';
            elemento.classList.remove('ativo');
        }

        function limparErros() {
            limpar(erroTipo);
            limpar(erroArquivo);
            selectTipo.classList.remove('invalido');
            areaUpload.classList.remove('invalida');
        }

        function renderizarLista() {
            listaDocumentos.innerHTML = '';

            arquivos.forEach((arquivo, indice) => {
                const item = document.createElement('li');
                item.className = 'item-documento';
                item.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-file-earmark" viewBox="0 0 16 16">
                        <path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5z"/>
                    </svg>
                    <span class="nome-documento"></span>
                    <span class="tamanho-documento"></span>
                    <button type="button" class="remover-documento" title="Remover arquivo" data-indice="${indice}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
                            <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
                        </svg>
                    </button>
                `;

                // textContent: o nome do arquivo nunca vira HTML
                item.querySelector('.nome-documento').textContent = arquivo.name;
                item.querySelector('.tamanho-documento').textContent = formatarTamanho(arquivo.size);

                listaDocumentos.appendChild(item);
            });
        }

        function adicionarArquivos(listaDeArquivos) {
            const problemas = [];

            Array.from(listaDeArquivos).forEach(arquivo => {
                if (!EXTENSOES_PERMITIDAS.includes(extensaoDe(arquivo.name))) {
                    problemas.push(`"${arquivo.name}" não é JPG, PNG ou PDF.`);
                    return;
                }

                if (arquivo.size > TAMANHO_MAXIMO) {
                    problemas.push(`"${arquivo.name}" passa de 5 MB.`);
                    return;
                }

                const repetido = arquivos.some(a =>
                    a.name === arquivo.name && a.size === arquivo.size && a.lastModified === arquivo.lastModified
                );
                if (repetido) {
                    problemas.push(`"${arquivo.name}" já foi adicionado.`);
                    return;
                }

                if (arquivos.length >= MAX_ARQUIVOS) {
                    problemas.push(`Você pode adicionar no máximo ${MAX_ARQUIVOS} arquivos.`);
                    return;
                }

                arquivos.push(arquivo);
            });

            limpar(erroArquivo);
            areaUpload.classList.remove('invalida');

            if (problemas.length > 0) mostrar(erroArquivo, problemas[0]);

            renderizarLista();
        }

        function abrirModalDocumento() {
            abrirOverlay(docOverlay);
        }

        function fecharModalDocumento() {
            fecharOverlay(docOverlay, () => {
                // volta tudo ao estado inicial para a próxima abertura
                arquivos = [];
                inputDocumento.value = '';
                selectTipo.value = '';
                limparErros();
                renderizarLista();
                passoEnviar.style.display = 'block';
                passoEnviado.style.display = 'none';
            });
        }

        botaoAbrirDoc.addEventListener('click', abrirModalDocumento);
        botaoFecharDoc.addEventListener('click', fecharModalDocumento);
        botaoCancelarDoc.addEventListener('click', fecharModalDocumento);
        botaoEntendiDoc.addEventListener('click', fecharModalDocumento);

        // Clicar fora NÃO fecha: assim ninguém perde os arquivos escolhidos sem querer.

        areaUpload.addEventListener('click', () => inputDocumento.click());

        areaUpload.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                inputDocumento.click();
            }
        });

        inputDocumento.addEventListener('change', (e) => {
            adicionarArquivos(e.target.files);
            inputDocumento.value = ''; // permite escolher o mesmo arquivo de novo depois
        });

        ['dragenter', 'dragover'].forEach(evento => {
            areaUpload.addEventListener(evento, (e) => {
                e.preventDefault();
                areaUpload.classList.add('arrastando');
            });
        });

        ['dragleave', 'drop'].forEach(evento => {
            areaUpload.addEventListener(evento, (e) => {
                e.preventDefault();
                areaUpload.classList.remove('arrastando');
            });
        });

        areaUpload.addEventListener('drop', (e) => {
            adicionarArquivos(e.dataTransfer.files);
        });

        listaDocumentos.addEventListener('click', (e) => {
            const botaoRemover = e.target.closest('.remover-documento');
            if (!botaoRemover) return;

            arquivos.splice(Number(botaoRemover.dataset.indice), 1);
            limpar(erroArquivo);
            renderizarLista();
        });

        selectTipo.addEventListener('change', () => {
            limpar(erroTipo);
            selectTipo.classList.remove('invalido');
        });

        botaoEnviarDoc.addEventListener('click', () => {
            limparErros();

            let valido = true;

            if (!selectTipo.value) {
                mostrar(erroTipo, 'Selecione o tipo de documento.');
                selectTipo.classList.add('invalido');
                valido = false;
            }

            if (arquivos.length === 0) {
                mostrar(erroArquivo, 'Adicione pelo menos um arquivo do documento.');
                areaUpload.classList.add('invalida');
                valido = false;
            }

            if (!valido) return;

            aoEnviarDocumentos(selectTipo.value, arquivos);

            passoEnviar.style.display = 'none';
            passoEnviado.style.display = 'block';
        });
    }

    // ---------- AVISO: elementos que não existem no HTML ----------

    if (idsFaltando.length > 0) {
        alert(
            'Faltam estes elementos no configuracoes.html (o id precisa ser exatamente igual):\n\n' +
            idsFaltando.join('\n')
        );
    }

});