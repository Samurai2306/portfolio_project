// ==================== SHARED UTILITIES ====================
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let focusedGame = 'snake';

function loadBest(key) {
    const v = localStorage.getItem(key);
    return v ? parseInt(v, 10) || 0 : 0;
}

function saveBest(key, value) {
    localStorage.setItem(key, String(value));
}

function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
}

function updateFocusedGame() {
    const cards = document.querySelectorAll('[data-game]');
    let best = null;
    let bestDist = Infinity;
    const center = window.innerHeight / 2;

    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        if (rect.top >= window.innerHeight || rect.bottom <= 0) return;
        const cardCenter = rect.top + rect.height / 2;
        const dist = Math.abs(cardCenter - center);
        if (dist < bestDist) {
            bestDist = dist;
            best = card.dataset.game;
        }
    });

    if (best) focusedGame = best;
}

function isFocused(id) {
    return focusedGame === id;
}

// ==================== SNAKE GAME ====================
let snakeCanvas = null;
let snakeCtx = null;

let snake = {
    segments: [{ x: 10, y: 10 }],
    direction: { x: 0, y: 0 },
    nextDirection: { x: 0, y: 0 },
    score: 0,
    best: loadBest('snakeBest'),
    gameRunning: false,
    gamePaused: false,
    food: { x: 15, y: 15 },
    gridSize: 20,
    tileSize: 20,
    foodParticles: [],
    waitingToStart: true
};

function getSnakeSpeed() {
    const base = 120;
    const bonus = Math.min(Math.floor(snake.score / 50) * 8, 40);
    return base - bonus;
}

function createFoodParticles(x, y) {
    if (prefersReducedMotion) return;
    for (let i = 0; i < 10; i++) {
        snake.foodParticles.push({
            x: x * snake.tileSize + snake.tileSize / 2,
            y: y * snake.tileSize + snake.tileSize / 2,
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 0.5) * 4,
            life: 1,
            size: Math.random() * 3 + 2
        });
    }
}

function updateFoodParticles() {
    if (!snakeCtx || prefersReducedMotion) return;

    for (let i = snake.foodParticles.length - 1; i >= 0; i--) {
        const p = snake.foodParticles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.03;

        snakeCtx.globalAlpha = p.life;
        snakeCtx.fillStyle = '#ff6b6b';
        snakeCtx.beginPath();
        snakeCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        snakeCtx.fill();

        if (p.life <= 0) snake.foodParticles.splice(i, 1);
    }
    snakeCtx.globalAlpha = 1;
}

function drawSnake() {
    if (!snakeCtx) return;

    snakeCtx.imageSmoothingEnabled = true;
    snakeCtx.imageSmoothingQuality = 'high';

    snakeCtx.fillStyle = prefersReducedMotion ? 'rgba(10, 10, 15, 1)' : 'rgba(10, 10, 15, 0.25)';
    snakeCtx.fillRect(0, 0, snakeCanvas.width, snakeCanvas.height);

    updateFoodParticles();

    snakeCtx.strokeStyle = 'rgba(139, 95, 191, 0.1)';
    snakeCtx.lineWidth = 1;
    for (let i = 0; i <= snake.gridSize; i++) {
        snakeCtx.beginPath();
        snakeCtx.moveTo(i * snake.tileSize, 0);
        snakeCtx.lineTo(i * snake.tileSize, snakeCanvas.height);
        snakeCtx.stroke();
        snakeCtx.beginPath();
        snakeCtx.moveTo(0, i * snake.tileSize);
        snakeCtx.lineTo(snakeCanvas.width, i * snake.tileSize);
        snakeCtx.stroke();
    }

    if (snake.waitingToStart && !snake.gameRunning) {
        snakeCtx.fillStyle = 'rgba(255,255,255,0.7)';
        snakeCtx.font = `${Math.max(12, snake.tileSize * 0.6)}px JetBrains Mono, monospace`;
        snakeCtx.textAlign = 'center';
        snakeCtx.fillText('Старт или ←↑→↓', snakeCanvas.width / 2, snakeCanvas.height / 2);
        snakeCtx.textAlign = 'left';
    }

    const time = Date.now() * 0.003;
    const pulse = prefersReducedMotion ? 1 : Math.sin(time) * 0.2 + 1;
    const foodSize = (snake.tileSize - 6) * pulse;
    const foodOffset = (snake.tileSize - foodSize) / 2;

    snakeCtx.shadowColor = '#ff6b6b';
    snakeCtx.shadowBlur = prefersReducedMotion ? 0 : 15 * pulse;

    const foodGradient = snakeCtx.createRadialGradient(
        snake.food.x * snake.tileSize + snake.tileSize / 2,
        snake.food.y * snake.tileSize + snake.tileSize / 2,
        0,
        snake.food.x * snake.tileSize + snake.tileSize / 2,
        snake.food.y * snake.tileSize + snake.tileSize / 2,
        foodSize / 2
    );
    foodGradient.addColorStop(0, '#ffeb3b');
    foodGradient.addColorStop(0.4, '#ff6b6b');
    foodGradient.addColorStop(1, '#c62828');

    snakeCtx.fillStyle = foodGradient;
    snakeCtx.beginPath();
    snakeCtx.arc(
        snake.food.x * snake.tileSize + snake.tileSize / 2,
        snake.food.y * snake.tileSize + snake.tileSize / 2,
        foodSize / 2,
        0,
        Math.PI * 2
    );
    snakeCtx.fill();
    snakeCtx.shadowBlur = 0;

    snake.segments.forEach((segment, index) => {
        const x = segment.x * snake.tileSize;
        const y = segment.y * snake.tileSize;
        const size = snake.tileSize - 2;

        if (index === 0) {
            snakeCtx.shadowColor = '#8B7ED8';
            snakeCtx.shadowBlur = prefersReducedMotion ? 0 : 20;
        } else {
            snakeCtx.shadowBlur = prefersReducedMotion ? 0 : 5;
        }

        const gradient = snakeCtx.createRadialGradient(x + size / 2, y + size / 2, 0, x + size / 2, y + size / 2, size / 2);

        if (index === 0) {
            gradient.addColorStop(0, '#B8A9E8');
            gradient.addColorStop(0.5, '#8B7ED8');
            gradient.addColorStop(1, '#6B5CB6');
        } else {
            const alpha = 1 - (index / snake.segments.length) * 0.4;
            gradient.addColorStop(0, `rgba(184, 169, 232, ${alpha})`);
            gradient.addColorStop(0.5, `rgba(139, 126, 216, ${alpha})`);
            gradient.addColorStop(1, `rgba(107, 92, 182, ${alpha})`);
        }

        snakeCtx.fillStyle = gradient;
        snakeCtx.beginPath();
        const radius = size * 0.25;
        snakeCtx.roundRect(x + 1, y + 1, size, size, radius);
        snakeCtx.fill();
        snakeCtx.shadowBlur = 0;

        if (index === 0) {
            snakeCtx.fillStyle = 'white';
            const eyeSize = 3;
            const eyeOffset = 6;
            const dir = snake.direction.x || snake.nextDirection.x ? (snake.direction.x || snake.nextDirection.x) : 0;
            const dirY = snake.direction.y || snake.nextDirection.y ? (snake.direction.y || snake.nextDirection.y) : 0;

            if (dir === 1) {
                snakeCtx.fillRect(segment.x * snake.tileSize + snake.tileSize - eyeOffset, segment.y * snake.tileSize + 5, eyeSize, eyeSize);
                snakeCtx.fillRect(segment.x * snake.tileSize + snake.tileSize - eyeOffset, segment.y * snake.tileSize + 12, eyeSize, eyeSize);
            } else if (dir === -1) {
                snakeCtx.fillRect(segment.x * snake.tileSize + eyeOffset - eyeSize, segment.y * snake.tileSize + 5, eyeSize, eyeSize);
                snakeCtx.fillRect(segment.x * snake.tileSize + eyeOffset - eyeSize, segment.y * snake.tileSize + 12, eyeSize, eyeSize);
            } else if (dirY === -1) {
                snakeCtx.fillRect(segment.x * snake.tileSize + 5, segment.y * snake.tileSize + eyeOffset - eyeSize, eyeSize, eyeSize);
                snakeCtx.fillRect(segment.x * snake.tileSize + 12, segment.y * snake.tileSize + eyeOffset - eyeSize, eyeSize, eyeSize);
            } else {
                snakeCtx.fillRect(segment.x * snake.tileSize + 5, segment.y * snake.tileSize + snake.tileSize - eyeOffset, eyeSize, eyeSize);
                snakeCtx.fillRect(segment.x * snake.tileSize + 12, segment.y * snake.tileSize + snake.tileSize - eyeOffset, eyeSize, eyeSize);
            }
        }
    });
}

function updateSnake() {
    if (!snake.gameRunning || snake.gamePaused) return;

    snake.direction = { ...snake.nextDirection };

    const head = {
        x: snake.segments[0].x + snake.direction.x,
        y: snake.segments[0].y + snake.direction.y
    };

    if (head.x < 0 || head.x >= snake.gridSize || head.y < 0 || head.y >= snake.gridSize) {
        gameOverSnake();
        return;
    }

    if (snake.segments.some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOverSnake();
        return;
    }

    snake.segments.unshift(head);

    if (head.x === snake.food.x && head.y === snake.food.y) {
        createFoodParticles(snake.food.x, snake.food.y);
        snake.score += 10;
        document.getElementById('snake-score').textContent = snake.score;

        if (snake.score > snake.best) {
            snake.best = snake.score;
            saveBest('snakeBest', snake.best);
            document.getElementById('snake-best').textContent = snake.best;
        }
        generateFood();
    } else {
        snake.segments.pop();
    }
}

function generateFood() {
    do {
        snake.food = {
            x: Math.floor(Math.random() * snake.gridSize),
            y: Math.floor(Math.random() * snake.gridSize)
        };
    } while (snake.segments.some(segment => segment.x === snake.food.x && segment.y === snake.food.y));
}

function gameOverSnake() {
    snake.gameRunning = false;
    snake.waitingToStart = true;
    document.getElementById('snake-final-score').textContent = snake.score;
    document.getElementById('snake-game-over').classList.add('active');
}

function startSnake() {
    if (snake.gameRunning) return;
    snake.gameRunning = true;
    snake.gamePaused = false;
    snake.waitingToStart = false;
    document.getElementById('snake-game-over').classList.remove('active');
    if (snake.direction.x === 0 && snake.direction.y === 0) {
        snake.nextDirection = { x: 1, y: 0 };
    }
}

function resetSnake() {
    snake.segments = [{ x: 10, y: 10 }];
    snake.direction = { x: 0, y: 0 };
    snake.nextDirection = { x: 0, y: 0 };
    snake.score = 0;
    snake.gameRunning = false;
    snake.gamePaused = false;
    snake.waitingToStart = true;
    snake.foodParticles = [];
    document.getElementById('snake-score').textContent = '0';
    document.getElementById('snake-game-over').classList.remove('active');
    const pauseBtn = document.getElementById('snake-pause');
    if (pauseBtn) pauseBtn.textContent = 'Пауза';
    generateFood();
    drawSnake();
}

function setSnakeDirection(direction) {
    if (!snake.gameRunning) {
        if (['up', 'down', 'left', 'right'].includes(direction)) {
            startSnake();
        } else {
            return;
        }
    }

    if (direction === 'up' && snake.direction.y === 0) snake.nextDirection = { x: 0, y: -1 };
    else if (direction === 'down' && snake.direction.y === 0) snake.nextDirection = { x: 0, y: 1 };
    else if (direction === 'left' && snake.direction.x === 0) snake.nextDirection = { x: -1, y: 0 };
    else if (direction === 'right' && snake.direction.x === 0) snake.nextDirection = { x: 1, y: 0 };
}

let snakeLastUpdate = 0;

function snakeLoop(timestamp) {
    const interval = getSnakeSpeed();
    if (timestamp - snakeLastUpdate >= interval) {
        updateSnake();
        snakeLastUpdate = timestamp;
    }
    if (snakeCanvas) drawSnake();
    requestAnimationFrame(snakeLoop);
}

// ==================== 2048 GAME ====================
let game2048 = {
    grid: [],
    score: 0,
    best: loadBest('2048Best'),
    size: 4,
    won: false,
    keepPlaying: false
};

function init2048() {
    game2048.grid = Array(game2048.size).fill().map(() => Array(game2048.size).fill(0));
    game2048.score = 0;
    game2048.won = false;
    game2048.keepPlaying = false;
    document.getElementById('game2048-score').textContent = '0';
    document.getElementById('game2048-over').classList.remove('active');
    document.getElementById('game2048-win').classList.remove('active');
    addRandomTile();
    addRandomTile();
    render2048();
}

function continue2048() {
    game2048.keepPlaying = true;
    document.getElementById('game2048-win').classList.remove('active');
}

function addRandomTile() {
    const emptyCells = [];
    for (let i = 0; i < game2048.size; i++) {
        for (let j = 0; j < game2048.size; j++) {
            if (game2048.grid[i][j] === 0) emptyCells.push({ i, j });
        }
    }
    if (emptyCells.length > 0) {
        const { i, j } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        game2048.grid[i][j] = Math.random() < 0.9 ? 2 : 4;
    }
}

function render2048() {
    const gridElement = document.getElementById('grid-2048');
    if (!gridElement) return;

    const previousTiles = Array.from(gridElement.querySelectorAll('.tile-2048')).map(tile => ({
        value: tile.textContent ? parseInt(tile.textContent, 10) : 0
    }));

    gridElement.innerHTML = '';
    let tileIndex = 0;

    for (let i = 0; i < game2048.size; i++) {
        for (let j = 0; j < game2048.size; j++) {
            const tile = document.createElement('div');
            tile.className = 'tile-2048';
            const value = game2048.grid[i][j];

            if (value > 0) {
                tile.textContent = value;
                tile.classList.add(`tile-${value}`);

                if (!prefersReducedMotion && previousTiles.length > 0) {
                    const oldTile = previousTiles[tileIndex];
                    if (oldTile && oldTile.value === 0) {
                        tile.style.animation = 'tileAppear 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)';
                    } else if (oldTile && oldTile.value !== 0 && oldTile.value !== value) {
                        tile.style.animation = 'tileMerge 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
                    }
                }
            }

            gridElement.appendChild(tile);
            tileIndex++;
        }
    }
}

function move2048(direction) {
    if (!isFocused('2048')) return;

    let moved = false;
    const newGrid = JSON.parse(JSON.stringify(game2048.grid));

    if (direction === 'left' || direction === 'right') {
        for (let i = 0; i < game2048.size; i++) {
            let row = newGrid[i].filter(val => val !== 0);
            if (direction === 'right') row.reverse();

            for (let j = 0; j < row.length - 1; j++) {
                if (row[j] === row[j + 1]) {
                    row[j] *= 2;
                    game2048.score += row[j];
                    row.splice(j + 1, 1);
                }
            }

            while (row.length < game2048.size) row.push(0);
            if (direction === 'right') row.reverse();

            if (JSON.stringify(newGrid[i]) !== JSON.stringify(row)) moved = true;
            newGrid[i] = row;
        }
    } else {
        for (let j = 0; j < game2048.size; j++) {
            let col = [];
            for (let i = 0; i < game2048.size; i++) {
                if (newGrid[i][j] !== 0) col.push(newGrid[i][j]);
            }
            if (direction === 'down') col.reverse();

            for (let i = 0; i < col.length - 1; i++) {
                if (col[i] === col[i + 1]) {
                    col[i] *= 2;
                    game2048.score += col[i];
                    col.splice(i + 1, 1);
                }
            }

            while (col.length < game2048.size) col.push(0);
            if (direction === 'down') col.reverse();

            for (let i = 0; i < game2048.size; i++) {
                if (newGrid[i][j] !== col[i]) moved = true;
                newGrid[i][j] = col[i];
            }
        }
    }

    if (!moved) return;

    game2048.grid = newGrid;
    document.getElementById('game2048-score').textContent = game2048.score;

    if (game2048.score > game2048.best) {
        game2048.best = game2048.score;
        saveBest('2048Best', game2048.best);
        document.getElementById('game2048-best').textContent = game2048.best;
    }

    addRandomTile();
    render2048();

    if (!game2048.won && !game2048.keepPlaying && has2048Tile()) {
        game2048.won = true;
        document.getElementById('game2048-win').classList.add('active');
    }

    if (isGameOver2048()) {
        document.getElementById('game2048-final-score').textContent = game2048.score;
        document.getElementById('game2048-result-title').textContent = game2048.won ? 'Отличная игра!' : 'Игра окончена!';
        setTimeout(() => {
            document.getElementById('game2048-over').classList.add('active');
        }, 300);
    }
}

function has2048Tile() {
    for (let i = 0; i < game2048.size; i++) {
        for (let j = 0; j < game2048.size; j++) {
            if (game2048.grid[i][j] === 2048) return true;
        }
    }
    return false;
}

function isGameOver2048() {
    for (let i = 0; i < game2048.size; i++) {
        for (let j = 0; j < game2048.size; j++) {
            if (game2048.grid[i][j] === 0) return false;
        }
    }
    for (let i = 0; i < game2048.size; i++) {
        for (let j = 0; j < game2048.size; j++) {
            const current = game2048.grid[i][j];
            if (j < game2048.size - 1 && current === game2048.grid[i][j + 1]) return false;
            if (i < game2048.size - 1 && current === game2048.grid[i + 1][j]) return false;
        }
    }
    return true;
}

function reset2048() {
    init2048();
}

// ==================== BREAKOUT GAME ====================
let breakoutCanvas = null;
let breakoutCtx = null;

let breakout = {
    ball: { x: 300, y: 300, dx: 4, dy: -4, radius: 8 },
    paddle: { x: 250, y: 370, width: 100, height: 12, speed: 8 },
    bricks: [],
    score: 0,
    best: loadBest('breakoutBest'),
    lives: 3,
    gameRunning: false,
    gamePaused: false,
    waitingToStart: true,
    brickRowCount: 5,
    brickColumnCount: 8,
    brickWidth: 65,
    brickHeight: 20,
    brickPadding: 10,
    brickOffsetTop: 40,
    brickOffsetLeft: 30,
    keys: {},
    particles: [],
    ballTrail: [],
    screenShake: 0,
    scale: 1
};

function initBricks() {
    breakout.bricks = [];
    const colors = ['#8B7ED8', '#7A6DC7', '#6B5CB6', '#5C4BA5', '#4D3A94'];

    for (let c = 0; c < breakout.brickColumnCount; c++) {
        breakout.bricks[c] = [];
        for (let r = 0; r < breakout.brickRowCount; r++) {
            breakout.bricks[c][r] = {
                x: c * (breakout.brickWidth + breakout.brickPadding) + breakout.brickOffsetLeft,
                y: r * (breakout.brickHeight + breakout.brickPadding) + breakout.brickOffsetTop,
                status: 1,
                color: colors[r]
            };
        }
    }
}

function createParticles(x, y, color) {
    if (prefersReducedMotion) return;
    for (let i = 0; i < 15; i++) {
        breakout.particles.push({
            x, y,
            vx: (Math.random() - 0.5) * 6,
            vy: (Math.random() - 0.5) * 6,
            life: 1,
            color,
            size: Math.random() * 4 + 2
        });
    }
}

function updateAndDrawParticles() {
    if (!breakoutCtx || prefersReducedMotion) return;

    for (let i = breakout.particles.length - 1; i >= 0; i--) {
        const p = breakout.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.3;
        p.life -= 0.02;

        breakoutCtx.globalAlpha = p.life;
        breakoutCtx.fillStyle = p.color;
        breakoutCtx.beginPath();
        breakoutCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        breakoutCtx.fill();

        if (p.life <= 0) breakout.particles.splice(i, 1);
    }
    breakoutCtx.globalAlpha = 1;
}

function drawBreakout() {
    if (!breakoutCtx) return;

    breakoutCtx.imageSmoothingEnabled = true;
    breakoutCtx.imageSmoothingQuality = 'high';
    breakoutCtx.save();

    if (!prefersReducedMotion && breakout.screenShake > 0) {
        breakoutCtx.translate(
            (Math.random() - 0.5) * breakout.screenShake,
            (Math.random() - 0.5) * breakout.screenShake
        );
        breakout.screenShake *= 0.9;
        if (breakout.screenShake < 0.1) breakout.screenShake = 0;
    }

    breakoutCtx.fillStyle = prefersReducedMotion ? 'rgba(10, 10, 15, 1)' : 'rgba(10, 10, 15, 0.15)';
    breakoutCtx.fillRect(0, 0, breakoutCanvas.width, breakoutCanvas.height);

    for (let c = 0; c < breakout.brickColumnCount; c++) {
        for (let r = 0; r < breakout.brickRowCount; r++) {
            const brick = breakout.bricks[c][r];
            if (brick.status === 1) {
                breakoutCtx.shadowColor = brick.color;
                breakoutCtx.shadowBlur = prefersReducedMotion ? 0 : 10;
                breakoutCtx.fillStyle = brick.color;
                breakoutCtx.beginPath();
                breakoutCtx.roundRect(brick.x, brick.y, breakout.brickWidth, breakout.brickHeight, 5);
                breakoutCtx.fill();
                breakoutCtx.shadowBlur = 0;

                const gradient = breakoutCtx.createLinearGradient(brick.x, brick.y, brick.x, brick.y + breakout.brickHeight);
                gradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
                gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.1)');
                gradient.addColorStop(1, 'rgba(0, 0, 0, 0.2)');
                breakoutCtx.fillStyle = gradient;
                breakoutCtx.beginPath();
                breakoutCtx.roundRect(brick.x, brick.y, breakout.brickWidth, breakout.brickHeight, 5);
                breakoutCtx.fill();
            }
        }
    }

    updateAndDrawParticles();

    if (!prefersReducedMotion) {
        breakout.ballTrail.push({ x: breakout.ball.x, y: breakout.ball.y });
        if (breakout.ballTrail.length > 8) breakout.ballTrail.shift();

        breakout.ballTrail.forEach((trail, index) => {
            breakoutCtx.globalAlpha = (index / breakout.ballTrail.length) * 0.4;
            breakoutCtx.fillStyle = '#B8A9E8';
            breakoutCtx.beginPath();
            breakoutCtx.arc(trail.x, trail.y, breakout.ball.radius * 0.7, 0, Math.PI * 2);
            breakoutCtx.fill();
        });
        breakoutCtx.globalAlpha = 1;
    }

    breakoutCtx.shadowColor = '#B8A9E8';
    breakoutCtx.shadowBlur = prefersReducedMotion ? 0 : 20;

    const ballGradient = breakoutCtx.createRadialGradient(
        breakout.ball.x - 3, breakout.ball.y - 3, 0,
        breakout.ball.x, breakout.ball.y, breakout.ball.radius
    );
    ballGradient.addColorStop(0, '#ffffff');
    ballGradient.addColorStop(0.3, '#E8DEFF');
    ballGradient.addColorStop(0.6, '#B8A9E8');
    ballGradient.addColorStop(1, '#8B7ED8');

    breakoutCtx.beginPath();
    breakoutCtx.arc(breakout.ball.x, breakout.ball.y, breakout.ball.radius, 0, Math.PI * 2);
    breakoutCtx.fillStyle = ballGradient;
    breakoutCtx.fill();
    breakoutCtx.shadowBlur = 0;

    const paddleGradient = breakoutCtx.createLinearGradient(
        breakout.paddle.x, breakout.paddle.y,
        breakout.paddle.x, breakout.paddle.y + breakout.paddle.height
    );
    paddleGradient.addColorStop(0, '#E8DEFF');
    paddleGradient.addColorStop(0.5, '#B8A9E8');
    paddleGradient.addColorStop(1, '#8B7ED8');

    breakoutCtx.fillStyle = paddleGradient;
    breakoutCtx.beginPath();
    breakoutCtx.roundRect(breakout.paddle.x, breakout.paddle.y, breakout.paddle.width, breakout.paddle.height, breakout.paddle.height / 2);
    breakoutCtx.fill();

    breakoutCtx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    breakoutCtx.beginPath();
    breakoutCtx.roundRect(breakout.paddle.x + 5, breakout.paddle.y + 2, breakout.paddle.width - 10, breakout.paddle.height / 3, breakout.paddle.height / 4);
    breakoutCtx.fill();

    if (breakout.waitingToStart && !breakout.gameRunning) {
        breakoutCtx.fillStyle = 'rgba(255,255,255,0.75)';
        breakoutCtx.font = `${14 * breakout.scale}px JetBrains Mono, monospace`;
        breakoutCtx.textAlign = 'center';
        breakoutCtx.fillText('Нажмите «Старт»', breakoutCanvas.width / 2, breakoutCanvas.height / 2);
        breakoutCtx.textAlign = 'left';
    }

    breakoutCtx.restore();
}

function collisionDetection() {
    for (let c = 0; c < breakout.brickColumnCount; c++) {
        for (let r = 0; r < breakout.brickRowCount; r++) {
            const brick = breakout.bricks[c][r];
            if (brick.status !== 1) continue;

            const ball = breakout.ball;
            const closestX = Math.max(brick.x, Math.min(ball.x, brick.x + breakout.brickWidth));
            const closestY = Math.max(brick.y, Math.min(ball.y, brick.y + breakout.brickHeight));
            const distX = ball.x - closestX;
            const distY = ball.y - closestY;
            const distSq = distX * distX + distY * distY;

            if (distSq < ball.radius * ball.radius) {
                if (Math.abs(distX) > Math.abs(distY)) {
                    ball.dx = -ball.dx;
                } else {
                    ball.dy = -ball.dy;
                }

                brick.status = 0;
                createParticles(brick.x + breakout.brickWidth / 2, brick.y + breakout.brickHeight / 2, brick.color);
                if (!prefersReducedMotion) breakout.screenShake = 8;

                breakout.score += 10;
                document.getElementById('breakout-score').textContent = breakout.score;

                if (breakout.score > breakout.best) {
                    breakout.best = breakout.score;
                    saveBest('breakoutBest', breakout.best);
                    document.getElementById('breakout-best').textContent = breakout.best;
                }

                if (breakout.bricks.every(col => col.every(b => b.status === 0))) {
                    winBreakout();
                }
                return;
            }
        }
    }
}

function resetBallOnPaddle() {
    breakout.ball.x = breakout.paddle.x + breakout.paddle.width / 2;
    breakout.ball.y = breakout.paddle.y - breakout.ball.radius - 2;
    breakout.ball.dx = 4 * breakout.scale * (Math.random() > 0.5 ? 1 : -1);
    breakout.ball.dy = -4 * breakout.scale;
    breakout.waitingToStart = true;
    breakout.gameRunning = false;
}

function updateBreakout() {
    if (!breakout.gameRunning || breakout.gamePaused) return;

    breakout.ball.x += breakout.ball.dx;
    breakout.ball.y += breakout.ball.dy;

    const ball = breakout.ball;
    const w = breakoutCanvas.width;
    const h = breakoutCanvas.height;

    if (ball.x - ball.radius <= 0 || ball.x + ball.radius >= w) {
        ball.dx = -ball.dx;
        ball.x = Math.max(ball.radius, Math.min(w - ball.radius, ball.x));
    }
    if (ball.y - ball.radius <= 0) {
        ball.dy = -ball.dy;
        ball.y = ball.radius;
    }

    if (ball.y + ball.radius >= breakout.paddle.y &&
        ball.y - ball.radius <= breakout.paddle.y + breakout.paddle.height &&
        ball.x >= breakout.paddle.x &&
        ball.x <= breakout.paddle.x + breakout.paddle.width &&
        ball.dy > 0) {
        const hitPos = (ball.x - breakout.paddle.x) / breakout.paddle.width;
        ball.dx = (hitPos - 0.5) * 10 * breakout.scale;
        ball.dy = -Math.abs(ball.dy);
        ball.y = breakout.paddle.y - ball.radius - 1;
    } else if (ball.y - ball.radius > h) {
        breakout.lives--;
        document.getElementById('breakout-lives').textContent = breakout.lives;
        if (breakout.lives <= 0) {
            gameOverBreakout();
            return;
        }
        resetBallOnPaddle();
        return;
    }

    if (isFocused('breakout')) {
        if (breakout.keys['ArrowLeft'] || breakout.keys['a']) {
            breakout.paddle.x = Math.max(0, breakout.paddle.x - breakout.paddle.speed);
        }
        if (breakout.keys['ArrowRight'] || breakout.keys['d']) {
            breakout.paddle.x = Math.min(w - breakout.paddle.width, breakout.paddle.x + breakout.paddle.speed);
        }
    }

    collisionDetection();
}

function gameOverBreakout() {
    breakout.gameRunning = false;
    breakout.waitingToStart = true;
    document.getElementById('breakout-final-score').textContent = breakout.score;
    document.getElementById('breakout-result-title').textContent = 'Игра окончена!';
    document.getElementById('breakout-game-over').classList.add('active');
}

function winBreakout() {
    breakout.gameRunning = false;
    document.getElementById('breakout-final-score').textContent = breakout.score;
    document.getElementById('breakout-result-title').textContent = 'Победа! 🎉';
    document.getElementById('breakout-game-over').classList.add('active');
}

function startBreakout() {
    if (breakout.gameRunning) return;
    breakout.gameRunning = true;
    breakout.gamePaused = false;
    breakout.waitingToStart = false;
    document.getElementById('breakout-game-over').classList.remove('active');
}

function resetBreakout() {
    breakout.lives = 3;
    breakout.score = 0;
    breakout.gameRunning = false;
    breakout.gamePaused = false;
    breakout.particles = [];
    breakout.ballTrail = [];
    document.getElementById('breakout-score').textContent = '0';
    document.getElementById('breakout-lives').textContent = '3';
    document.getElementById('breakout-game-over').classList.remove('active');
    const pauseBtn = document.getElementById('breakout-pause');
    if (pauseBtn) pauseBtn.textContent = 'Пауза';
    resetBallOnPaddle();
    initBricks();
    drawBreakout();
}

function breakoutLoop() {
    updateBreakout();
    drawBreakout();
    requestAnimationFrame(breakoutLoop);
}

// ==================== CODE BREAKER ====================
const HEX_CHARS = '0123456789ABCDEF';

let codeBreaker = {
    secret: '',
    maxAttempts: 8,
    currentRow: 0,
    history: [],
    wins: loadBest('codebreakerWins'),
    gameOver: false
};

function generateSecretCode() {
    let code = '';
    for (let i = 0; i < 4; i++) {
        code += HEX_CHARS[Math.floor(Math.random() * HEX_CHARS.length)];
    }
    return code;
}

function evaluateGuess(guess, secret) {
    let exact = 0;
    let partial = 0;
    const secretArr = secret.split('');
    const guessArr = guess.split('');
    const usedSecret = Array(4).fill(false);
    const usedGuess = Array(4).fill(false);

    for (let i = 0; i < 4; i++) {
        if (guessArr[i] === secretArr[i]) {
            exact++;
            usedSecret[i] = true;
            usedGuess[i] = true;
        }
    }

    for (let i = 0; i < 4; i++) {
        if (usedGuess[i]) continue;
        for (let j = 0; j < 4; j++) {
            if (!usedSecret[j] && guessArr[i] === secretArr[j]) {
                partial++;
                usedSecret[j] = true;
                break;
            }
        }
    }

    return { exact, partial };
}

function renderCodeBreakerBoard() {
    const board = document.getElementById('codebreaker-board');
    if (!board) return;
    board.innerHTML = '';

    for (let row = 0; row < codeBreaker.maxAttempts; row++) {
        const rowEl = document.createElement('div');
        rowEl.className = 'codebreaker-row';

        const guessEl = document.createElement('div');
        guessEl.className = 'codebreaker-guess';

        const historyRow = codeBreaker.history[row];

        for (let col = 0; col < 4; col++) {
            if (historyRow) {
                const cell = document.createElement('div');
                cell.className = 'codebreaker-cell';
                cell.textContent = historyRow.guess[col];
                cell.style.cursor = 'default';
                guessEl.appendChild(cell);
            } else if (row === codeBreaker.currentRow && !codeBreaker.gameOver) {
                const input = document.createElement('input');
                input.type = 'text';
                input.maxLength = 1;
                input.className = 'codebreaker-cell';
                input.dataset.col = col;
                input.setAttribute('inputmode', 'text');
                input.setAttribute('autocomplete', 'off');
                if (col === 0) input.id = 'codebreaker-focus';

                input.addEventListener('input', (e) => {
                    e.target.value = e.target.value.toUpperCase().replace(/[^0-9A-F]/g, '');
                    if (e.target.value && col < 3) {
                        const next = guessEl.querySelector(`[data-col="${col + 1}"]`);
                        if (next) next.focus();
                    }
                });

                input.addEventListener('keydown', (e) => {
                    if (e.key === 'Backspace' && !e.target.value && col > 0) {
                        const prev = guessEl.querySelector(`[data-col="${col - 1}"]`);
                        if (prev) prev.focus();
                    }
                    if (e.key === 'Enter') submitCodeBreakerGuess();
                });

                guessEl.appendChild(input);
            } else {
                const cell = document.createElement('div');
                cell.className = 'codebreaker-cell';
                cell.style.opacity = '0.3';
                guessEl.appendChild(cell);
            }
        }

        const feedbackEl = document.createElement('div');
        feedbackEl.className = 'codebreaker-feedback';

        if (historyRow) {
            for (let i = 0; i < historyRow.exact; i++) {
                const dot = document.createElement('span');
                dot.className = 'codebreaker-dot codebreaker-dot--exact';
                feedbackEl.appendChild(dot);
            }
            for (let i = 0; i < historyRow.partial; i++) {
                const dot = document.createElement('span');
                dot.className = 'codebreaker-dot codebreaker-dot--partial';
                feedbackEl.appendChild(dot);
            }
        }

        rowEl.appendChild(guessEl);
        rowEl.appendChild(feedbackEl);
        board.appendChild(rowEl);
    }

    const focusEl = document.getElementById('codebreaker-focus');
    if (focusEl) focusEl.focus();
}

function submitCodeBreakerGuess() {
    if (codeBreaker.gameOver || !isFocused('codebreaker')) return;

    const inputs = document.querySelectorAll(`#codebreaker-board .codebreaker-row:nth-child(${codeBreaker.currentRow + 1}) input`);
    if (inputs.length < 4) return;

    const guess = Array.from(inputs).map(i => i.value.toUpperCase()).join('');
    if (guess.length !== 4 || !/^[0-9A-F]{4}$/.test(guess)) return;

    const { exact, partial } = evaluateGuess(guess, codeBreaker.secret);
    codeBreaker.history.push({ guess, exact, partial });

    if (exact === 4) {
        codeBreaker.gameOver = true;
        codeBreaker.wins++;
        saveBest('codebreakerWins', codeBreaker.wins);
        document.getElementById('codebreaker-wins').textContent = codeBreaker.wins;
        document.getElementById('codebreaker-result').textContent = 'Взломано! 🎉';
        document.getElementById('codebreaker-secret').textContent = codeBreaker.secret;
        document.getElementById('codebreaker-over').classList.add('active');
        renderCodeBreakerBoard();
        return;
    }

    codeBreaker.currentRow++;
    document.getElementById('codebreaker-attempts').textContent = codeBreaker.maxAttempts - codeBreaker.currentRow;

    if (codeBreaker.currentRow >= codeBreaker.maxAttempts) {
        codeBreaker.gameOver = true;
        document.getElementById('codebreaker-result').textContent = 'Поражение';
        document.getElementById('codebreaker-secret').textContent = codeBreaker.secret;
        document.getElementById('codebreaker-over').classList.add('active');
    }

    renderCodeBreakerBoard();
}

function resetCodeBreaker() {
    codeBreaker.secret = generateSecretCode();
    codeBreaker.currentRow = 0;
    codeBreaker.history = [];
    codeBreaker.gameOver = false;
    document.getElementById('codebreaker-attempts').textContent = codeBreaker.maxAttempts;
    document.getElementById('codebreaker-over').classList.remove('active');
    renderCodeBreakerBoard();
}

// ==================== MEMORY MATCH ====================
const MEMORY_PAIRS = [
    { symbol: '⚛️', label: 'React' },
    { symbol: '🟨', label: 'JS' },
    { symbol: '🔷', label: 'TS' },
    { symbol: '🟢', label: 'Node' },
    { symbol: '🐍', label: 'Python' },
    { symbol: '🎨', label: 'CSS' },
    { symbol: '📄', label: 'HTML' },
    { symbol: '🐙', label: 'Git' }
];

let memory = {
    cards: [],
    flipped: [],
    matched: 0,
    moves: 0,
    timer: null,
    seconds: 0,
    locked: false,
    best: localStorage.getItem('memoryBest') || null
};

function shuffleArray(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function initMemory() {
    const pairs = shuffleArray([...MEMORY_PAIRS, ...MEMORY_PAIRS]);
    memory.cards = pairs.map((item, id) => ({ ...item, id, matched: false }));
    memory.flipped = [];
    memory.matched = 0;
    memory.moves = 0;
    memory.seconds = 0;
    memory.locked = false;
    clearInterval(memory.timer);
    memory.timer = null;

    document.getElementById('memory-moves').textContent = '0';
    document.getElementById('memory-time').textContent = '0:00';
    document.getElementById('memory-win').classList.remove('active');

    if (memory.best) {
        document.getElementById('memory-best').textContent = memory.best;
    }

    renderMemory();
}

function startMemoryTimer() {
    if (memory.timer) return;
    memory.timer = setInterval(() => {
        memory.seconds++;
        document.getElementById('memory-time').textContent = formatTime(memory.seconds);
    }, 1000);
}

function renderMemory() {
    const grid = document.getElementById('memory-grid');
    if (!grid) return;
    grid.innerHTML = '';

    memory.cards.forEach((card, index) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'memory-card';
        btn.setAttribute('aria-label', 'Карточка');
        if (card.matched) btn.classList.add('matched');

        btn.innerHTML = `
            <div class="memory-card__inner">
                <div class="memory-card__face memory-card__face--back">?</div>
                <div class="memory-card__face memory-card__face--front">
                    <span>${card.symbol}</span>
                    <span class="memory-card__label">${card.label}</span>
                </div>
            </div>`;

        btn.addEventListener('click', () => flipMemoryCard(index, btn));
        grid.appendChild(btn);
    });
}

function flipMemoryCard(index, btn) {
    if (memory.locked || memory.cards[index].matched) return;
    if (memory.flipped.some(f => f.index === index)) return;

    startMemoryTimer();
    btn.classList.add('flipped');
    memory.flipped.push({ index, btn, label: memory.cards[index].label });

    if (memory.flipped.length === 2) {
        memory.moves++;
        document.getElementById('memory-moves').textContent = memory.moves;
        memory.locked = true;

        const [a, b] = memory.flipped;
        if (a.label === b.label) {
            memory.cards[a.index].matched = true;
            memory.cards[b.index].matched = true;
            a.btn.classList.add('matched');
            b.btn.classList.add('matched');
            memory.matched += 2;
            memory.flipped = [];
            memory.locked = false;

            if (memory.matched === memory.cards.length) {
                clearInterval(memory.timer);
                memory.timer = null;
                const timeStr = formatTime(memory.seconds);
                if (!memory.best || memory.seconds < parseTime(memory.best)) {
                    memory.best = timeStr;
                    localStorage.setItem('memoryBest', timeStr);
                    document.getElementById('memory-best').textContent = timeStr;
                }
                document.getElementById('memory-final-time').textContent = timeStr;
                document.getElementById('memory-final-moves').textContent = memory.moves;
                document.getElementById('memory-win').classList.add('active');
            }
        } else {
            setTimeout(() => {
                a.btn.classList.remove('flipped');
                b.btn.classList.remove('flipped');
                memory.flipped = [];
                memory.locked = false;
            }, prefersReducedMotion ? 400 : 800);
        }
    }
}

function parseTime(str) {
    const [m, s] = str.split(':').map(Number);
    return m * 60 + s;
}

function resetMemory() {
    initMemory();
}

// ==================== TYPING TEST ====================
const TYPING_WORDS = [
    'function', 'const', 'async', 'await', 'return', 'import', 'export', 'class',
    'interface', 'typescript', 'react', 'component', 'useState', 'useEffect',
    'database', 'api', 'fetch', 'promise', 'callback', 'variable', 'string',
    'boolean', 'array', 'object', 'deploy', 'docker', 'kubernetes', 'git',
    'commit', 'merge', 'branch', 'debug', 'console', 'error', 'webpack',
    'vite', 'nextjs', 'tailwind', 'graphql', 'mongodb', 'postgres', 'redis'
];

let typing = {
    words: [],
    currentIndex: 0,
    typed: '',
    correct: 0,
    incorrect: 0,
    running: false,
    timeLeft: 60,
    timer: null,
    best: loadBest('typingBest')
};

function generateTypingWords(count = 40) {
    const words = [];
    for (let i = 0; i < count; i++) {
        words.push(TYPING_WORDS[Math.floor(Math.random() * TYPING_WORDS.length)]);
    }
    return words;
}

function renderTypingDisplay() {
    const display = document.getElementById('typing-display');
    if (!display) return;

    let html = '';
    typing.words.forEach((word, wi) => {
        if (wi > 0) html += ' ';
        const isCurrent = wi === typing.currentIndex;
        const isPast = wi < typing.currentIndex;

        for (let ci = 0; ci < word.length; ci++) {
            let cls = '';
            if (isPast) cls = 'char-correct';
            else if (isCurrent) {
                const typedChar = typing.typed[ci];
                if (typedChar === undefined && ci === typing.typed.length) cls = 'char-current';
                else if (typedChar === word[ci]) cls = 'char-correct';
                else if (typedChar !== undefined) cls = 'char-wrong';
            }
            html += `<span class="${cls}">${word[ci]}</span>`;
        }

        if (isCurrent && typing.typed.length > word.length) {
            for (let extra = word.length; extra < typing.typed.length; extra++) {
                html += `<span class="char-wrong">${typing.typed[extra]}</span>`;
            }
        }
    });

    display.innerHTML = html;
}

function updateTypingStats() {
    const totalChars = typing.correct + typing.incorrect;
    const accuracy = totalChars > 0 ? Math.round((typing.correct / totalChars) * 100) : 100;
    const elapsed = 60 - typing.timeLeft;
    const wpm = elapsed > 0 ? Math.round((typing.correct / 5) / (elapsed / 60)) : 0;

    document.getElementById('typing-wpm').textContent = wpm;
    document.getElementById('typing-accuracy').textContent = `${accuracy}%`;
    return { wpm, accuracy };
}

function startTyping() {
    resetTyping();
    typing.running = true;
    typing.words = generateTypingWords();
    typing.currentIndex = 0;
    typing.typed = '';
    typing.correct = 0;
    typing.incorrect = 0;
    typing.timeLeft = 60;

    const input = document.getElementById('typing-input');
    input.disabled = false;
    input.value = '';
    input.focus();
    document.getElementById('typing-over').classList.remove('active');
    document.getElementById('typing-timer').textContent = '60 сек';
    renderTypingDisplay();

    typing.timer = setInterval(() => {
        typing.timeLeft--;
        document.getElementById('typing-timer').textContent = `${typing.timeLeft} сек`;
        updateTypingStats();

        if (typing.timeLeft <= 0) {
            endTyping();
        }
    }, 1000);
}

function endTyping() {
    typing.running = false;
    clearInterval(typing.timer);
    typing.timer = null;

    const { wpm, accuracy } = updateTypingStats();
    document.getElementById('typing-input').disabled = true;
    document.getElementById('typing-final-wpm').textContent = wpm;
    document.getElementById('typing-final-accuracy').textContent = `${accuracy}%`;
    document.getElementById('typing-over').classList.add('active');

    if (wpm > typing.best) {
        typing.best = wpm;
        saveBest('typingBest', typing.best);
        document.getElementById('typing-best').textContent = typing.best;
    }
}

function resetTyping() {
    typing.running = false;
    clearInterval(typing.timer);
    typing.timer = null;
    typing.words = generateTypingWords();
    typing.currentIndex = 0;
    typing.typed = '';
    typing.correct = 0;
    typing.incorrect = 0;
    typing.timeLeft = 60;

    const input = document.getElementById('typing-input');
    input.disabled = true;
    input.value = '';
    document.getElementById('typing-timer').textContent = '60 сек';
    document.getElementById('typing-wpm').textContent = '0';
    document.getElementById('typing-accuracy').textContent = '100%';
    document.getElementById('typing-over').classList.remove('active');
    renderTypingDisplay();
}

function handleTypingInput(value) {
    if (!typing.running) return;

    const currentWord = typing.words[typing.currentIndex];
    if (!currentWord) return;

    if (value.endsWith(' ') || value.includes(' ')) {
        const trimmed = value.trim();
        if (trimmed === currentWord) {
            typing.correct += currentWord.length + 1;
        } else {
            for (let i = 0; i < Math.max(trimmed.length, currentWord.length); i++) {
                if (trimmed[i] === currentWord[i]) typing.correct++;
                else typing.incorrect++;
            }
        }
        typing.currentIndex++;
        typing.typed = '';

        if (typing.currentIndex >= typing.words.length - 5) {
            typing.words.push(...generateTypingWords(15));
        }
    } else {
        typing.typed = value;
    }

    renderTypingDisplay();
    updateTypingStats();
}

// ==================== CANVAS RESIZE ====================
function resizeCanvas() {
    if (snakeCanvas) {
        const container = snakeCanvas.parentElement;
        const maxWidth = Math.min(container.clientWidth - 50, 400);
        snakeCanvas.width = maxWidth;
        snakeCanvas.height = maxWidth;
        snake.tileSize = maxWidth / snake.gridSize;
        drawSnake();
    }

    if (breakoutCanvas) {
        const container = breakoutCanvas.parentElement;
        const maxWidth = Math.min(container.clientWidth - 50, 600);
        const ratio = 400 / 600;
        breakoutCanvas.width = maxWidth;
        breakoutCanvas.height = maxWidth * ratio;
        breakout.scale = maxWidth / 600;

        breakout.paddle.width = 100 * breakout.scale;
        breakout.paddle.height = 12 * breakout.scale;
        breakout.paddle.x = (breakoutCanvas.width - breakout.paddle.width) / 2;
        breakout.paddle.y = breakoutCanvas.height - 30 * breakout.scale;
        breakout.ball.radius = 8 * breakout.scale;

        breakout.brickWidth = (maxWidth - breakout.brickOffsetLeft * 2 * breakout.scale - breakout.brickPadding * (breakout.brickColumnCount - 1)) / breakout.brickColumnCount;
        breakout.brickHeight = 20 * breakout.scale;
        breakout.brickPadding = 10 * breakout.scale;
        breakout.brickOffsetTop = 40 * breakout.scale;
        breakout.brickOffsetLeft = 30 * breakout.scale;

        if (!breakout.gameRunning) {
            resetBallOnPaddle();
        }

        initBricks();
        drawBreakout();
    }
}

// ==================== EVENT BINDINGS ====================
function bindGameEvents() {
    document.addEventListener('keydown', (e) => {
        const key = e.key.toLowerCase();

        if (isFocused('snake')) {
            if (key === 'arrowup' || key === 'w') {
                e.preventDefault();
                setSnakeDirection('up');
            } else if (key === 'arrowdown' || key === 's') {
                e.preventDefault();
                setSnakeDirection('down');
            } else if (key === 'arrowleft' || key === 'a') {
                e.preventDefault();
                setSnakeDirection('left');
            } else if (key === 'arrowright' || key === 'd') {
                e.preventDefault();
                setSnakeDirection('right');
            }
        }

        if (isFocused('2048')) {
            if (e.key === 'ArrowUp') { e.preventDefault(); move2048('up'); }
            else if (e.key === 'ArrowDown') { e.preventDefault(); move2048('down'); }
            else if (e.key === 'ArrowLeft') { e.preventDefault(); move2048('left'); }
            else if (e.key === 'ArrowRight') { e.preventDefault(); move2048('right'); }
        }

        if (isFocused('breakout')) {
            breakout.keys[e.key] = true;
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') e.preventDefault();
        }
    });

    document.addEventListener('keyup', (e) => {
        breakout.keys[e.key] = false;
    });

    document.querySelectorAll('#snake-mobile-controls .control-btn').forEach(btn => {
        const handler = (e) => {
            e.preventDefault();
            setSnakeDirection(btn.dataset.direction);
        };
        btn.addEventListener('click', handler);
        btn.addEventListener('touchstart', handler, { passive: false });
    });

    const snakeStart = document.getElementById('snake-start');
    if (snakeStart) snakeStart.addEventListener('click', startSnake);

    const snakePause = document.getElementById('snake-pause');
    if (snakePause) {
        snakePause.addEventListener('click', () => {
            if (snake.gameRunning) {
                snake.gamePaused = !snake.gamePaused;
                snakePause.textContent = snake.gamePaused ? 'Продолжить' : 'Пауза';
            }
        });
    }

    const grid2048 = document.getElementById('grid-2048');
    if (grid2048) {
        let touchStartX = 0;
        let touchStartY = 0;

        grid2048.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        }, { passive: true });

        grid2048.addEventListener('touchend', (e) => {
            const deltaX = e.changedTouches[0].clientX - touchStartX;
            const deltaY = e.changedTouches[0].clientY - touchStartY;
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                if (deltaX > 30) move2048('right');
                else if (deltaX < -30) move2048('left');
            } else {
                if (deltaY > 30) move2048('down');
                else if (deltaY < -30) move2048('up');
            }
        }, { passive: true });
    }

    if (breakoutCanvas) {
        breakoutCanvas.addEventListener('mousemove', (e) => {
            if (!breakout.gameRunning) return;
            const rect = breakoutCanvas.getBoundingClientRect();
            const scaleX = breakoutCanvas.width / rect.width;
            const mouseX = (e.clientX - rect.left) * scaleX;
            breakout.paddle.x = Math.max(0, Math.min(breakoutCanvas.width - breakout.paddle.width, mouseX - breakout.paddle.width / 2));
        });

        breakoutCanvas.addEventListener('touchmove', (e) => {
            if (!breakout.gameRunning) return;
            e.preventDefault();
            const rect = breakoutCanvas.getBoundingClientRect();
            const scaleX = breakoutCanvas.width / rect.width;
            const touchX = (e.touches[0].clientX - rect.left) * scaleX;
            breakout.paddle.x = Math.max(0, Math.min(breakoutCanvas.width - breakout.paddle.width, touchX - breakout.paddle.width / 2));
        }, { passive: false });
    }

    const breakoutStart = document.getElementById('breakout-start');
    if (breakoutStart) breakoutStart.addEventListener('click', startBreakout);

    const breakoutPause = document.getElementById('breakout-pause');
    if (breakoutPause) {
        breakoutPause.addEventListener('click', () => {
            if (breakout.gameRunning) {
                breakout.gamePaused = !breakout.gamePaused;
                breakoutPause.textContent = breakout.gamePaused ? 'Продолжить' : 'Пауза';
            }
        });
    }

    const cbSubmit = document.getElementById('codebreaker-submit');
    if (cbSubmit) cbSubmit.addEventListener('click', submitCodeBreakerGuess);

    const typingStart = document.getElementById('typing-start');
    if (typingStart) typingStart.addEventListener('click', startTyping);

    const typingInput = document.getElementById('typing-input');
    if (typingInput) {
        typingInput.addEventListener('input', (e) => handleTypingInput(e.target.value));
    }

    document.querySelectorAll('[data-game]').forEach(card => {
        card.addEventListener('click', () => { focusedGame = card.dataset.game; });
    });

    window.addEventListener('scroll', updateFocusedGame, { passive: true });
    window.addEventListener('resize', resizeCanvas);
}

// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', function () {
    if (document.getElementById('snake-best')) {
        document.getElementById('snake-best').textContent = snake.best;
    }
    if (document.getElementById('game2048-best')) {
        document.getElementById('game2048-best').textContent = game2048.best;
    }
    if (document.getElementById('breakout-best')) {
        document.getElementById('breakout-best').textContent = breakout.best;
    }
    if (document.getElementById('codebreaker-wins')) {
        document.getElementById('codebreaker-wins').textContent = codeBreaker.wins;
    }
    if (document.getElementById('typing-best')) {
        document.getElementById('typing-best').textContent = typing.best;
    }

    snakeCanvas = document.getElementById('snakeCanvas');
    snakeCtx = snakeCanvas ? snakeCanvas.getContext('2d') : null;
    if (snakeCanvas) resetSnake();

    if (document.getElementById('grid-2048')) init2048();

    breakoutCanvas = document.getElementById('breakoutCanvas');
    breakoutCtx = breakoutCanvas ? breakoutCanvas.getContext('2d') : null;
    if (breakoutCanvas) {
        resetBreakout();
        breakoutLoop();
    }

    if (document.getElementById('codebreaker-board')) resetCodeBreaker();
    if (document.getElementById('memory-grid')) initMemory();
    if (document.getElementById('typing-display')) resetTyping();

    bindGameEvents();
    resizeCanvas();
    updateFocusedGame();
    requestAnimationFrame(snakeLoop);
});

window.addEventListener('load', function () {
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        gsap.utils.toArray('.scroll-reveal').forEach((elem) => {
            gsap.from(elem, {
                scrollTrigger: {
                    trigger: elem,
                    start: 'top 80%',
                    end: 'bottom 20%',
                    toggleActions: 'play none none reverse'
                },
                opacity: 0,
                y: 50,
                duration: prefersReducedMotion ? 0 : 1,
                ease: 'power3.out'
            });
        });
    }
});
