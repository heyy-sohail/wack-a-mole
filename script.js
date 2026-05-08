
let score = 0;
let timeLeft = 30;
let isPlaying = false;
let gameTimer = null;
let moleTimer = null;
let highScore = localStorage.getItem('whackHighScore') || 0;

const scoreEl = document.getElementById('score');
const timeEl = document.getElementById('time');
const startBtn = document.getElementById('startBtn');
const gameOverScreen = document.getElementById('gameOver');
const finalScoreEl = document.getElementById('finalScore');
const highScoreDisplay = document.getElementById('highScoreDisplay');
const difficultySelect = document.getElementById('difficulty');

const settings = {
    easy:   { spawn: 950, hide: 1200 },
    medium: { spawn: 720, hide: 850 },
    hard:   { spawn: 480, hide: 600 }
};

function createHoles() {
    const grid = document.getElementById('grid');
    grid.innerHTML = '';

    for (let i = 0; i < 9; i++) {
        const hole = document.createElement('div');
        hole.className = 'hole';

        const mole = document.createElement('div');
        mole.className = 'mole';
        mole.textContent = '🐹';

        hole.appendChild(mole);
        grid.appendChild(hole);

        hole.addEventListener('click', () => {
            if (isPlaying && mole.classList.contains('active')) {
                whack(mole);
            }
        });
    }
}

function whack(mole) {
    score += 10;
    scoreEl.textContent = score;

    mole.style.transform = 'translateX(-50%) scale(0.6)';
    mole.style.transition = '0.1s';

    setTimeout(() => {
        mole.classList.remove('active');
        mole.style.transform = 'translateX(-50%) scale(1)';
        mole.style.transition = '0.25s';
    }, 80);
}

function popRandomMole() {
    if (!isPlaying) return;

    const moles = document.querySelectorAll('.mole');
    const randomMole = moles[Math.floor(Math.random() * moles.length)];

    if (randomMole.classList.contains('active')) return;

    randomMole.classList.add('active');

    const hideTime = settings[difficultySelect.value].hide;
    setTimeout(() => {
        if (randomMole.classList.contains('active')) {
            randomMole.classList.remove('active');
        }
    }, hideTime);
}

function startGame() {
    if (isPlaying) return;

    isPlaying = true;
    score = 0;
    timeLeft = 30;

    scoreEl.textContent = score;
    timeEl.textContent = timeLeft;
    gameOverScreen.style.display = 'none';

    createHoles();

    // Game timer
    gameTimer = setInterval(() => {
        timeLeft--;
        timeEl.textContent = timeLeft;
        if (timeLeft <= 0) endGame();
    }, 1000);

    // Mole spawning
    const spawnRate = settings[difficultySelect.value].spawn;
    moleTimer = setInterval(popRandomMole, spawnRate);

    // Start with a few moles
    setTimeout(popRandomMole, 300);
    setTimeout(popRandomMole, 600);
}

function endGame() {
    isPlaying = false;
    clearInterval(gameTimer);
    clearInterval(moleTimer);

    document.querySelectorAll('.mole').forEach(m => m.classList.remove('active'));

    finalScoreEl.textContent = score;

    if (score > highScore) {
        highScore = score;
        localStorage.setItem('whackHighScore', highScore);
    }

    highScoreDisplay.textContent = highScore;
    gameOverScreen.style.display = 'flex';
}

// Event Listeners
startBtn.addEventListener('click', startGame);
document.getElementById('restartBtn').addEventListener('click', startGame);

// Initialize
createHoles();
highScoreDisplay.textContent = highScore;

console.log('%cWhack-a-Mole game loaded!', 'color: #ffeb3b; font-size: 14px;');