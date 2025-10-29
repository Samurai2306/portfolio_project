// ==================== SNAKE GAME ====================
let snakeCanvas = null;
let snakeCtx = null;

let snake = {
    segments: [{x: 10, y: 10}],
    direction: {x: 0, y: 0},
    nextDirection: {x: 0, y: 0},
    score: 0,
    best: localStorage.getItem('snakeBest') || 0,
    gameRunning: false,
    gamePaused: false,
    food: {x: 15, y: 15},
    gridSize: 20,
    tileSize: 20,
    foodParticles: [] // Частицы при поедании еды
};

// Функция для создания частиц еды
function createFoodParticles(x, y) {
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

// Обновление и отрисовка частиц еды
function updateFoodParticles() {
    if (!snakeCtx) return;
    
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
        
        if (p.life <= 0) {
            snake.foodParticles.splice(i, 1);
        }
    }
    
    snakeCtx.globalAlpha = 1;
}

function drawSnake() {
    if (!snakeCtx) return;
    
    // Включаем сглаживание для плавной графики
    snakeCtx.imageSmoothingEnabled = true;
    snakeCtx.imageSmoothingQuality = 'high';
    
    // Очистка канваса с fade эффектом (трейл)
    snakeCtx.fillStyle = 'rgba(10, 10, 15, 0.25)';
    snakeCtx.fillRect(0, 0, snakeCanvas.width, snakeCanvas.height);
    
    // Обновляем частицы еды
    updateFoodParticles();
    
    // Рисуем сетку
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
    
    // Рисуем еду с пульсацией
    const time = Date.now() * 0.003;
    const pulse = Math.sin(time) * 0.2 + 1;
    const foodSize = (snake.tileSize - 6) * pulse;
    const foodOffset = (snake.tileSize - foodSize) / 2;
    
    // Свечение еды
    snakeCtx.shadowColor = '#ff6b6b';
    snakeCtx.shadowBlur = 15 * pulse;
    
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
    
    // Рисуем змейку с улучшенной графикой
    snake.segments.forEach((segment, index) => {
        const x = segment.x * snake.tileSize;
        const y = segment.y * snake.tileSize;
        const size = snake.tileSize - 2;
        
        // Свечение для головы
        if (index === 0) {
            snakeCtx.shadowColor = '#8B7ED8';
            snakeCtx.shadowBlur = 20;
        } else {
            snakeCtx.shadowBlur = 5;
        }
        
        const gradient = snakeCtx.createRadialGradient(
            x + size / 2,
            y + size / 2,
            0,
            x + size / 2,
            y + size / 2,
            size / 2
        );
        
        if (index === 0) {
            // Голова змейки - яркая
            gradient.addColorStop(0, '#B8A9E8');
            gradient.addColorStop(0.5, '#8B7ED8');
            gradient.addColorStop(1, '#6B5CB6');
        } else {
            // Тело змейки - плавное затухание
            const alpha = 1 - (index / snake.segments.length) * 0.4;
            gradient.addColorStop(0, `rgba(184, 169, 232, ${alpha})`);
            gradient.addColorStop(0.5, `rgba(139, 126, 216, ${alpha})`);
            gradient.addColorStop(1, `rgba(107, 92, 182, ${alpha})`);
        }
        
        snakeCtx.fillStyle = gradient;
        
        // Рисуем со скругленными углами
        snakeCtx.beginPath();
        const radius = size * 0.25;
        snakeCtx.roundRect(x + 1, y + 1, size, size, radius);
        snakeCtx.fill();
        snakeCtx.shadowBlur = 0;
        
        // Глаза на голове
        if (index === 0) {
            snakeCtx.fillStyle = 'white';
            const eyeSize = 3;
            const eyeOffset = 6;
            
            if (snake.direction.x === 1) { // Вправо
                snakeCtx.fillRect(segment.x * snake.tileSize + snake.tileSize - eyeOffset, segment.y * snake.tileSize + 5, eyeSize, eyeSize);
                snakeCtx.fillRect(segment.x * snake.tileSize + snake.tileSize - eyeOffset, segment.y * snake.tileSize + 12, eyeSize, eyeSize);
            } else if (snake.direction.x === -1) { // Влево
                snakeCtx.fillRect(segment.x * snake.tileSize + eyeOffset - eyeSize, segment.y * snake.tileSize + 5, eyeSize, eyeSize);
                snakeCtx.fillRect(segment.x * snake.tileSize + eyeOffset - eyeSize, segment.y * snake.tileSize + 12, eyeSize, eyeSize);
            } else if (snake.direction.y === -1) { // Вверх
                snakeCtx.fillRect(segment.x * snake.tileSize + 5, segment.y * snake.tileSize + eyeOffset - eyeSize, eyeSize, eyeSize);
                snakeCtx.fillRect(segment.x * snake.tileSize + 12, segment.y * snake.tileSize + eyeOffset - eyeSize, eyeSize, eyeSize);
            } else if (snake.direction.y === 1) { // Вниз
                snakeCtx.fillRect(segment.x * snake.tileSize + 5, segment.y * snake.tileSize + snake.tileSize - eyeOffset, eyeSize, eyeSize);
                snakeCtx.fillRect(segment.x * snake.tileSize + 12, segment.y * snake.tileSize + snake.tileSize - eyeOffset, eyeSize, eyeSize);
            }
        }
    });
}

function updateSnake() {
    if (!snake.gameRunning || snake.gamePaused) return;
    
    // Обновляем направление
    snake.direction = {...snake.nextDirection};
    
    // Новая позиция головы
    const head = {
        x: snake.segments[0].x + snake.direction.x,
        y: snake.segments[0].y + snake.direction.y
    };
    
    // Проверка столкновения со стенами
    if (head.x < 0 || head.x >= snake.gridSize || head.y < 0 || head.y >= snake.gridSize) {
        gameOverSnake();
        return;
    }
    
    // Проверка столкновения с собой
    if (snake.segments.some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOverSnake();
        return;
    }
    
    snake.segments.unshift(head);
    
    // Проверка поедания еды
    if (head.x === snake.food.x && head.y === snake.food.y) {
        // Создаем частицы при поедании еды
        createFoodParticles(snake.food.x, snake.food.y);
        
        snake.score += 10;
        document.getElementById('snake-score').textContent = snake.score;
        
        if (snake.score > snake.best) {
            snake.best = snake.score;
            localStorage.setItem('snakeBest', snake.best);
            document.getElementById('snake-best').textContent = snake.best;
        }
        
        // Генерируем новую еду
        generateFood();
    } else {
        snake.segments.pop();
    }
    
    drawSnake();
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
    document.getElementById('snake-final-score').textContent = snake.score;
    document.getElementById('snake-game-over').classList.add('active');
}

function resetSnake() {
    snake.segments = [{x: 10, y: 10}];
    snake.direction = {x: 0, y: 0};
    snake.nextDirection = {x: 0, y: 0};
    snake.score = 0;
    snake.gameRunning = false;
    snake.gamePaused = false;
    document.getElementById('snake-score').textContent = '0';
    document.getElementById('snake-game-over').classList.remove('active');
    generateFood();
    drawSnake();
}

// Управление змейкой
function setSnakeDirection(direction) {
    if (!snake.gameRunning) return;
    
    // Предотвращаем движение в противоположном направлении
    if (direction === 'up' && snake.direction.y === 0) {
        snake.nextDirection = {x: 0, y: -1};
    } else if (direction === 'down' && snake.direction.y === 0) {
        snake.nextDirection = {x: 0, y: 1};
    } else if (direction === 'left' && snake.direction.x === 0) {
        snake.nextDirection = {x: -1, y: 0};
    } else if (direction === 'right' && snake.direction.x === 0) {
        snake.nextDirection = {x: 1, y: 0};
    }
}

document.addEventListener('keydown', (e) => {
    if (!snake.gameRunning) return;
    
    const key = e.key.toLowerCase();
    
    if (key === 'arrowup' || key === 'w') {
        setSnakeDirection('up');
    } else if (key === 'arrowdown' || key === 's') {
        setSnakeDirection('down');
    } else if (key === 'arrowleft' || key === 'a') {
        setSnakeDirection('left');
    } else if (key === 'arrowright' || key === 'd') {
        setSnakeDirection('right');
    }
});

// Мобильные кнопки управления для Snake
document.querySelectorAll('#snake-mobile-controls .control-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const direction = btn.dataset.direction;
        setSnakeDirection(direction);
    });
    
    // Touch события для лучшей отзывчивости
    btn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const direction = btn.dataset.direction;
        setSnakeDirection(direction);
    });
});

// Кнопки управления Snake
if (document.getElementById('snake-start')) {
    document.getElementById('snake-start').addEventListener('click', () => {
        if (!snake.gameRunning) {
            snake.gameRunning = true;
            snake.gamePaused = false;
            if (snake.direction.x === 0 && snake.direction.y === 0) {
                snake.nextDirection = {x: 1, y: 0};
            }
        }
    });
}

if (document.getElementById('snake-pause')) {
    document.getElementById('snake-pause').addEventListener('click', () => {
        if (snake.gameRunning) {
            snake.gamePaused = !snake.gamePaused;
            document.getElementById('snake-pause').textContent = snake.gamePaused ? 'Продолжить' : 'Пауза';
        }
    });
}

// Игровой цикл Snake с улучшенной плавностью
let snakeLastUpdate = 0;
const snakeUpdateInterval = 120; // Более быстрое обновление для плавности

function snakeLoop(timestamp) {
    if (timestamp - snakeLastUpdate >= snakeUpdateInterval) {
        updateSnake();
        snakeLastUpdate = timestamp;
    }
    // Все равно перерисовываем каждый кадр для плавной анимации еды
    if (snake.gameRunning || snake.segments.length > 0) {
        drawSnake();
    }
    requestAnimationFrame(snakeLoop);
}

// Запускаем цикл после инициализации
if (typeof window !== 'undefined') {
    requestAnimationFrame(snakeLoop);
}

// ==================== 2048 GAME ====================
let game2048 = {
    grid: [],
    score: 0,
    best: localStorage.getItem('2048Best') || 0,
    size: 4
};

function init2048() {
    game2048.grid = Array(game2048.size).fill().map(() => Array(game2048.size).fill(0));
    game2048.score = 0;
    document.getElementById('game2048-score').textContent = '0';
    document.getElementById('game2048-over').classList.remove('active');
    
    addRandomTile();
    addRandomTile();
    render2048();
}

function addRandomTile() {
    const emptyCells = [];
    for (let i = 0; i < game2048.size; i++) {
        for (let j = 0; j < game2048.size; j++) {
            if (game2048.grid[i][j] === 0) {
                emptyCells.push({i, j});
            }
        }
    }
    
    if (emptyCells.length > 0) {
        const {i, j} = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        game2048.grid[i][j] = Math.random() < 0.9 ? 2 : 4;
    }
}

function render2048() {
    const gridElement = document.getElementById('grid-2048');
    if (!gridElement) return;
    
    // Сохраняем предыдущее состояние для анимаций
    const previousTiles = Array.from(gridElement.querySelectorAll('.tile-2048')).map(tile => ({
        value: tile.textContent ? parseInt(tile.textContent) : 0,
        element: tile
    }));
    
    gridElement.innerHTML = '';
    
    let tileIndex = 0;
    for (let i = 0; i < game2048.size; i++) {
        for (let j = 0; j < game2048.size; j++) {
            const tile = document.createElement('div');
            tile.className = 'tile-2048';
            tile.dataset.position = `${i}-${j}`;
            const value = game2048.grid[i][j];
            
            if (value > 0) {
                tile.textContent = value;
                tile.classList.add(`tile-${value}`);
                
                // Анимация появления новой плитки
                if (previousTiles.length > 0) {
                    const oldTile = previousTiles[tileIndex];
                    if (oldTile && oldTile.value === 0 && value > 0) {
                        tile.style.animation = 'tileAppear 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)';
                    }
                    // Анимация объединения плиток
                    else if (oldTile && oldTile.value !== 0 && oldTile.value !== value && value > 0) {
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
    let moved = false;
    const newGrid = JSON.parse(JSON.stringify(game2048.grid));
    
    if (direction === 'left' || direction === 'right') {
        for (let i = 0; i < game2048.size; i++) {
            let row = newGrid[i].filter(val => val !== 0);
            
            if (direction === 'right') {
                row.reverse();
            }
            
            for (let j = 0; j < row.length - 1; j++) {
                if (row[j] === row[j + 1]) {
                    row[j] *= 2;
                    game2048.score += row[j];
                    row.splice(j + 1, 1);
                }
            }
            
            while (row.length < game2048.size) {
                row.push(0);
            }
            
            if (direction === 'right') {
                row.reverse();
            }
            
            if (JSON.stringify(newGrid[i]) !== JSON.stringify(row)) {
                moved = true;
            }
            
            newGrid[i] = row;
        }
    } else { // up or down
        for (let j = 0; j < game2048.size; j++) {
            let col = [];
            for (let i = 0; i < game2048.size; i++) {
                if (newGrid[i][j] !== 0) {
                    col.push(newGrid[i][j]);
                }
            }
            
            if (direction === 'down') {
                col.reverse();
            }
            
            for (let i = 0; i < col.length - 1; i++) {
                if (col[i] === col[i + 1]) {
                    col[i] *= 2;
                    game2048.score += col[i];
                    col.splice(i + 1, 1);
                }
            }
            
            while (col.length < game2048.size) {
                col.push(0);
            }
            
            if (direction === 'down') {
                col.reverse();
            }
            
            for (let i = 0; i < game2048.size; i++) {
                if (newGrid[i][j] !== col[i]) {
                    moved = true;
                }
                newGrid[i][j] = col[i];
            }
        }
    }
    
    if (moved) {
        game2048.grid = newGrid;
        document.getElementById('game2048-score').textContent = game2048.score;
        
        if (game2048.score > game2048.best) {
            game2048.best = game2048.score;
            localStorage.setItem('2048Best', game2048.best);
            document.getElementById('game2048-best').textContent = game2048.best;
        }
        
        addRandomTile();
        render2048();
        
        if (isGameOver2048()) {
            document.getElementById('game2048-final-score').textContent = game2048.score;
            setTimeout(() => {
                document.getElementById('game2048-over').classList.add('active');
            }, 300);
        }
    }
}

function isGameOver2048() {
    // Проверяем наличие пустых клеток
    for (let i = 0; i < game2048.size; i++) {
        for (let j = 0; j < game2048.size; j++) {
            if (game2048.grid[i][j] === 0) return false;
        }
    }
    
    // Проверяем возможность объединения
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

// Управление 2048
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') {
        e.preventDefault();
        move2048('up');
    } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        move2048('down');
    } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        move2048('left');
    } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        move2048('right');
    }
});

// Touch поддержка для 2048
let touchStartX = 0;
let touchStartY = 0;

if (document.getElementById('grid-2048')) {
    document.getElementById('grid-2048').addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    });

    document.getElementById('grid-2048').addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
        
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            if (deltaX > 30) move2048('right');
            else if (deltaX < -30) move2048('left');
        } else {
            if (deltaY > 30) move2048('down');
            else if (deltaY < -30) move2048('up');
        }
    });
}

// ==================== BREAKOUT GAME ====================
let breakoutCanvas = null;
let breakoutCtx = null;

let breakout = {
    ball: { x: 300, y: 300, dx: 3, dy: -3, radius: 8 },
    paddle: { x: 250, y: 370, width: 100, height: 12, speed: 7 },
    bricks: [],
    score: 0,
    best: localStorage.getItem('breakoutBest') || 0,
    gameRunning: false,
    gamePaused: false,
    brickRowCount: 5,
    brickColumnCount: 8,
    brickWidth: 65,
    brickHeight: 20,
    brickPadding: 10,
    brickOffsetTop: 40,
    brickOffsetLeft: 30,
    keys: {},
    particles: [], // Частицы для эффектов
    ballTrail: [], // Трейл мяча
    screenShake: 0, // Вибрация экрана
    lastTime: 0 // Для deltaTime
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

// Создание частиц при разрушении кирпича
function createParticles(x, y, color) {
    for (let i = 0; i < 15; i++) {
        breakout.particles.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 6,
            vy: (Math.random() - 0.5) * 6,
            life: 1,
            color: color,
            size: Math.random() * 4 + 2
        });
    }
}

// Обновление и рисование частиц
function updateAndDrawParticles() {
    if (!breakoutCtx) return;
    
    for (let i = breakout.particles.length - 1; i >= 0; i--) {
        const p = breakout.particles[i];
        
        // Обновление позиции
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.3; // Гравитация
        p.life -= 0.02;
        
        // Рисование частицы
        breakoutCtx.globalAlpha = p.life;
        breakoutCtx.fillStyle = p.color;
        breakoutCtx.beginPath();
        breakoutCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        breakoutCtx.fill();
        
        // Удаление мертвых частиц
        if (p.life <= 0) {
            breakout.particles.splice(i, 1);
        }
    }
    
    breakoutCtx.globalAlpha = 1;
}

function drawBreakout() {
    if (!breakoutCtx) return;
    
    // Включаем сглаживание
    breakoutCtx.imageSmoothingEnabled = true;
    breakoutCtx.imageSmoothingQuality = 'high';
    
    // Сохраняем состояние и применяем screen shake
    breakoutCtx.save();
    if (breakout.screenShake > 0) {
        const shakeX = (Math.random() - 0.5) * breakout.screenShake;
        const shakeY = (Math.random() - 0.5) * breakout.screenShake;
        breakoutCtx.translate(shakeX, shakeY);
        breakout.screenShake *= 0.9; // Затухание вибрации
        if (breakout.screenShake < 0.1) breakout.screenShake = 0;
    }
    
    // Очистка с эффектом затухания (для трейла)
    breakoutCtx.fillStyle = 'rgba(10, 10, 15, 0.15)';
    breakoutCtx.fillRect(0, 0, breakoutCanvas.width, breakoutCanvas.height);
    
    // Рисуем кирпичи со скругленными углами
    for (let c = 0; c < breakout.brickColumnCount; c++) {
        for (let r = 0; r < breakout.brickRowCount; r++) {
            const brick = breakout.bricks[c][r];
            if (brick.status === 1) {
                // Свечение вокруг кирпича
                breakoutCtx.shadowColor = brick.color;
                breakoutCtx.shadowBlur = 10;
                
                breakoutCtx.fillStyle = brick.color;
                breakoutCtx.beginPath();
                breakoutCtx.roundRect(brick.x, brick.y, breakout.brickWidth, breakout.brickHeight, 5);
                breakoutCtx.fill();
                
                breakoutCtx.shadowBlur = 0;
                
                // Блик на кирпиче
                const gradient = breakoutCtx.createLinearGradient(
                    brick.x, brick.y,
                    brick.x, brick.y + breakout.brickHeight
                );
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
    
    // Рисуем частицы
    updateAndDrawParticles();
    
    // Добавляем текущую позицию мяча в трейл
    breakout.ballTrail.push({
        x: breakout.ball.x,
        y: breakout.ball.y,
        life: 1
    });
    
    // Ограничиваем длину трейла
    if (breakout.ballTrail.length > 8) {
        breakout.ballTrail.shift();
    }
    
    // Рисуем трейл мяча
    breakout.ballTrail.forEach((trail, index) => {
        const alpha = (index / breakout.ballTrail.length) * 0.4;
        breakoutCtx.globalAlpha = alpha;
        breakoutCtx.fillStyle = '#B8A9E8';
        breakoutCtx.beginPath();
        breakoutCtx.arc(trail.x, trail.y, breakout.ball.radius * 0.7, 0, Math.PI * 2);
        breakoutCtx.fill();
    });
    breakoutCtx.globalAlpha = 1;
    
    // Свечение мяча
    breakoutCtx.shadowColor = '#B8A9E8';
    breakoutCtx.shadowBlur = 20;
    
    // Рисуем мяч
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
    breakoutCtx.closePath();
    
    breakoutCtx.shadowBlur = 0;
    
    // Рисуем платформу с улучшенным дизайном
    breakoutCtx.shadowColor = '#8B7ED8';
    breakoutCtx.shadowBlur = 15;
    
    const paddleGradient = breakoutCtx.createLinearGradient(
        breakout.paddle.x, breakout.paddle.y,
        breakout.paddle.x, breakout.paddle.y + breakout.paddle.height
    );
    paddleGradient.addColorStop(0, '#E8DEFF');
    paddleGradient.addColorStop(0.5, '#B8A9E8');
    paddleGradient.addColorStop(1, '#8B7ED8');
    
    breakoutCtx.fillStyle = paddleGradient;
    breakoutCtx.beginPath();
    breakoutCtx.roundRect(
        breakout.paddle.x, 
        breakout.paddle.y, 
        breakout.paddle.width, 
        breakout.paddle.height,
        breakout.paddle.height / 2
    );
    breakoutCtx.fill();
    
    // Блик на платформе
    breakoutCtx.shadowBlur = 0;
    breakoutCtx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    breakoutCtx.beginPath();
    breakoutCtx.roundRect(
        breakout.paddle.x + 5, 
        breakout.paddle.y + 2, 
        breakout.paddle.width - 10, 
        breakout.paddle.height / 3,
        breakout.paddle.height / 4
    );
    breakoutCtx.fill();
    
    // Восстанавливаем состояние canvas
    breakoutCtx.restore();
}

function collisionDetection() {
    for (let c = 0; c < breakout.brickColumnCount; c++) {
        for (let r = 0; r < breakout.brickRowCount; r++) {
            const brick = breakout.bricks[c][r];
            if (brick.status === 1) {
                if (breakout.ball.x + breakout.ball.radius > brick.x &&
                    breakout.ball.x - breakout.ball.radius < brick.x + breakout.brickWidth &&
                    breakout.ball.y + breakout.ball.radius > brick.y &&
                    breakout.ball.y - breakout.ball.radius < brick.y + breakout.brickHeight) {
                    breakout.ball.dy = -breakout.ball.dy;
                    brick.status = 0;
                    
                    // Создаем частицы при разрушении кирпича
                    createParticles(
                        brick.x + breakout.brickWidth / 2,
                        brick.y + breakout.brickHeight / 2,
                        brick.color
                    );
                    
                    // Добавляем screen shake эффект
                    breakout.screenShake = 8;
                    
                    breakout.score += 10;
                    document.getElementById('breakout-score').textContent = breakout.score;
                    
                    if (breakout.score > breakout.best) {
                        breakout.best = breakout.score;
                        localStorage.setItem('breakoutBest', breakout.best);
                        document.getElementById('breakout-best').textContent = breakout.best;
                    }
                    
                    // Проверка победы
                    if (breakout.score === breakout.brickRowCount * breakout.brickColumnCount * 10) {
                        winBreakout();
                    }
                }
            }
        }
    }
}

function updateBreakout() {
    if (!breakout.gameRunning || breakout.gamePaused) return;
    
    // Обновление позиции мяча
    breakout.ball.x += breakout.ball.dx;
    breakout.ball.y += breakout.ball.dy;
    
    // Отскок от стен
    if (breakout.ball.x + breakout.ball.dx > breakoutCanvas.width - breakout.ball.radius ||
        breakout.ball.x + breakout.ball.dx < breakout.ball.radius) {
        breakout.ball.dx = -breakout.ball.dx;
    }
    
    if (breakout.ball.y + breakout.ball.dy < breakout.ball.radius) {
        breakout.ball.dy = -breakout.ball.dy;
    } else if (breakout.ball.y + breakout.ball.dy > breakoutCanvas.height - breakout.ball.radius) {
        // Проверка столкновения с платформой
        if (breakout.ball.x > breakout.paddle.x &&
            breakout.ball.x < breakout.paddle.x + breakout.paddle.width) {
            // Изменяем угол отскока в зависимости от точки удара
            const hitPos = (breakout.ball.x - breakout.paddle.x) / breakout.paddle.width;
            breakout.ball.dx = (hitPos - 0.5) * 8;
            breakout.ball.dy = -breakout.ball.dy;
        } else {
            gameOverBreakout();
            return;
        }
    }
    
    // Управление платформой
    if (breakout.keys['ArrowLeft'] && breakout.paddle.x > 0) {
        breakout.paddle.x -= breakout.paddle.speed;
    }
    if (breakout.keys['ArrowRight'] && breakout.paddle.x < breakoutCanvas.width - breakout.paddle.width) {
        breakout.paddle.x += breakout.paddle.speed;
    }
    
    collisionDetection();
    drawBreakout();
}

function gameOverBreakout() {
    breakout.gameRunning = false;
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

function resetBreakout() {
    breakout.ball = { x: 300, y: 300, dx: 3, dy: -3, radius: 8 };
    breakout.paddle = { x: 250, y: 370, width: 100, height: 12, speed: 7 };
    breakout.score = 0;
    breakout.gameRunning = false;
    breakout.gamePaused = false;
    document.getElementById('breakout-score').textContent = '0';
    document.getElementById('breakout-game-over').classList.remove('active');
    initBricks();
    drawBreakout();
}

// Управление Breakout клавиатурой
document.addEventListener('keydown', (e) => {
    breakout.keys[e.key] = true;
});

document.addEventListener('keyup', (e) => {
    breakout.keys[e.key] = false;
});

// Управление мышью для Breakout
if (breakoutCanvas) {
    breakoutCanvas.addEventListener('mousemove', (e) => {
        const rect = breakoutCanvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        
        if (mouseX > 0 && mouseX < breakoutCanvas.width) {
            breakout.paddle.x = mouseX - breakout.paddle.width / 2;
            
            // Ограничения
            if (breakout.paddle.x < 0) breakout.paddle.x = 0;
            if (breakout.paddle.x > breakoutCanvas.width - breakout.paddle.width) {
                breakout.paddle.x = breakoutCanvas.width - breakout.paddle.width;
            }
        }
    });
    
    // Touch поддержка
    breakoutCanvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const rect = breakoutCanvas.getBoundingClientRect();
        const touchX = e.touches[0].clientX - rect.left;
        
        if (touchX > 0 && touchX < breakoutCanvas.width) {
            breakout.paddle.x = touchX - breakout.paddle.width / 2;
            
            if (breakout.paddle.x < 0) breakout.paddle.x = 0;
            if (breakout.paddle.x > breakoutCanvas.width - breakout.paddle.width) {
                breakout.paddle.x = breakoutCanvas.width - breakout.paddle.width;
            }
        }
    });
}

// Кнопки управления Breakout
if (document.getElementById('breakout-start')) {
    document.getElementById('breakout-start').addEventListener('click', () => {
        if (!breakout.gameRunning) {
            breakout.gameRunning = true;
            breakout.gamePaused = false;
        }
    });
}

if (document.getElementById('breakout-pause')) {
    document.getElementById('breakout-pause').addEventListener('click', () => {
        if (breakout.gameRunning) {
            breakout.gamePaused = !breakout.gamePaused;
            document.getElementById('breakout-pause').textContent = breakout.gamePaused ? 'Продолжить' : 'Пауза';
        }
    });
}

// Игровой цикл Breakout
function breakoutLoop() {
    updateBreakout();
    requestAnimationFrame(breakoutLoop);
}

// ==================== АДАПТИВНОСТЬ CANVAS ====================
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
        const ratio = 400 / 600; // Оригинальное соотношение сторон
        breakoutCanvas.width = maxWidth;
        breakoutCanvas.height = maxWidth * ratio;
        
        // Масштабируем игровые элементы
        const scale = maxWidth / 600;
        breakout.paddle.width = 100 * scale;
        breakout.paddle.height = 12 * scale;
        breakout.paddle.x = (breakoutCanvas.width - breakout.paddle.width) / 2;
        breakout.paddle.y = breakoutCanvas.height - 30;
        breakout.ball.radius = 8 * scale;
        breakout.ball.x = breakoutCanvas.width / 2;
        breakout.ball.y = breakoutCanvas.height / 2;
        
        // Пересчитываем кирпичи
        const totalBrickWidth = breakout.brickColumnCount * breakout.brickWidth + (breakout.brickColumnCount - 1) * breakout.brickPadding;
        breakout.brickWidth = (maxWidth - breakout.brickOffsetLeft * 2 - breakout.brickPadding * (breakout.brickColumnCount - 1)) / breakout.brickColumnCount;
        breakout.brickHeight = 20 * scale;
        breakout.brickPadding = 10 * scale;
        breakout.brickOffsetTop = 40 * scale;
        breakout.brickOffsetLeft = 30 * scale;
        
        initBricks();
        drawBreakout();
    }
}

// ==================== ИНИЦИАЛИЗАЦИЯ ====================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎮 Games.js: DOM загружен, начинаем инициализацию...');
    
    // Обновляем рекорды из localStorage
    if (document.getElementById('snake-best')) {
        document.getElementById('snake-best').textContent = snake.best;
        console.log('✅ Snake рекорд обновлен:', snake.best);
    }
    if (document.getElementById('game2048-best')) {
        document.getElementById('game2048-best').textContent = game2048.best;
        console.log('✅ 2048 рекорд обновлен:', game2048.best);
    }
    if (document.getElementById('breakout-best')) {
        document.getElementById('breakout-best').textContent = breakout.best;
        console.log('✅ Breakout рекорд обновлен:', breakout.best);
    }
    
    // Инициализация Snake
    snakeCanvas = document.getElementById('snakeCanvas');
    console.log('🐍 Snake canvas:', snakeCanvas);
    snakeCtx = snakeCanvas ? snakeCanvas.getContext('2d') : null;
    
    if (snakeCanvas) {
        console.log('✅ Инициализация Snake...');
        resetSnake();
        console.log('✅ Snake готов!');
    } else {
        console.error('❌ Snake canvas не найден!');
    }
    
    // Инициализация 2048
    const grid2048 = document.getElementById('grid-2048');
    console.log('🎯 2048 grid:', grid2048);
    if (grid2048) {
        console.log('✅ Инициализация 2048...');
        init2048();
        console.log('✅ 2048 готов!');
    } else {
        console.error('❌ 2048 grid не найден!');
    }
    
    // Инициализация Breakout
    breakoutCanvas = document.getElementById('breakoutCanvas');
    console.log('🎮 Breakout canvas:', breakoutCanvas);
    breakoutCtx = breakoutCanvas ? breakoutCanvas.getContext('2d') : null;
    
    if (breakoutCanvas) {
        console.log('✅ Инициализация Breakout...');
        initBricks();
        drawBreakout();
        breakoutLoop();
        console.log('✅ Breakout готов!');
    } else {
        console.error('❌ Breakout canvas не найден!');
    }
    
    // Адаптивность canvas
    resizeCanvas();
    console.log('✅ Все игры инициализированы!');
    
    // ПРИНУДИТЕЛЬНАЯ ПРОВЕРКА ВИДИМОСТИ
    console.log('\n🔍 ПРОВЕРКА ВИДИМОСТИ:');
    
    // Делаем элементы видимыми принудительно
    if (snakeCanvas) {
        const style = window.getComputedStyle(snakeCanvas);
        const rect = snakeCanvas.getBoundingClientRect();
        console.log('Snake Canvas:');
        console.log('  - Display:', style.display);
        console.log('  - Visibility:', style.visibility);
        console.log('  - Opacity:', style.opacity);
        console.log('  - Width:', rect.width, 'px');
        console.log('  - Height:', rect.height, 'px');
        console.log('  - Top:', rect.top, 'px');
        console.log('  - Left:', rect.left, 'px');
        
        // Canvas готов к отрисовке
        if (snakeCtx && rect.width > 0 && rect.height > 0) {
            console.log('  ✅ Snake canvas готов к отрисовке');
        } else {
            console.error('  ❌ Canvas имеет нулевой размер или нет контекста');
        }
    }
    
    if (grid2048) {
        const style = window.getComputedStyle(grid2048);
        const rect = grid2048.getBoundingClientRect();
        console.log('2048 Grid:');
        console.log('  - Display:', style.display);
        console.log('  - Visibility:', style.visibility);
        console.log('  - Opacity:', style.opacity);
        console.log('  - Width:', rect.width, 'px');
        console.log('  - Height:', rect.height, 'px');
        console.log('  - Children count:', grid2048.children.length);
    }
    
    if (breakoutCanvas) {
        const style = window.getComputedStyle(breakoutCanvas);
        const rect = breakoutCanvas.getBoundingClientRect();
        console.log('Breakout Canvas:');
        console.log('  - Display:', style.display);
        console.log('  - Visibility:', style.visibility);
        console.log('  - Opacity:', style.opacity);
        console.log('  - Width:', rect.width, 'px');
        console.log('  - Height:', rect.height, 'px');
        
        // Canvas готов к отрисовке
        if (breakoutCtx && rect.width > 0 && rect.height > 0) {
            console.log('  ✅ Breakout canvas готов к отрисовке');
        } else {
            console.error('  ❌ Canvas имеет нулевой размер или нет контекста');
        }
    }
    
    console.log('\n✨ Все игры загружены успешно!');
    console.log('   💡 Прокрутите страницу вниз, чтобы увидеть игры');
});

// Вызываем при изменении размера окна
window.addEventListener('resize', resizeCanvas);

// Scroll reveal animations - инициализация после загрузки страницы
window.addEventListener('load', function() {
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
                duration: 1,
                ease: 'power3.out'
            });
        });
    }
});

