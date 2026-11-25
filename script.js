
"use strict";

const profissoes = [
    { nome: "Médico", emoji: "🩺" },
    { nome: "Professor", emoji: "📚" },
    { nome: "Bombeiro", emoji: "🚒" },
    { nome: "Advogado", emoji: "⚖️" },
    { nome: "Cozinheiro", emoji: "👨‍🍳" },
    { nome: "Engenheiro", emoji: "🏗️" },
    { nome: "Dentista", emoji: "🦷" },
    { nome: "Policial", emoji: "👮" },
    { nome: "Astronauta", emoji: "🚀" },
    { nome: "Veterinário", emoji: "🐾" }
];

const TOTAL_PARTIDAS = 5;
const TOTAL_PARES = profissoes.length;

const tabuleiro = document.getElementById("tabuleiro");
const mensagem = document.getElementById("mensagem");
const resultado = document.getElementById("resultado");

const tituloResultado = document.getElementById("tituloResultado");
const textoResultado = document.getElementById("textoResultado");

const botaoProxima = document.getElementById("proximaRodada");
const botaoReiniciar = document.getElementById("reiniciar");
const botaoNovo = document.getElementById("jogarNovamente");

let jogadorAtual = 1;

let pontuacao = [0, 0];
let pontosCampeonato = [0, 0];

let paresEncontrados = 0;
let tentativas = 0;
let partidaAtual = 1;

let primeiraCarta = null;
let segundaCarta = null;

let bloqueado = false;
let partidaFinalizada = false;

// EMBARALHAR

function embaralhar(lista) {
    const novaLista = [...lista];

    for (let i = novaLista.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [novaLista[i], novaLista[j]] =
            [novaLista[j], novaLista[i]];
    }

    return novaLista;
}

// INICIAR PARTIDA

function iniciarPartida() {

    tabuleiro.innerHTML = "";

    jogadorAtual = 1;
    pontuacao = [0, 0];

    paresEncontrados = 0;
    tentativas = 0;

    primeiraCarta = null;
    segundaCarta = null;

    bloqueado = false;
    partidaFinalizada = false;

    resultado.classList.add("escondido");

    const baralho = embaralhar([
        ...profissoes,
        ...profissoes
    ]);

    baralho.forEach((profissao, indice) => {

        const carta = document.createElement("div");

        carta.className = "carta";

        carta.innerHTML = `
            <div class="carta-inner">
                <div class="frente">?</div>

                <div class="verso">
                    <span class="emoji">${profissao.emoji}</span>
                    <span class="nome">${profissao.nome}</span>
                </div>
            </div>
        `;

        carta.dataset.nome = profissao.nome;
        carta.dataset.id = indice;

        carta.addEventListener("click", () => {
            virarCarta(carta);
        });

        tabuleiro.appendChild(carta);
    });

    mensagem.textContent =
        "🎮 Vez do Jogador 1! Escolha duas cartas.";

    atualizarTela();
}

// VIRAR CARTA

function virarCarta(carta) {

    if (
        bloqueado ||
        partidaFinalizada ||
        carta.classList.contains("virada") ||
        carta.classList.contains("acertada")
    ) {
        return;
    }

    carta.classList.add("virada");

    if (primeiraCarta === null) {

        primeiraCarta = carta;

        mensagem.textContent =
            `Jogador ${jogadorAtual}: escolha mais uma carta!`;

        return;
    }

    segundaCarta = carta;

    tentativas++;

    atualizarTela();

    compararCartas();
}

// COMPARAR CARTAS

function compararCartas() {

    bloqueado = true;

    const acertou =
        primeiraCarta.dataset.nome === segundaCarta.dataset.nome;

    if (acertou) {

        primeiraCarta.classList.add("acertada", "bloqueada");
        segundaCarta.classList.add("acertada", "bloqueada");

        pontuacao[jogadorAtual - 1]++;

        paresEncontrados++;

        mensagem.textContent =
            `🎉 Jogador ${jogadorAtual} acertou! Você continua jogando!`;

        limparSelecao();

        atualizarTela();

        if (paresEncontrados === TOTAL_PARES) {

            finalizarPartida();

        } else {

            // QUEM ACERTA CONTINUA JOGANDO
            bloqueado = false;

        }

    } else {

        mensagem.textContent =
            `❌ Não foi dessa vez, Jogador ${jogadorAtual}!`;

        setTimeout(() => {

            primeiraCarta.classList.remove("virada");
            segundaCarta.classList.remove("virada");

            limparSelecao();

            // TROCA AUTOMÁTICA DE JOGADOR
            trocarJogador();

            atualizarTela();

            mensagem.textContent =
                `🎮 Agora é a vez do Jogador ${jogadorAtual}! Escolha duas cartas.`;

            bloqueado = false;

        }, 1200);
    }
}

// LIMPAR SELEÇÃO

function limparSelecao() {
    primeiraCarta = null;
    segundaCarta = null;
}

// TROCAR JOGADOR AUTOMATICAMENTE

function trocarJogador() {

    if (jogadorAtual === 1) {
        jogadorAtual = 2;
    } else {
        jogadorAtual = 1;
    }
}

// ATUALIZAR PLACAR

function atualizarTela() {

    document.getElementById("pontos1").textContent =
        pontuacao[0];

    document.getElementById("pontos2").textContent =
        pontuacao[1];

    document.getElementById("total1").textContent =
        pontosCampeonato[0];

    document.getElementById("total2").textContent =
        pontosCampeonato[1];

    document.getElementById("pares").textContent =
        `${paresEncontrados}/${TOTAL_PARES}`;

    document.getElementById("tentativas").textContent =
        tentativas;

    document.getElementById("rodada").textContent =
        `${String(partidaAtual).padStart(2, "0")}/${TOTAL_PARTIDAS}`;

    document.getElementById("vez").textContent =
        `Jogador ${jogadorAtual}`;

    document.getElementById("jogador1").classList.toggle(
        "selecionado",
        jogadorAtual === 1
    );

    document.getElementById("jogador2").classList.toggle(
        "selecionado",
        jogadorAtual === 2
    );
}

// FINALIZAR PARTIDA

function finalizarPartida() {

    partidaFinalizada = true;

    pontosCampeonato[0] += pontuacao[0];
    pontosCampeonato[1] += pontuacao[1];

    atualizarTela();

    resultado.classList.remove("escondido");

    botaoNovo.classList.remove("escondido");

    if (partidaAtual < TOTAL_PARTIDAS) {

        tituloResultado.textContent =
            `🏆 Partida ${partidaAtual} concluída!`;

        textoResultado.innerHTML = `
            Jogador 1: ${pontuacao[0]} pares<br>
            Jogador 2: ${pontuacao[1]} pares<br><br>

            <strong>PLACAR DO CAMPEONATO</strong><br>
            Jogador 1: ${pontosCampeonato[0]} pontos<br>
            Jogador 2: ${pontosCampeonato[1]} pontos
        `;

        botaoProxima.classList.remove("escondido");

    } else {

        finalizarCampeonato();
    }
}

// PRÓXIMA PARTIDA

function proximaPartida() {

    if (!partidaFinalizada || partidaAtual >= TOTAL_PARTIDAS) {
        return;
    }

    partidaAtual++;

    iniciarPartida();
}

// FINALIZAR CAMPEONATO

function finalizarCampeonato() {

    tituloResultado.textContent =
        "👑 CAMPEONATO FINALIZADO!";

    botaoProxima.classList.add("escondido");

    if (pontosCampeonato[0] > pontosCampeonato[1]) {

        textoResultado.innerHTML = `
            🥇 GRANDE CAMPEÃO: JOGADOR 1!<br><br>
            Jogador 1: ${pontosCampeonato[0]} pontos<br>
            Jogador 2: ${pontosCampeonato[1]} pontos<br><br>
            Parabéns pela vitória! 🎉
        `;

    } else if (pontosCampeonato[1] > pontosCampeonato[0]) {

        textoResultado.innerHTML = `
            🥇 GRANDE CAMPEÃO: JOGADOR 2!<br><br>
            Jogador 1: ${pontosCampeonato[0]} pontos<br>
            Jogador 2: ${pontosCampeonato[1]} pontos<br><br>
            Parabéns pela vitória! 🎉
        `;

    } else {

        textoResultado.innerHTML = `
            🤝 CAMPEONATO EMPATADO!<br><br>
            Jogador 1: ${pontosCampeonato[0]} pontos<br>
            Jogador 2: ${pontosCampeonato[1]} pontos
        `;
    }

    mensagem.textContent =
        "🏁 Campeonato encerrado!";
}

// REINICIAR CAMPEONATO

function reiniciarCampeonato() {

    partidaAtual = 1;

    pontosCampeonato = [0, 0];

    iniciarPartida();
}

// BOTÕES

botaoProxima.addEventListener("click", proximaPartida);

botaoReiniciar.addEventListener("click", reiniciarCampeonato);

botaoNovo.addEventListener("click", reiniciarCampeonato);

// COMEÇAR JOGO

iniciarPartida();
