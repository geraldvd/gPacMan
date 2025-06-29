// Tests for Ghost class

TestRunner
    .suite('Ghost')
    .beforeEach(() => {
        // Create a simple test maze and PacMan for testing
        window.testMaze = new Maze(20, 15);
        window.testPacMan = new PacMan(10, 10, 20);
    })
    .test('Ghost initializes correctly', () => {
        const ghost = new Ghost(5, 5, 20, '#ff0000');
        
        assert.equals(ghost.gridX, 5);
        assert.equals(ghost.gridY, 5);
        assert.equals(ghost.cellSize, 20);
        assert.equals(ghost.color, '#ff0000');
        assert.equals(ghost.originalColor, '#ff0000');
        assert.false(ghost.isVulnerable);
        assert.false(ghost.isEaten);
        assert.equals(ghost.mode, 'chase');
    })
    .test('setMode changes ghost behavior', () => {
        const ghost = new Ghost(5, 5, 20);
        
        ghost.setMode('vulnerable');
        assert.equals(ghost.mode, 'vulnerable');
        assert.true(ghost.isVulnerable);
        assert.true(ghost.vulnerableTimer > 0);
    })
    .test('makeVulnerable activates vulnerable state', () => {
        const ghost = new Ghost(5, 5, 20);
        const originalDirection = ghost.direction;
        
        ghost.makeVulnerable();
        
        assert.true(ghost.isVulnerable);
        assert.equals(ghost.mode, 'vulnerable');
        // Direction should be reversed
        assert.equals(ghost.direction, Utils.getOppositeDirection(originalDirection));
    })
    .test('eaten ghost cannot become vulnerable', () => {
        const ghost = new Ghost(5, 5, 20);
        
        ghost.setMode('eaten');
        ghost.makeVulnerable();
        
        assert.equals(ghost.mode, 'eaten');
        assert.false(ghost.isVulnerable);
        assert.true(ghost.isEaten);
    })
    .test('getScatterTarget returns valid corner position', () => {
        const ghost = new Ghost(5, 5, 20, '#ff0000');
        const target = ghost.getScatterTarget();
        
        assert.notNull(target);
        assert.true(typeof target.x === 'number');
        assert.true(typeof target.y === 'number');
        assert.true(target.x >= 0);
        assert.true(target.y >= 0);
    })
    .test('chooseDirection selects valid direction', () => {
        const ghost = new Ghost(10, 10, 20);
        ghost.targetX = 15;
        ghost.targetY = 10;
        
        const originalDirection = ghost.direction;
        ghost.chooseDirection(window.testMaze);
        
        // Direction should be set to a valid direction
        assert.notNull(ghost.direction);
        assert.true(Object.values(Utils.DIRECTIONS).includes(ghost.direction));
    })
    .test('vulnerable timer decreases during update', () => {
        const ghost = new Ghost(5, 5, 20);
        ghost.makeVulnerable();
        const initialTimer = ghost.vulnerableTimer;
        
        ghost.update(window.testMaze, window.testPacMan);
        
        assert.true(ghost.vulnerableTimer < initialTimer);
    })
    .test('vulnerable state expires after timer', () => {
        const ghost = new Ghost(5, 5, 20);
        ghost.makeVulnerable();
        ghost.vulnerableTimer = 1;
        
        ghost.update(window.testMaze, window.testPacMan);
        
        assert.false(ghost.isVulnerable);
        assert.equals(ghost.mode, 'chase');
    })
    .test('reset restores ghost to initial state', () => {
        const ghost = new Ghost(5, 5, 20);
        
        // Change state
        ghost.setMode('vulnerable');
        ghost.gridX = 10;
        ghost.gridY = 10;
        
        // Reset
        ghost.reset(7, 8);
        
        assert.equals(ghost.gridX, 7);
        assert.equals(ghost.gridY, 8);
        assert.equals(ghost.mode, 'chase');
        assert.false(ghost.isVulnerable);
        assert.false(ghost.isEaten);
    })
    .test('increaseSpeed boosts ghost speed', () => {
        const ghost = new Ghost(5, 5, 20);
        const originalSpeed = ghost.baseSpeed;
        
        ghost.increaseSpeed();
        
        assert.true(ghost.baseSpeed > originalSpeed);
        assert.equals(ghost.speed, ghost.baseSpeed);
    })
    .test('mode switching between chase and scatter', () => {
        const ghost = new Ghost(5, 5, 20);
        
        // Start in chase mode
        assert.equals(ghost.mode, 'chase');
        
        // Simulate time passing
        ghost.modeTimer = 601; // Over 600 frames
        ghost.updateAI(window.testMaze, window.testPacMan);
        
        assert.equals(ghost.mode, 'scatter');
    })
    .test('eaten ghost returns to home position', () => {
        const ghost = new Ghost(5, 5, 20);
        ghost.setMode('eaten');
        
        assert.equals(ghost.targetX, ghost.homeX);
        assert.equals(ghost.targetY, ghost.homeY);
        assert.true(ghost.speed > ghost.baseSpeed);
    });