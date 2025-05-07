// Game variables
const blockSize = 20;
const rows = 20;
const cols = 20;
let board;
let context;

// Snake
let snakeX = blockSize * 5;
let snakeY = blockSize * 5;
let velocityX = 1;
let velocityY = 0;
let snakeBody = [];

// Food
let foodX;
let foodY;

// Game state
let gameOver = false;
let score = 0;
let highScore = 0;
let gameInterval;
let gameSpeed;

// Initialize game
window.onload = function() {
    board = document.getElementById("board");
    board.height = rows * blockSize;
    board.width = cols * blockSize;
    context = board.getContext("2d");

    // Load high score and difficulty
    highScore = parseInt(getCookie("snakeHighScore")) || 0;
    document.getElementById("highscore").textContent = highScore;
    
    // Get and apply difficulty
    const difficulty = getCookie("gameMode") || "medium";
    applyDifficulty(difficulty);

    // Set up controls
    document.addEventListener("keyup", changeDirection);
    document.getElementById("restart-btn").addEventListener("click", resetGame);

    applyDifficulty();
    placeFood();
    startGame();
    
}


function applyDifficulty(gameMode) {

    switch(gameMode) {
        case 'easy':
            gameSpeed = 300; // Slow
            break;
        case 'hard':
            gameSpeed = 50;  // Fast
            break;
        case 'medium': // medium
            gameSpeed = 100; // Normal
    }
    console.log(`Difficulty: ${difficulty}`, {gameSpeed}) // Debug
}

function startGame() {
    // Clear any existing game loop
    if (gameInterval) { 
        clearInterval(gameInterval);
    }
    
    // Start new game loop with current speed
    gameInterval = setInterval(update, gameSpeed);
}

function update() {
    if (gameOver) {
        clearInterval(gameInterval);
        return;
    }

    function resetGame() {
        // Clear existing game loop
        clearInterval(gameInterval);
        
        // Reset game state
        snakeX = blockSize * 5;
        snakeY = blockSize * 5;
        velocityX = 1;
        velocityY = 0;
        snakeBody = [];
        score = 0;
        gameOver = false;
        
        // Update display
        document.getElementById("score").textContent = score;
        
        // Get current difficulty and reapply
        const difficulty = getCookie("gameMode") || "medium";
        applyDifficulty(difficulty);
        
        placeFood();
        startGame();
    }

    // Clear boardq
    context.fillStyle = "black";
    context.fillRect(0, 0, board.width, board.height);

    // Draw food
    context.fillStyle = "red";
    context.fillRect(foodX, foodY, blockSize, blockSize);

    // Check if snake ate food
    if (snakeX === foodX && snakeY === foodY) {
        snakeBody.push([foodX, foodY]);
        placeFood();
        score++;
        updateScore();
    }

    // Move snake body
    for (let i = snakeBody.length-1; i > 0; i--) {
        snakeBody[i] = snakeBody[i-1];
    }
    if (snakeBody.length) {
        snakeBody[0] = [snakeX, snakeY];
    }

    // Draw snake
    context.fillStyle = "lime";
    snakeX += velocityX * blockSize;
    snakeY += velocityY * blockSize;
    context.fillRect(snakeX, snakeY, blockSize, blockSize);
    
    for (let i = 0; i < snakeBody.length; i++) {
        context.fillRect(snakeBody[i][0], snakeBody[i][1], blockSize, blockSize);
    }

    // Game over conditions
    if (snakeX <= 0 || snakeX >= cols*blockSize || snakeY <= 0 || snakeY >= rows*blockSize) {
        gameOver = true;
        endGame();
    }

    for (let i = 0; i < snakeBody.length; i++) {
        if (snakeX === snakeBody[i][0] && snakeY === snakeBody[i][1]) {
            gameOver = true;
            endGame();
        }
    }
}

    // Continue game loop
    const difficulty = getCookie("gameMode");
    let speed;
    switch(difficulty) {
        case "easy": speed = 100; break;
        case "hard": speed = 300; break;
        case "medium": speed = 200; // medium
    }
    setTimeout(update, speed);


function changeDirection(e) {
    // Support both WASD and Arrow keys
    const key = e.code;
    
    // Up/W
    if ((key === "ArrowUp" || key === "KeyW") && velocityY !== 1) {
        velocityX = 0;
        velocityY = -1;
    }
    // Down/S
    else if ((key === "ArrowDown" || key === "KeyS") && velocityY !== -1) {
        velocityX = 0;
        velocityY = 1;
    }
    // Left/A
    else if ((key === "ArrowLeft" || key === "KeyA") && velocityX !== 1) {
        velocityX = -1;
        velocityY = 0;
    }
    // Right/D
    else if ((key === "ArrowRight" || key === "KeyD") && velocityX !== -1) {
        velocityX = 1;
        velocityY = 0;
    }
}


function placeFood() {
    foodX = Math.floor(Math.random() * cols) * blockSize;
    foodY = Math.floor(Math.random() * rows) * blockSize;
}

function updateScore() {
    document.getElementById("score").textContent = score;
    if (score > highScore) {
        highScore = score;
        document.getElementById("highscore").textContent = highScore;
        setCookie("snakeHighScore", highScore);
    }
}

function endGame() {
    context.fillStyle = "white";
    context.font = "30px Courier New";
    context.fillText("GAME OVER", board.width/2 - 100, board.height/2);
}

function resetGame() {
    snakeX = blockSize * 5;
    snakeY = blockSize * 5;
    velocityX = 1;
    velocityY = 0;
    snakeBody = [];
    score = 0;
    gameOver = false;
    document.getElementById("score").textContent = score;
    placeFood();
    update();
}

// Cookie functions
function setCookie(name, value, days = 30) {
    const d = new Date();
    d.setTime(d.getTime() + (days * 86400000));
    document.cookie = `${name}=${value}; expires=${d.toUTCString()}; path=/`;
}

function getCookie(name) {
    const cookies = document.cookie.split(';');
    for (let c of cookies) {
        const [key, val] = c.trim().split('=');
        if (key === name) return val;
    }
    return null;
}