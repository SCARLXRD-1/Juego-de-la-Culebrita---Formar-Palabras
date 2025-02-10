const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Definición del tamaño de la cuadrícula, influye en la granularidad de las actividades
const gridSize = 20;

// Representación de la serpiente como una serie de actividades (segmentos) en la red del proyecto
let snake = [{ x: 100, y: 100 }];

// Dirección inicial, define la precedencia de las actividades (cada movimiento depende del anterior)
let direction = "RIGHT";

// La comida representa un recurso que debemos adquirir para completar una actividad (formar la palabra)
let food = getRandomPosition();

// Palabra actual, representa el progreso en la codificación de una tarea específica
let currentWord = "";

// Palabra objetivo, representa el objetivo final de nuestro proyecto (la tarea a completar)
const palabras = ["PROYECTO", "RECURSO", "TIEMPO", "RIESGO", "ENTREGA"];
let targetWord = palabras[Math.floor(Math.random() * palabras.length)];

// Contador de tiempo, utilizado para la estimación de la duración de las actividades y el proyecto en total
let timer = 0;
let interval;
let gameRunning = false;
let moveNext = false;
let gameWon = false;

// Nueva variable para el nombre de usuario
let username = "";

// Arreglo para almacenar la tabla de clasificación
let leaderboard = [];

// Función para obtener una posición aleatoria para la comida (recurso)
function getRandomPosition() {
    return {
        x: Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize,
        y: Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize
    };
}

// Función principal de actualización del juego
function updateGame() {
    if (!gameRunning) return;

    if (moveNext) {
        let head = { ...snake[0] };

        if (direction === "RIGHT") head.x += gridSize;
        if (direction === "LEFT") head.x -= gridSize;
        if (direction === "UP") head.y -= gridSize;
        if (direction === "DOWN") head.y += gridSize;

        snake.unshift(head);

        if (head.x === food.x && head.y === food.y) {
            currentWord += targetWord[currentWord.length];
            food = getRandomPosition();

            if (currentWord === targetWord) {
                gameWon = true;
            }
        } else {
            snake.pop();
        }

        moveNext = false;
    }

    drawGame();
}

// Función para dibujar el juego en el canvas
function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "lime";
    snake.forEach(part => ctx.fillRect(part.x, part.y, gridSize, gridSize));
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, gridSize, gridSize);
    document.getElementById("currentWord").innerText = currentWord;
    document.getElementById("targetWord").innerText = targetWord;
    document.getElementById("timer").innerText = timer;
}

// Evento para detectar las teclas de dirección
document.addEventListener("keydown", event => {
    if (event.key === "ArrowRight") {
        direction = "RIGHT";
        moveNext = true;
    }
    if (event.key === "ArrowLeft") {
        direction = "LEFT";
        moveNext = true;
    }
    if (event.key === "ArrowUp") {
        direction = "UP";
        moveNext = true;
    }
    if (event.key === "ArrowDown") {
        direction = "DOWN";
        moveNext = true;
    }
});

// Función para iniciar el temporizador
function startTimer() {
    interval = setInterval(() => {
        timer++;
        document.getElementById("timer").innerText = timer;
    }, 1000);
}

// Función para iniciar el juego
function startGame() {
    gameRunning = true;
    document.getElementById("startButton").disabled = true;
    document.getElementById("restartButton").disabled = false;
    startTimer();
}

// Función para reiniciar el juego
function restartGame() {
    clearInterval(interval);
    timer = 0;
    snake = [{ x: 100, y: 100 }];
    direction = "RIGHT";
    currentWord = "";
    targetWord = palabras[Math.floor(Math.random() * palabras.length)];
    food = getRandomPosition();
    gameRunning = false;
    document.getElementById("startButton").disabled = true;
    document.getElementById("restartButton").disabled = true;
    drawGame();

    // Habilitar el campo de nombre de usuario y limpiar el valor
    const usernameInput = document.getElementById("username");
    usernameInput.disabled = false;
    usernameInput.value = "";
    username = ""; // Limpiar el nombre de usuario
    document.getElementById("startButton").disabled = true;

    updateLeaderboard();
}

// Función para establecer el nombre de usuario
function setUsername() {
    const input = document.getElementById("username");
    username = input.value.trim(); // Elimina espacios en blanco al principio y al final
    if (username === "") {
        alert("Por favor, ingresa un nombre de usuario válido.");
        return;
    }
    alert("Nombre de usuario guardado: " + username);
    input.disabled = true; // Desactiva el campo después de guardar

    // Habilitar el botón "Iniciar Juego"
    document.getElementById("startButton").disabled = false;
}

// Función para guardar el puntaje en la tabla de clasificación
function saveScore(user, score) {
    leaderboard.push({ user: user, score: score });
    // Ordena la tabla de clasificación por tiempo (de menor a mayor)
    leaderboard.sort((a, b) => a.score - b.score);
}

// Función para actualizar la tabla de clasificación en el HTML
function updateLeaderboard() {
    const tableBody = document.querySelector("#leaderboard tbody");
    tableBody.innerHTML = ""; // Limpia la tabla
    for (let i = 0; i < leaderboard.length; i++) {
        const entry = leaderboard[i];
        const row = document.createElement("tr");
        const userCell = document.createElement("td");
        const scoreCell = document.createElement("td");
        userCell.textContent = entry.user;
        scoreCell.textContent = entry.score;
        row.appendChild(userCell);
        row.appendChild(scoreCell);
        tableBody.appendChild(row);
    }
}

// Intervalo principal del juego
setInterval(() => {
    updateGame();

    if (gameWon) {
        gameWon = false;
        alert("Palabra completa: " + targetWord + " en " + timer + " segundos!");

        // Guarda el puntaje y actualiza la tabla SOLO si el nombre de usuario se ha establecido
        if (username && timer > 0) {
            saveScore(username, timer);
        }

        restartGame();
    }
}, 150);
