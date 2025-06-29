// Tests for Game class

TestRunner
    .suite('Game')
    .beforeEach(() => {
        // Create a test canvas
        window.testCanvas = document.getElementById('game-canvas');
    })
    .test('Game initializes correctly', () => {
        const game = new Game(window.testCanvas);
        
        assert.notNull(game.canvas);
        assert.notNull(game.ctx);
        assert.equals(game.cellSize, 20);
        assert.equals(game.score, 0);
        assert.equals(game.lives, 3);
        assert.equals(game.level, 1);
        assert.false(game.isRunning);
        assert.false(game.isPaused);
    })
    .test('Game creates maze and characters', () => {
        const game = new Game(window.testCanvas);
        
        assert.notNull(game.maze);
        assert.notNull(game.pacman);
        assert.true(game.ghosts.length > 0);
        assert.true(game.dots.length > 0);
    })
    .test('start and stop control game state', () => {
        const game = new Game(window.testCanvas);
        
        game.start();
        assert.true(game.isRunning);
        
        game.stop();
        assert.false(game.isRunning);
    })
    .test('pause and resume control pause state', () => {
        const game = new Game(window.testCanvas);
        
        game.pause();
        assert.true(game.isPaused);
        
        game.resume();
        assert.false(game.isPaused);
        
        game.togglePause();
        assert.true(game.isPaused);
    })
    .test('restart resets game state', () => {
        const game = new Game(window.testCanvas);
        
        // Change game state
        game.score = 1000;
        game.lives = 1;
        game.level = 5;
        
        game.restart();
        
        assert.equals(game.score, 0);
        assert.equals(game.lives, 3);
        assert.equals(game.level, 1);
    })
    .test('dot collection increases score', () => {
        const game = new Game(window.testCanvas);
        const initialScore = game.score;
        const initialDotsRemaining = game.dotsRemaining;
        
        // Simulate PacMan position at a dot
        if (game.dots.length > 0) {
            const dot = game.dots[0];
            game.pacman.gridX = dot.x;
            game.pacman.gridY = dot.y;
            game.pacman.x = dot.x * game.cellSize;
            game.pacman.y = dot.y * game.cellSize;
            
            game.checkCollisions();
            
            assert.true(dot.collected);
            assert.equals(game.score, initialScore + dot.points);
            assert.equals(game.dotsRemaining, initialDotsRemaining - 1);
        }
    })
    .test('power pellet collection activates power mode', () => {
        const game = new Game(window.testCanvas);
        
        if (game.powerPellets.length > 0) {
            const pellet = game.powerPellets[0];
            game.pacman.gridX = pellet.x;
            game.pacman.gridY = pellet.y;
            game.pacman.x = pellet.x * game.cellSize;
            game.pacman.y = pellet.y * game.cellSize;
            
            game.checkCollisions();
            
            assert.true(pellet.collected);
            // Check that at least one ghost became vulnerable
            const vulnerableGhosts = game.ghosts.filter(ghost => ghost.isVulnerable);
            assert.true(vulnerableGhosts.length > 0);
        }
    })
    .test('ghost collision reduces lives', () => {
        const game = new Game(window.testCanvas);
        const initialLives = game.lives;
        
        if (game.ghosts.length > 0) {
            const ghost = game.ghosts[0];
            ghost.isVulnerable = false;
            ghost.isEaten = false;
            
            // Position ghost at PacMan's location
            ghost.gridX = game.pacman.gridX;
            ghost.gridY = game.pacman.gridY;
            ghost.x = game.pacman.x;
            ghost.y = game.pacman.y;
            
            game.checkCollisions();
            
            assert.equals(game.lives, initialLives - 1);
        }
    })
    .test('vulnerable ghost collision increases score', () => {
        const game = new Game(window.testCanvas);
        const initialScore = game.score;
        
        if (game.ghosts.length > 0) {
            const ghost = game.ghosts[0];
            ghost.isVulnerable = true;
            ghost.isEaten = false;
            
            // Position ghost at PacMan's location
            ghost.gridX = game.pacman.gridX;
            ghost.gridY = game.pacman.gridY;
            ghost.x = game.pacman.x;
            ghost.y = game.pacman.y;
            
            game.checkCollisions();
            
            assert.true(game.score > initialScore);
            assert.equals(ghost.mode, 'eaten');
        }
    })
    .test('game over when lives reach zero', () => {
        const game = new Game(window.testCanvas);
        
        game.lives = 1;
        game.pacmanDied();
        
        assert.equals(game.lives, 0);
        assert.false(game.isRunning);
    })
    .test('next level when all dots collected', () => {
        const game = new Game(window.testCanvas);
        const initialLevel = game.level;
        
        // Simulate collecting all dots
        game.dotsRemaining = 0;
        game.nextLevel();
        
        assert.equals(game.level, initialLevel + 1);
        assert.true(game.dotsRemaining > 0); // New dots should be created
    })
    .test('power pellets pulse animation updates', () => {
        const game = new Game(window.testCanvas);
        
        if (game.powerPellets.length > 0) {
            const pellet = game.powerPellets[0];
            const initialTimer = pellet.pulseTimer;
            
            game.updatePowerPellets(16); // ~16ms frame time
            
            assert.true(pellet.pulseTimer > initialTimer);
        }
    })
    .test('initializeGhosts creates correct number of ghosts', () => {
        const game = new Game(window.testCanvas);
        
        assert.true(game.ghosts.length > 0);
        assert.true(game.ghosts.length <= 4);
        
        // Each ghost should have a unique color
        const colors = game.ghosts.map(ghost => ghost.color);
        const uniqueColors = [...new Set(colors)];
        assert.equals(colors.length, uniqueColors.length);
    });