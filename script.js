/* ============================================
   MUSHAK: MODAK MISSION - GAME LOGIC
   A festive Ganesh Chaturthi browser game
   ============================================ */

// ============================================
// GAME CONFIGURATION
// ============================================

const GAME_CONFIG = {
    CANVAS_WIDTH: 800,
    CANVAS_HEIGHT: 600,
    PLAYER_SIZE: 25,
    MODAK_SIZE: 15,
    BONUS_SIZE: 20,
    OBSTACLE_SIZE: 30,
    PLAYER_SPEED: 5,
    GAME_TIME: 120, // seconds
    TARGET_MODAKS: 50,
    INITIAL_LIVES: 3,
    OBSTACLE_SPAWN_RATE: 0.02,
    MODAK_SPAWN_RATE: 0.15,
    BONUS_SPAWN_RATE: 0.01,
};

// ============================================
// GAME STATE OBJECT
// ============================================

const gameState = {
    isRunning: false,
    isPaused: false,
    score: 0,
    modaksCollected: 0,
    lives: GAME_CONFIG.INITIAL_LIVES,
    timeLeft: GAME_CONFIG.GAME_TIME,
    level: 1,
    gameStarted: false,
    isMuted: false,
};

// ============================================
// PLAYER CLASS
// ============================================

class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = GAME_CONFIG.PLAYER_SIZE;
        this.height = GAME_CONFIG.PLAYER_SIZE;
        this.velocityX = 0;
        this.velocityY = 0;
        this.speed = GAME_CONFIG.PLAYER_SPEED;
        this.isInvulnerable = false;
        this.invulnerableTime = 0;
    }

    // Update player position based on velocity
    update() {
        this.x += this.velocityX;
        this.y += this.velocityY;

        // Keep player within canvas bounds
        if (this.x < 0) this.x = 0;
        if (this.x + this.width > GAME_CONFIG.CANVAS_WIDTH) {
            this.x = GAME_CONFIG.CANVAS_WIDTH - this.width;
        }
        if (this.y < 0) this.y = 0;
        if (this.y + this.height > GAME_CONFIG.CANVAS_HEIGHT) {
            this.y = GAME_CONFIG.CANVAS_HEIGHT - this.height;
        }

        // Handle invulnerability timer
        if (this.isInvulnerable) {
            this.invulnerableTime--;
            if (this.invulnerableTime <= 0) {
                this.isInvulnerable = false;
            }
        }
    }

    // Draw player on canvas
    draw(ctx) {
        // Draw with flashing effect when invulnerable
        if (this.isInvulnerable && Math.floor(Date.now() / 100) % 2) {
            ctx.globalAlpha = 0.5;
        }

        // Draw mouse body
        ctx.fillStyle = '#8b4513';
        ctx.beginPath();
        ctx.ellipse(this.x + this.width / 2, this.y + this.height / 2, 
                    this.width / 2, this.height / 2, 0, 0, Math.PI * 2);
        ctx.fill();

        // Draw mouse ears
        ctx.fillStyle = '#8b4513';
        ctx.beginPath();
        ctx.arc(this.x + 8, this.y + 5, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.x + 17, this.y + 5, 6, 0, Math.PI * 2);
        ctx.fill();

        // Draw inner ears
        ctx.fillStyle = '#d2691e';
        ctx.beginPath();
        ctx.arc(this.x + 8, this.y + 5, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.x + 17, this.y + 5, 3, 0, Math.PI * 2);
        ctx.fill();

        // Draw eyes
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(this.x + 6, this.y + 12, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.x + 19, this.y + 12, 2, 0, Math.PI * 2);
        ctx.fill();

        // Draw tail
        ctx.strokeStyle = '#8b4513';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.quadraticCurveTo(this.x + 25, this.y + 10, this.x + 35, this.y - 5);
        ctx.stroke();

        ctx.globalAlpha = 1.0;
    }

    // Set velocity based on key press
    setVelocity(key, speed) {
        switch(key) {
            case 'ArrowUp':
            case 'w':
            case 'W':
                this.velocityY = -speed;
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                this.velocityY = speed;
                break;
            case 'ArrowLeft':
            case 'a':
            case 'A':
                this.velocityX = -speed;
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                this.velocityX = speed;
                break;
        }
    }

    // Stop velocity on specific axis
    stopVelocity(key) {
        switch(key) {
            case 'ArrowUp':
            case 'w':
            case 'W':
            case 'ArrowDown':
            case 's':
            case 'S':
                this.velocityY = 0;
                break;
            case 'ArrowLeft':
            case 'a':
            case 'A':
            case 'ArrowRight':
            case 'd':
            case 'D':
                this.velocityX = 0;
                break;
        }
    }
}

// ============================================
// GAME ITEM CLASSES
// ============================================

class Modak {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = GAME_CONFIG.MODAK_SIZE;
        this.height = GAME_CONFIG.MODAK_SIZE;
        this.collected = false;
    }

    draw(ctx) {
        // Draw modak (sweet dumpling) shape
        ctx.fillStyle = '#d4a574';
        ctx.beginPath();
        ctx.ellipse(this.x + this.width / 2, this.y + this.height / 2,
                    this.width / 2, this.height / 2, 0, 0, Math.PI * 2);
        ctx.fill();

        // Add highlight for shine
        ctx.fillStyle = '#e8c4a0';
        ctx.beginPath();
        ctx.arc(this.x + 8, this.y + 5, 3, 0, Math.PI * 2);
        ctx.fill();
    }

    isCollidingWith(player) {
        return this.x < player.x + player.width &&
               this.x + this.width > player.x &&
               this.y < player.y + player.height &&
               this.y + this.height > player.y;
    }
}

class Bonus {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = GAME_CONFIG.BONUS_SIZE;
        this.height = GAME_CONFIG.BONUS_SIZE;
        this.collected = false;
        this.rotation = 0;
    }

    update() {
        this.rotation += 0.1;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.rotation);

        // Draw diamond/star shape
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.moveTo(0, -10);
        ctx.lineTo(8, -5);
        ctx.lineTo(10, 0);
        ctx.lineTo(8, 5);
        ctx.lineTo(0, 10);
        ctx.lineTo(-8, 5);
        ctx.lineTo(-10, 0);
        ctx.lineTo(-8, -5);
        ctx.closePath();
        ctx.fill();

        // Draw outline
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.restore();
    }

    isCollidingWith(player) {
        return this.x < player.x + player.width &&
               this.x + this.width > player.x &&
               this.y < player.y + player.height &&
               this.y + this.height > player.y;
    }
}

class Obstacle {
    constructor(x, y, vx = 0, vy = 0) {
        this.x = x;
        this.y = y;
        this.width = GAME_CONFIG.OBSTACLE_SIZE;
        this.height = GAME_CONFIG.OBSTACLE_SIZE;
        this.velocityX = vx;
        this.velocityY = vy;
    }

    update() {
        this.x += this.velocityX;
        this.y += this.velocityY;

        // Bounce off walls
        if (this.x < 0 || this.x + this.width > GAME_CONFIG.CANVAS_WIDTH) {
            this.velocityX *= -1;
        }
        if (this.y < 0 || this.y + this.height > GAME_CONFIG.CANVAS_HEIGHT) {
            this.velocityY *= -1;
        }

        // Keep within bounds
        this.x = Math.max(0, Math.min(this.x, GAME_CONFIG.CANVAS_WIDTH - this.width));
        this.y = Math.max(0, Math.min(this.y, GAME_CONFIG.CANVAS_HEIGHT - this.height));
    }

    draw(ctx) {
        // Draw obstacle as a dangerous block
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Draw warning symbol
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('!', this.x + this.width / 2, this.y + this.height / 2);
    }

    isCollidingWith(player) {
        return this.x < player.x + player.width &&
               this.x + this.width > player.x &&
               this.y < player.y + player.height &&
               this.y + this.height > player.y;
    }
}

class ParticleEffect {
    constructor(x, y, type = 'collect') {
        this.x = x;
        this.y = y;
        this.particles = [];
        this.type = type;
        this.createParticles();
    }

    createParticles() {
        const count = this.type === 'collect' ? 8 : 12;
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            const speed = Math.random() * 2 + 2;
            this.particles.push({
                x: this.x,
                y: this.y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 1,
                maxLife: 1,
                color: this.type === 'collect' ? '#d4a574' : '#fbbf24',
            });
        }
    }

    update() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.1; // gravity
            p.life -= 0.05;

            if (p.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }

    draw(ctx) {
        for (const p of this.particles) {
            ctx.globalAlpha = p.life / p.maxLife;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1.0;
    }

    isFinished() {
        return this.particles.length === 0;
    }
}

// ============================================
// MAIN GAME CLASS
// ============================================

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.setupCanvas();

        this.player = null;
        this.modaks = [];
        this.bonuses = [];
        this.obstacles = [];
        this.particles = [];
        this.keysPressed = {};

        this.gameLoop = null;
        this.timerInterval = null;

        this.initEventListeners();
        this.detectMobileDevice();
    }

    // Setup canvas size based on screen
    setupCanvas() {
        const container = this.canvas.parentElement;
        const maxWidth = Math.min(GAME_CONFIG.CANVAS_WIDTH, window.innerWidth - 20);
        const maxHeight = Math.min(GAME_CONFIG.CANVAS_HEIGHT, window.innerHeight - 200);

        const ratio = Math.min(maxWidth / GAME_CONFIG.CANVAS_WIDTH, maxHeight / GAME_CONFIG.CANVAS_HEIGHT);
        
        this.canvas.width = GAME_CONFIG.CANVAS_WIDTH * ratio;
        this.canvas.height = GAME_CONFIG.CANVAS_HEIGHT * ratio;
        
        // Scale context for retina displays
        this.ctx.scale(ratio, ratio);
    }

    // Detect if device is mobile
    detectMobileDevice() {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const controlsDiv = document.getElementById('mobileControls');
        
        if (isMobile || window.innerWidth < 768) {
            controlsDiv.classList.add('active');
        }
    }

    // Setup keyboard and touch event listeners
    initEventListeners() {
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        document.addEventListener('keyup', (e) => this.handleKeyUp(e));
        window.addEventListener('resize', () => this.setupCanvas());
    }

    // Handle key down events
    handleKeyDown(e) {
        if (gameState.isRunning && !gameState.isPaused) {
            const key = e.key;
            this.keysPressed[key] = true;

            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'W', 'a', 'A', 's', 'S', 'd', 'D'].includes(key)) {
                this.player.setVelocity(key, this.player.speed);
            }
        }

        // Pause with P key
        if (e.key.toLowerCase() === 'p' && gameState.isRunning) {
            this.togglePause();
        }

        // Back to menu with Escape
        if (e.key === 'Escape' && gameState.isRunning) {
            this.backToMenu();
        }
    }

    // Handle key up events
    handleKeyUp(e) {
        const key = e.key;
        delete this.keysPressed[key];

        if (gameState.isRunning && !gameState.isPaused) {
            this.player.stopVelocity(key);
        }
    }

    // Initialize new game
    startGame() {
        gameState.isRunning = true;
        gameState.isPaused = false;
        gameState.score = 0;
        gameState.modaksCollected = 0;
        gameState.lives = GAME_CONFIG.INITIAL_LIVES;
        gameState.timeLeft = GAME_CONFIG.GAME_TIME;
        gameState.level = 1;
        gameState.gameStarted = true;

        this.player = new Player(
            GAME_CONFIG.CANVAS_WIDTH / 2,
            GAME_CONFIG.CANVAS_HEIGHT - 50
        );

        this.modaks = [];
        this.bonuses = [];
        this.obstacles = [];
        this.particles = [];

        this.showScreen('gameScreen');
        this.startGameLoop();
        this.startTimer();
    }

    // Start game loop (60 FPS)
    startGameLoop() {
        if (this.gameLoop) cancelAnimationFrame(this.gameLoop);
        
        const loop = () => {
            this.update();
            this.draw();
            this.gameLoop = requestAnimationFrame(loop);
        };
        loop();
    }

    // Update game state
    update() {
        if (!gameState.isRunning || gameState.isPaused) return;

        // Update player
        this.player.update();

        // Spawn modaks randomly
        if (Math.random() < GAME_CONFIG.MODAK_SPAWN_RATE) {
            this.spawnModak();
        }

        // Spawn bonuses randomly
        if (Math.random() < GAME_CONFIG.BONUS_SPAWN_RATE) {
            this.spawnBonus();
        }

        // Spawn obstacles with difficulty scaling
        const obstacleRate = GAME_CONFIG.OBSTACLE_SPAWN_RATE * (1 + gameState.level * 0.1);
        if (Math.random() < obstacleRate && this.obstacles.length < 5 + gameState.level * 2) {
            this.spawnObstacle();
        }

        // Update modaks
        this.modaks = this.modaks.filter(modak => !modak.collected);

        // Update bonuses
        this.bonuses.forEach(bonus => bonus.update());
        this.bonuses = this.bonuses.filter(bonus => !bonus.collected);

        // Update obstacles
        this.obstacles.forEach(obstacle => obstacle.update());

        // Update particles
        this.particles.forEach(p => p.update());
        this.particles = this.particles.filter(p => !p.isFinished());

        // Check collisions with modaks
        this.modaks.forEach(modak => {
            if (modak.isCollidingWith(this.player)) {
                this.collectModak(modak);
            }
        });

        // Check collisions with bonuses
        this.bonuses.forEach(bonus => {
            if (bonus.isCollidingWith(this.player)) {
                this.collectBonus(bonus);
            }
        });

        // Check collisions with obstacles
        this.obstacles.forEach(obstacle => {
            if (obstacle.isCollidingWith(this.player) && !this.player.isInvulnerable) {
                this.hitByObstacle();
            }
        });

        // Update UI
        this.updateUI();

        // Check win condition
        if (gameState.modaksCollected >= GAME_CONFIG.TARGET_MODAKS) {
            this.winGame();
        }
    }

    // Draw game elements
    draw() {
        // Clear canvas
        this.ctx.fillStyle = 'rgba(135, 206, 235, 0.1)';
        this.ctx.fillRect(0, 0, GAME_CONFIG.CANVAS_WIDTH, GAME_CONFIG.CANVAS_HEIGHT);

        // Draw background pattern (simple rangoli-inspired)
        this.drawBackground();

        // Draw all game elements
        this.modaks.forEach(modak => modak.draw(this.ctx));
        this.bonuses.forEach(bonus => bonus.draw(this.ctx));
        this.obstacles.forEach(obstacle => obstacle.draw(this.ctx));
        this.particles.forEach(p => p.draw(this.ctx));
        this.player.draw(this.ctx);
    }

    // Draw festive background
    drawBackground() {
        // Draw decorative circles (inspired by rangoli)
        this.ctx.strokeStyle = 'rgba(245, 166, 35, 0.1)';
        this.ctx.lineWidth = 1;
        
        for (let i = 0; i < 5; i++) {
            this.ctx.beginPath();
            this.ctx.arc(GAME_CONFIG.CANVAS_WIDTH / 2, GAME_CONFIG.CANVAS_HEIGHT / 2, 
                        50 + i * 40, 0, Math.PI * 2);
            this.ctx.stroke();
        }

        // Draw decorative flowers in corners
        this.drawFlower(30, 30);
        this.drawFlower(GAME_CONFIG.CANVAS_WIDTH - 30, 30);
        this.drawFlower(30, GAME_CONFIG.CANVAS_HEIGHT - 30);
        this.drawFlower(GAME_CONFIG.CANVAS_WIDTH - 30, GAME_CONFIG.CANVAS_HEIGHT - 30);
    }

    // Draw flower decoration
    drawFlower(x, y) {
        this.ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
        const petalSize = 8;
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI * 2 * i) / 6;
            const px = x + Math.cos(angle) * 12;
            const py = y + Math.sin(angle) * 12;
            this.ctx.beginPath();
            this.ctx.arc(px, py, petalSize, 0, Math.PI * 2);
            this.ctx.fill();
        }
        this.ctx.fillStyle = 'rgba(251, 191, 36, 0.3)';
        this.ctx.beginPath();
        this.ctx.arc(x, y, 5, 0, Math.PI * 2);
        this.ctx.fill();
    }

    // Spawn modak at random location
    spawnModak() {
        const x = Math.random() * (GAME_CONFIG.CANVAS_WIDTH - GAME_CONFIG.MODAK_SIZE);
        const y = Math.random() * (GAME_CONFIG.CANVAS_HEIGHT - GAME_CONFIG.MODAK_SIZE);
        this.modaks.push(new Modak(x, y));
    }

    // Spawn bonus at random location
    spawnBonus() {
        const x = Math.random() * (GAME_CONFIG.CANVAS_WIDTH - GAME_CONFIG.BONUS_SIZE);
        const y = Math.random() * (GAME_CONFIG.CANVAS_HEIGHT - GAME_CONFIG.BONUS_SIZE);
        this.bonuses.push(new Bonus(x, y));
    }

    // Spawn obstacle with random velocity
    spawnObstacle() {
        const x = Math.random() * (GAME_CONFIG.CANVAS_WIDTH - GAME_CONFIG.OBSTACLE_SIZE);
        const y = Math.random() * (GAME_CONFIG.CANVAS_HEIGHT - GAME_CONFIG.OBSTACLE_SIZE);
        const vx = (Math.random() - 0.5) * 3;
        const vy = (Math.random() - 0.5) * 3;
        this.obstacles.push(new Obstacle(x, y, vx, vy));
    }

    // Handle modak collection
    collectModak(modak) {
        modak.collected = true;
        gameState.modaksCollected++;
        gameState.score += 10;
        this.particles.push(new ParticleEffect(modak.x, modak.y, 'collect'));
        this.playSound('collect');
    }

    // Handle bonus collection
    collectBonus(bonus) {
        bonus.collected = true;
        gameState.score += 25;
        this.particles.push(new ParticleEffect(bonus.x, bonus.y, 'bonus'));
        this.playSound('bonus');
    }

    // Handle obstacle hit
    hitByObstacle() {
        gameState.lives--;
        this.player.isInvulnerable = true;
        this.player.invulnerableTime = 120; // 2 seconds at 60 FPS
        this.particles.push(new ParticleEffect(this.player.x, this.player.y, 'hit'));
        this.playSound('hit');

        if (gameState.lives <= 0) {
            this.gameOver();
        }
    }

    // Update UI display
    updateUI() {
        document.getElementById('scoreDisplay').textContent = gameState.score;
        document.getElementById('modaksDisplay').textContent = 
            `${gameState.modaksCollected}/${GAME_CONFIG.TARGET_MODAKS}`;
        document.getElementById('livesDisplay').textContent = 
            Array(gameState.lives).fill('❤️').join('');
    }

    // Start countdown timer
    startTimer() {
        if (this.timerInterval) clearInterval(this.timerInterval);
        
        this.timerInterval = setInterval(() => {
            if (!gameState.isPaused && gameState.isRunning) {
                gameState.timeLeft--;
                document.getElementById('timerDisplay').textContent = 
                    gameState.timeLeft + 's';

                if (gameState.timeLeft <= 0) {
                    this.gameOver();
                }
            }
        }, 1000);
    }

    // Game over handler
    gameOver() {
        gameState.isRunning = false;
        clearInterval(this.timerInterval);
        cancelAnimationFrame(this.gameLoop);

        document.getElementById('finalScore').textContent = gameState.score;
        document.getElementById('finalModaks').textContent = gameState.modaksCollected;

        const performance = this.getPerformanceText();
        document.getElementById('performanceText').textContent = performance;

        this.showScreen('gameOverScreen');
        this.playSound('gameover');
    }

    // Win game handler
    winGame() {
        gameState.isRunning = false;
        clearInterval(this.timerInterval);
        cancelAnimationFrame(this.gameLoop);

        document.getElementById('winScore').textContent = gameState.score;
        document.getElementById('winTime').textContent = gameState.timeLeft;
        document.getElementById('winLives').textContent = gameState.lives;

        this.showScreen('winScreen');
        this.playSound('win');
    }

    // Get performance feedback text
    getPerformanceText() {
        if (gameState.modaksCollected >= GAME_CONFIG.TARGET_MODAKS) {
            return '🎉 Outstanding! You completed the mission!';
        } else if (gameState.modaksCollected >= 40) {
            return '👏 Excellent effort! Almost there!';
        } else if (gameState.modaksCollected >= 30) {
            return '👍 Good try! Keep practicing!';
        } else if (gameState.modaksCollected >= 20) {
            return '💪 Not bad! Try again to improve!';
        } else {
            return '🎮 Keep playing to get better!';
        }
    }

    // Toggle pause
    togglePause() {
        if (!gameState.isRunning) return;
        
        gameState.isPaused = !gameState.isPaused;
        if (gameState.isPaused) {
            this.showScreen('pauseScreen');
        } else {
            this.showScreen('gameScreen');
        }
    }

    // Save score to leaderboard
    saveScore(playerName, score, isWin = false) {
        let leaderboard = JSON.parse(localStorage.getItem('mushakLeaderboard')) || [];
        
        leaderboard.push({
            name: playerName || 'Anonymous',
            score: score,
            date: new Date().toLocaleDateString(),
            isWin: isWin,
        });

        // Keep only top 10 scores
        leaderboard.sort((a, b) => b.score - a.score);
        leaderboard = leaderboard.slice(0, 10);

        localStorage.setItem('mushakLeaderboard', JSON.stringify(leaderboard));
    }

    // Save and restart after game over
    saveAndRestart() {
        const playerName = document.getElementById('playerName').value;
        this.saveScore(playerName, gameState.score, false);
        this.startGame();
    }

    // Save and restart after win
    saveWinAndRestart() {
        const playerName = document.getElementById('winPlayerName').value;
        this.saveScore(playerName, gameState.score, true);
        this.startGame();
    }

    // Show leaderboard
    showLeaderboard() {
        const leaderboard = JSON.parse(localStorage.getItem('mushakLeaderboard')) || [];
        const listDiv = document.getElementById('leaderboardList');

        if (leaderboard.length === 0) {
            listDiv.innerHTML = '<div class="empty-leaderboard">No scores yet. Be the first to play!</div>';
        } else {
            listDiv.innerHTML = leaderboard.map((entry, index) => `
                <div class="leaderboard-entry">
                    <span class="leaderboard-rank">#${index + 1}</span>
                    <span class="leaderboard-name">${entry.name}</span>
                    <span class="leaderboard-score">${entry.score}</span>
                </div>
            `).join('');
        }

        this.showScreen('leaderboardScreen');
    }

    // Show how to play
    showHowToPlay() {
        this.showScreen('howToPlayScreen');
    }

    // Toggle mute
    toggleMute() {
        gameState.isMuted = !gameState.isMuted;
        const btn = document.getElementById('muteBtn');
        btn.textContent = gameState.isMuted ? '🔇 Unmute' : '🔊 Mute';
    }

    // Play sound (simple Web Audio API)
    playSound(type) {
        if (gameState.isMuted) return;

        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

            switch(type) {
                case 'collect':
                    oscillator.frequency.value = 800;
                    oscillator.start(audioContext.currentTime);
                    oscillator.stop(audioContext.currentTime + 0.1);
                    break;
                case 'bonus':
                    oscillator.frequency.value = 1000;
                    oscillator.start(audioContext.currentTime);
                    oscillator.stop(audioContext.currentTime + 0.15);
                    break;
                case 'hit':
                    oscillator.frequency.value = 300;
                    oscillator.start(audioContext.currentTime);
                    oscillator.stop(audioContext.currentTime + 0.2);
                    break;
                case 'gameover':
                    oscillator.frequency.value = 200;
                    oscillator.start(audioContext.currentTime);
                    oscillator.stop(audioContext.currentTime + 0.3);
                    break;
                case 'win':
                    for (let i = 0; i < 3; i++) {
                        const osc = audioContext.createOscillator();
                        const gain = audioContext.createGain();
                        osc.connect(gain);
                        gain.connect(audioContext.destination);
                        osc.frequency.value = 500 + i * 200;
                        gain.gain.setValueAtTime(0.1, audioContext.currentTime + i * 0.1);
                        gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + i * 0.1 + 0.1);
                        osc.start(audioContext.currentTime + i * 0.1);
                        osc.stop(audioContext.currentTime + i * 0.1 + 0.1);
                    }
                    break;
            }
        } catch (e) {
            // Audio context not supported, silently fail
        }
    }

    // Show screen by ID
    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
    }

    // Back to menu
    backToMenu() {
        gameState.isRunning = false;
        clearInterval(this.timerInterval);
        cancelAnimationFrame(this.gameLoop);
        this.showScreen('startScreen');
    }
}

// ============================================
// INITIALIZE GAME ON PAGE LOAD
// ============================================

const game = new Game();

// Ensure start screen is showing on load
window.addEventListener('load', () => {
    game.showScreen('startScreen');
});
