// Main game class for gPacMan

class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.cellSize = 20;
        this.width = canvas.width;
        this.height = canvas.height;
        this.gridWidth = Math.floor(this.width / this.cellSize);
        this.gridHeight = Math.floor(this.height / this.cellSize);
        
        // Game state
        this.isRunning = false;
        this.isPaused = false;
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.dotsRemaining = 0;
        
        // Game objects
        this.maze = null;
        this.pacman = null;
        this.ghosts = [];
        this.dots = [];
        this.powerPellets = [];
        
        // Timing
        this.lastTime = 0;
        this.gameSpeed = 1000 / 60; // 60 FPS
        this.animationTimer = 0;
        
        // Initialize game
        this.init();
    }
    
    init() {
        // Initialize maze
        this.maze = new Maze(this.gridWidth, this.gridHeight);
        
        // Initialize PacMan
        const startPos = this.maze.getStartPosition();
        this.pacman = new PacMan(startPos.x, startPos.y, this.cellSize);
        
        // Initialize ghosts
        this.initializeGhosts();
        
        // Initialize dots and power pellets
        this.initializeDots();
        
        // Set up event listeners
        this.setupEventListeners();
    }
    
    initializeGhosts() {
        const ghostPositions = this.maze.getGhostStartPositions();
        const colors = ['#ff0000', '#ffb8ff', '#00ffff', '#ffb852'];
        
        this.ghosts = [];
        for (let i = 0; i < Math.min(4, ghostPositions.length); i++) {
            const pos = ghostPositions[i];
            this.ghosts.push(new Ghost(pos.x, pos.y, this.cellSize, colors[i]));
        }
    }
    
    initializeDots() {
        this.dots = [];
        this.powerPellets = [];
        
        const dotPositions = this.maze.getDotPositions();
        const powerPelletPositions = this.maze.getPowerPelletPositions();
        
        // Create regular dots
        for (const pos of dotPositions) {
            this.dots.push({
                x: pos.x,
                y: pos.y,
                collected: false,
                points: 10
            });
        }
        
        // Create power pellets
        for (const pos of powerPelletPositions) {
            this.powerPellets.push({
                x: pos.x,
                y: pos.y,
                collected: false,
                points: 50,
                pulseTimer: 0
            });
        }
        
        this.dotsRemaining = this.dots.length + this.powerPellets.length;
        
        // Debug: Log initial counts
        console.log(`Level ${this.level} initialized:`);
        console.log(`- Regular dots: ${this.dots.length}`);
        console.log(`- Power pellets: ${this.powerPellets.length}`);
        console.log(`- Total dots remaining: ${this.dotsRemaining}`);
    }
    
    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (!this.isRunning) return;
            
            switch(e.key) {
                case 'ArrowUp':
                    this.pacman.setNextDirection(Utils.DIRECTIONS.UP);
                    e.preventDefault();
                    break;
                case 'ArrowDown':
                    this.pacman.setNextDirection(Utils.DIRECTIONS.DOWN);
                    e.preventDefault();
                    break;
                case 'ArrowLeft':
                    this.pacman.setNextDirection(Utils.DIRECTIONS.LEFT);
                    e.preventDefault();
                    break;
                case 'ArrowRight':
                    this.pacman.setNextDirection(Utils.DIRECTIONS.RIGHT);
                    e.preventDefault();
                    break;
                case ' ':
                    this.togglePause();
                    e.preventDefault();
                    break;
            }
        });
    }
    
    start() {
        this.isRunning = true;
        this.lastTime = performance.now();
        this.gameLoop();
    }
    
    stop() {
        this.isRunning = false;
    }
    
    pause() {
        this.isPaused = true;
    }
    
    resume() {
        this.isPaused = false;
    }
    
    togglePause() {
        this.isPaused = !this.isPaused;
    }
    
    restart() {
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.init();
        this.updateUI();
    }
    
    gameLoop(currentTime = 0) {
        if (!this.isRunning) return;
        
        const deltaTime = currentTime - this.lastTime;
        
        if (deltaTime >= this.gameSpeed && !this.isPaused) {
            this.update(deltaTime);
            this.render();
            this.lastTime = currentTime;
        }
        
        requestAnimationFrame((time) => this.gameLoop(time));
    }
    
    update(deltaTime) {
        this.animationTimer++;
        
        // Update PacMan
        this.pacman.update(this.maze);
        
        // Update ghosts
        for (const ghost of this.ghosts) {
            ghost.update(this.maze, this.pacman);
        }
        
        // Check collisions
        this.checkCollisions();
        
        // Update power pellet animation
        this.updatePowerPellets(deltaTime);
        
        // Check win condition
        if (this.dotsRemaining <= 0) {
            this.nextLevel();
        }
        
        // Debug: Log dots remaining occasionally
        if (this.animationTimer % 300 === 0) { // Every 5 seconds at 60fps
            console.log(`Dots remaining: ${this.dotsRemaining}`);
        }
    }
    
    checkCollisions() {
        const pacmanGrid = Utils.pixelToGrid(this.pacman.x, this.pacman.y, this.cellSize);
        
        // Check dot collection
        for (let i = 0; i < this.dots.length; i++) {
            const dot = this.dots[i];
            if (!dot.collected && dot.x === pacmanGrid.x && dot.y === pacmanGrid.y) {
                dot.collected = true;
                this.score += dot.points;
                this.dotsRemaining--;
                console.log(`Dot collected! ${this.dotsRemaining} remaining`);
                this.updateUI();
            }
        }
        
        // Check power pellet collection
        for (let i = 0; i < this.powerPellets.length; i++) {
            const pellet = this.powerPellets[i];
            if (!pellet.collected && pellet.x === pacmanGrid.x && pellet.y === pacmanGrid.y) {
                pellet.collected = true;
                this.score += pellet.points;
                this.dotsRemaining--;
                console.log(`Power pellet collected! ${this.dotsRemaining} remaining`);
                this.activatePowerMode();
                this.updateUI();
            }
        }
        
        // Check ghost collisions - use distance-based detection for better accuracy
        for (const ghost of this.ghosts) {
            const distance = Utils.distance(
                { x: this.pacman.x + this.cellSize / 2, y: this.pacman.y + this.cellSize / 2 },
                { x: ghost.x + this.cellSize / 2, y: ghost.y + this.cellSize / 2 }
            );
            
            // If they're close enough (within 70% of cell size), consider it a collision
            if (distance < this.cellSize * 0.7) {
                if (ghost.isVulnerable && !ghost.isEaten) {
                    ghost.setMode('eaten');
                    this.score += 200;
                    this.updateUI();
                } else if (!ghost.isEaten && !ghost.isVulnerable) {
                    this.pacmanDied();
                    return; // Don't check other collisions after death
                }
            }
        }
    }
    
    updatePowerPellets(deltaTime) {
        for (const pellet of this.powerPellets) {
            if (!pellet.collected) {
                pellet.pulseTimer += deltaTime;
            }
        }
    }
    
    activatePowerMode() {
        for (const ghost of this.ghosts) {
            if (!ghost.isEaten) {
                ghost.makeVulnerable();
            }
        }
    }
    
    pacmanDied() {
        this.lives--;
        this.updateUI();
        
        if (this.lives <= 0) {
            this.gameOver();
        } else {
            // Reset positions
            const startPos = this.maze.getStartPosition();
            this.pacman.reset(startPos.x, startPos.y);
            
            const ghostPositions = this.maze.getGhostStartPositions();
            for (let i = 0; i < this.ghosts.length; i++) {
                if (i < ghostPositions.length) {
                    this.ghosts[i].reset(ghostPositions[i].x, ghostPositions[i].y);
                }
            }
        }
    }
    
    gameOver() {
        this.stop();
        
        // Only update UI if DOM elements exist (not in test environment)
        const finalScoreElement = document.getElementById('final-score');
        const gameOverElement = document.getElementById('game-over');
        
        if (finalScoreElement) finalScoreElement.textContent = this.score;
        if (gameOverElement) gameOverElement.classList.remove('hidden');
    }
    
    nextLevel() {
        this.level++;
        this.initializeDots();
        
        // Reset positions
        const startPos = this.maze.getStartPosition();
        this.pacman.reset(startPos.x, startPos.y);
        
        const ghostPositions = this.maze.getGhostStartPositions();
        for (let i = 0; i < this.ghosts.length; i++) {
            if (i < ghostPositions.length) {
                this.ghosts[i].reset(ghostPositions[i].x, ghostPositions[i].y);
                this.ghosts[i].increaseSpeed();
            }
        }
        
        this.updateUI();
    }
    
    updateUI() {
        // Only update UI if DOM elements exist (not in test environment)
        const scoreElement = document.getElementById('score-value');
        const livesElement = document.getElementById('lives-value');
        const levelElement = document.getElementById('level-value');
        const dotsElement = document.getElementById('dots-value');
        
        if (scoreElement) scoreElement.textContent = this.score;
        if (livesElement) livesElement.textContent = this.lives;
        if (levelElement) levelElement.textContent = this.level;
        if (dotsElement) dotsElement.textContent = this.dotsRemaining;
    }
    
    render() {
        // Clear canvas
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // Render maze
        this.maze.render(this.ctx, this.cellSize);
        
        // Render dots
        this.renderDots();
        
        // Render power pellets
        this.renderPowerPellets();
        
        // Render PacMan
        this.pacman.render(this.ctx);
        
        // Render ghosts
        for (const ghost of this.ghosts) {
            ghost.render(this.ctx);
        }
        
        // Render pause overlay
        if (this.isPaused) {
            this.renderPauseOverlay();
        }
    }
    
    renderDots() {
        this.ctx.fillStyle = '#ffff00';
        for (const dot of this.dots) {
            if (!dot.collected) {
                const pixel = Utils.gridToPixel(dot.x, dot.y, this.cellSize);
                this.ctx.beginPath();
                this.ctx.arc(
                    pixel.x + this.cellSize / 2,
                    pixel.y + this.cellSize / 2,
                    2,
                    0,
                    Math.PI * 2
                );
                this.ctx.fill();
            }
        }
    }
    
    renderPowerPellets() {
        for (const pellet of this.powerPellets) {
            if (!pellet.collected) {
                const pixel = Utils.gridToPixel(pellet.x, pellet.y, this.cellSize);
                const pulse = Math.sin(pellet.pulseTimer * 0.01) * 0.3 + 0.7;
                this.ctx.fillStyle = `rgba(255, 255, 0, ${pulse})`;
                this.ctx.beginPath();
                this.ctx.arc(
                    pixel.x + this.cellSize / 2,
                    pixel.y + this.cellSize / 2,
                    6,
                    0,
                    Math.PI * 2
                );
                this.ctx.fill();
            }
        }
    }
    
    renderPauseOverlay() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('PAUSED', this.width / 2, this.height / 2);
        
        this.ctx.font = '24px Arial';
        this.ctx.fillText('Press SPACE to resume', this.width / 2, this.height / 2 + 50);
    }
}