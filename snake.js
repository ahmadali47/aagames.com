const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const box = 7;
let snake = [{ x: canvas.height/2, y: canvas.width/2 }];
let food = { x: Math.floor(Math.random() * (canvas.width / box)) * box, y: Math.floor(Math.random() * (canvas.height / box)) * box };
let score = 0;
let speed = NaN;
let direction = '';
let game;
let paused = false;
let gameStarted = false;

const scoreDisplay = document.getElementById('scoreDisplay');
const pauseDisplay = document.getElementById('pauseDisplay');

const easySpeed = 100;
const mediumSpeed = 80;
const hardSpeed = 60;

const buttonWidth = 70;
const buttonHeight = 21;
const buttons = [
    { text: 'Easy', x: canvas.width / 2 - 105, y: canvas.height / 2, speed: easySpeed },
    { text: 'Medium', x: canvas.width / 2 - 35, y: canvas.height / 2, speed: mediumSpeed },
    { text: 'Hard', x: canvas.width / 2 + 35, y: canvas.height / 2, speed: hardSpeed }
];

let hoveredButton = null;

// function drawInitialMessage() {
//     ctx.fillStyle = '#50A6D5';
//     ctx.fillRect(0, 0, canvas.width, canvas.height);
//     ctx.fillStyle = 'black';
//     ctx.font = '30px Arial';
//     ctx.textAlign = 'center';
//     ctx.fillText('Welcome to Snake Game!', canvas.width / 2, canvas.height / 2 - 60);
// }

document.addEventListener("keydown", function (e) {
    if([37,38,39,40].indexOf(e.keyCode) > -1){
      e.preventDefault();
      // Do whatever else you want with the keydown event (i.e. your navigation).
    }
  }, false);

function drawButtons() {
    ctx.fillStyle = '#50A6D5';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    ctx.font = '14px Arial';
    ctx.fillText('Select Difficulty', canvas.width / 2 - 49, canvas.height / 2 - 28);

    buttons.forEach(button => {
        if (button === hoveredButton) {
            ctx.fillStyle = 'lightgray';
        } else {
            ctx.fillStyle = 'gray';
        }
        ctx.fillRect(button.x, button.y, buttonWidth, buttonHeight);
        ctx.fillStyle = 'black';
        ctx.fillText(button.text, button.x + 14, button.y + 15);
    });
}

function handleMouseMove(event) {
    if (gameStarted) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    hoveredButton = null;
    buttons.forEach(button => {
        if (x >= button.x && x <= button.x + buttonWidth && y >= button.y && y <= button.y + buttonHeight) {
            hoveredButton = button;
        }
    });
    drawButtons();
}

function handleButtonClick(event) {
    if (gameStarted) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    buttons.forEach(button => {
        if (x >= button.x && x <= button.x + buttonWidth && y >= button.y && y <= button.y + buttonHeight) {
            startGame(button.speed);
        }
    });
}

function handleControlButtonClick(event) {
    const buttonId = event.target.id;

    switch (buttonId) {
        case 'upButton':
            if (direction !== 'DOWN') direction = 'UP';
            break;
        case 'downButton':
            if (direction !== 'UP') direction = 'DOWN';
            break;
        case 'leftButton':
            if (direction !== 'RIGHT') direction = 'LEFT';
            break;
        case 'rightButton':
            if (direction !== 'LEFT') direction = 'RIGHT';
            break;
        case 'pauseButton':
            paused = !paused;
            break;
    }
}

function startGame(selectedSpeed) {
    speed = selectedSpeed;
    if (game) {
        clearInterval(game);
    }
    game = setInterval(draw, speed);
    gameStarted = true;
    canvas.removeEventListener('click', handleButtonClick);
    canvas.removeEventListener('mousemove', handleMouseMove);
}

document.addEventListener('keydown', changeDirection);

function changeDirection(event) {
    if (event.keyCode == 37 && direction != 'RIGHT') {
        direction = 'LEFT';
    } else if (event.keyCode == 38 && direction != 'DOWN') {
        direction = 'UP';
    } else if (event.keyCode == 39 && direction != 'LEFT') {
        direction = 'RIGHT';
    } else if (event.keyCode == 40 && direction != 'UP') {
        direction = 'DOWN';
    } else if (event.keyCode === 80) {
        paused = !paused;
    }
}

function draw() {
    if (!gameStarted) {
        // drawInitialMessage();
        drawButtons();
        return;
    }

    if (paused) {
        pauseDisplay.textContent = 'Paused';
        return;
    } else {
        pauseDisplay.textContent = "Press 'P' to Pause :";
    }

    ctx.fillStyle = '#50A6D5';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i % 3 === 0) ? 'orange' : 'yellow';
        ctx.fillRect(snake[i].x, snake[i].y, box, box);

        ctx.fillStyle = (i === 0) ? 'black' : '';
        ctx.fillRect(snake[i].x, snake[i].y, box, box);

        ctx.fillStyle = 'pink';
        ctx.fillRect(snake[i].x + 4.9, snake[i].y + 2.1, 1.4, 1.4);
    }

    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, box, box);
    ctx.fillStyle = 'pink';
    ctx.fillRect(food.x + 3.5, food.y + 2.1, 1.4, 1.4);

    const head = { x: snake[0].x, y: snake[0].y };

    if (direction === 'LEFT') head.x -= box;
    if (direction === 'UP') head.y -= box;
    if (direction === 'RIGHT') head.x += box;
    if (direction === 'DOWN') head.y += box;

    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height || collision(head, snake)) {
        clearInterval(game);
        alert('Game Over! Your score: ' + score);
        return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreDisplay.textContent = 'Score: ' + score;
        food = { x: Math.floor(Math.random() * (canvas.width / box)) * box, y: Math.floor(Math.random() * (canvas.height / box)) * box };
    } else {
        snake.pop();
    }
}

function collision(head, array) {
    for (let i = 1; i < array.length; i++) {
        if (head.x === array[i].x && head.y === array[i].y) {
            return true;
        }
    }
    return false;
}

drawButtons();
canvas.addEventListener('mousemove', handleMouseMove);
canvas.addEventListener('click', handleButtonClick);

document.getElementById('upButton').addEventListener('click', handleControlButtonClick);
document.getElementById('downButton').addEventListener('click', handleControlButtonClick);
document.getElementById('leftButton').addEventListener('click', handleControlButtonClick);
document.getElementById('rightButton').addEventListener('click', handleControlButtonClick);
document.getElementById('pauseButton').addEventListener('click', handleControlButtonClick);
