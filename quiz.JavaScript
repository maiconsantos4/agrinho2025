// quiz-script.js

// Array de objetos para armazenar as perguntas do quiz
// Cada objeto tem:
// - question: a string da pergunta
// - options: um array de strings com as opções de resposta
// - correct: o índice da opção correta (0 para a primeira, 1 para a segunda, etc.)
const quizQuestions = [
    {
        question: "Qual dos seguintes é um recurso renovável?",
        options: ["Petróleo", "Carvão", "Energia Solar", "Gás Natural"],
        correct: 2 // Energia Solar
    },
    {
        question: "Qual é o principal gás responsável pelo efeito estufa?",
        options: ["Oxigênio", "Nitrogênio", "Dióxido de Carbono", "Argônio"],
        correct: 2 // Dióxido de Carbono
    },
    {
        question: "O que significa '3 R's' na sustentabilidade?",
        options: ["Remover, Reutilizar, Reciclar", "Reduzir, Reutilizar, Reciclar", "Restaurar, Reavaliar, Reconstruir", "Repensar, Realizar, Reorganizar"],
        correct: 1 // Reduzir, Reutilizar, Reciclar
    },
    {
        question: "Qual bioma brasileiro é conhecido por sua rica biodiversidade e desmatamento preocupante?",
        options: ["Pampa", "Caatinga", "Cerrado", "Floresta Amazônica"],
        correct: 3 // Floresta Amazônica
    },
    {
        question: "O que é 'pegada de carbono'?",
        options: [
            "A marca que seu sapato deixa no chão",
            "O total de gases de efeito estufa emitidos direta ou indiretamente por uma pessoa, organização, evento ou produto",
            "A quantidade de carbono presente nas florestas",
            "A capacidade de um material de absorver carbono"
        ],
        correct: 1 // O total de gases de efeito estufa...
    }
];

// Variáveis para controlar o estado do quiz
let currentQuestionIndex = 0; // Índice da pergunta atual
let score = 0;              // Pontuação do usuário
let userAnswers = [];       // Array para armazenar as respostas do usuário [perguntaIndex, opcaoSelecionadaIndex]

// Referências aos elementos HTML
const quizArea = document.getElementById('quiz-area');
const resultsArea = document.getElementById('results-area');
const questionDisplay = document.getElementById('question-display');
const optionsContainer = document.getElementById('options-container');
const prevButton = document.getElementById('prev-button');
const nextButton = document.getElementById('next-button');
const scoreDisplay = document.getElementById('score-display');
const feedbackMessage = document.getElementById('feedback-message');
const restartButton = document.getElementById('restart-button');

// --- Funções do Quiz ---

/**
 * Exibe a pergunta atual e suas opções.
 */
function displayQuestion() {
    // Esconde a área de resultados, se estiver visível
    resultsArea.style.display = 'none';
    quizArea.style.display = 'flex'; // Garante que a área do quiz esteja visível

    const questionData = quizQuestions[currentQuestionIndex];
    questionDisplay.textContent = `Pergunta ${currentQuestionIndex + 1}/${quizQuestions.length}: ${questionData.question}`;
    optionsContainer.innerHTML = ''; // Limpa as opções anteriores

    questionData.options.forEach((option, index) => {
        const li = document.createElement('li');
        li.classList.add('option-item');

        const input = document.createElement('input');
        input.type = 'radio';
        input.name = 'quiz-option';
        input.id = `option-${index}`;
        input.value = index;

        const label = document.createElement('label');
        label.htmlFor = `option-${index}`;
        label.textContent = option;

        li.appendChild(input);
        li.appendChild(label);
        optionsContainer.appendChild(li);

        // Adiciona evento de clique para selecionar a opção
        li.addEventListener('click', () => {
            selectOption(input);
        });

        // Marca a opção se o usuário já a selecionou antes
        if (userAnswers[currentQuestionIndex] !== undefined && userAnswers[currentQuestionIndex] === index) {
            input.checked = true;
            li.classList.add('selected');
        }
    });

    // Atualiza o estado dos botões de navegação
    updateNavigationButtons();
}

/**
 * Seleciona uma opção e atualiza a resposta do usuário.
 * @param {HTMLInputElement} selectedInput - O radio button selecionado.
 */
function selectOption(selectedInput) {
    // Remove a classe 'selected' de todas as opções
    document.querySelectorAll('.option-item').forEach(item => {
        item.classList.remove('selected');
    });

    // Marca o radio button selecionado e adiciona a classe 'selected'
    selectedInput.checked = true;
    selectedInput.parentElement.classList.add('selected');

    // Salva a resposta do usuário
    userAnswers[currentQuestionIndex] = parseInt(selectedInput.value);
}

/**
 * Atualiza a visibilidade e o estado de 'disabled' dos botões de navegação.
 */
function updateNavigationButtons() {
    prevButton.disabled = currentQuestionIndex === 0;
    nextButton.disabled = false; // Sempre habilitado, a menos que seja a última pergunta para exibir resultados

    if (currentQuestionIndex === quizQuestions.length - 1) {
        nextButton.textContent = 'Finalizar Quiz';
    } else {
        nextButton.textContent = 'Próxima';
    }
}

/**
 * Navega para a próxima pergunta ou finaliza o quiz.
 */
function goToNextQuestion() {
    // Verifica se uma opção foi selecionada antes de avançar
    if (userAnswers[currentQuestionIndex] === undefined) {
        alert('Por favor, selecione uma opção antes de prosseguir!');
        return;
    }

    if (currentQuestionIndex < quizQuestions.length - 1) {
        currentQuestionIndex++;
        displayQuestion();
    } else {
        // Última pergunta, finalizar quiz
        calculateScore();
        showResults();
    }
}

/**
 * Navega para a pergunta anterior.
 */
function goToPrevQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayQuestion();
    }
}

/**
 * Calcula a pontuação final do usuário.
 */
function calculateScore() {
    score = 0;
    quizQuestions.forEach((question, index) => {
        if (userAnswers[index] !== undefined && userAnswers[index] === question.correct) {
            score++;
        }
    });
}

/**
 * Exibe os resultados do quiz e o feedback ao usuário.
 */
function showResults() {
    quizArea.style.display = 'none';
    resultsArea.style.display = 'block';

    scoreDisplay.textContent = `Você acertou ${score} de ${quizQuestions.length} perguntas!`;

    let message = '';
    if (score === quizQuestions.length) {
        message = 'Parabéns! Excelente conhecimento sobre sustentabilidade!';
    } else if (score >= quizQuestions.length / 2) {
        message = 'Muito bom! Continue aprendendo para um futuro mais verde!';
    } else {
        message = 'Continue estudando! Há muito para aprender sobre sustentabilidade.';
    }
    feedbackMessage.textContent = message;

    // Opcional: Mostrar quais perguntas foram corretas/incorretas (para um feedback mais detalhado)
    // Para isso, você precisaria de uma estrutura mais complexa para exibir os resultados ou revisar as perguntas.
}

/**
 * Reinicia o quiz para uma nova tentativa.
 */
function restartQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    userAnswers = [];
    displayQuestion();
}

// --- Event Listeners ---
prevButton.addEventListener('click', goToPrevQuestion);
nextButton.addEventListener('click', goToNextQuestion);
restartButton.addEventListener('click', restartQuiz);

// Inicializa o quiz ao carregar a página
document.addEventListener('DOMContentLoaded', displayQuestion);