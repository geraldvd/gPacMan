// Tests for PacMan class

TestRunner
    .suite('PacMan')
    .beforeEach(() => {
        // Create a simple test maze
        window.testMaze = new Maze(20, 15);
    })
    .test('PacMan initializes correctly', () => {
        const pacman = new PacMan(5, 5, 20);
        
        assert.equals(pacman.gridX, 5);
        assert.equals(pacman.gridY, 5);
        assert.equals(pacman.cellSize, 20);
        assert.equals(pacman.x, 100);
        assert.equals(pacman.y, 100);
        assert.true(pacman.isAlive);
        assert.equals(pacman.direction, Utils.DIRECTIONS.NONE);
    })
    .test('setNextDirection changes next direction', () => {
        const pacman = new PacMan(5, 5, 20);
        
        pacman.setNextDirection(Utils.DIRECTIONS.UP);
        assert.equals(pacman.nextDirection, Utils.DIRECTIONS.UP);
    })
    .test('canMove checks maze boundaries and walls', () => {
        const pacman = new PacMan(1, 1, 20);
        
        // Should not be able to move into walls
        assert.false(pacman.canMove(window.testMaze, Utils.DIRECTIONS.UP));
        assert.false(pacman.canMove(window.testMaze, Utils.DIRECTIONS.LEFT));
    })
    .test('move updates position correctly', () => {
        const pacman = new PacMan(5, 5, 20);
        const originalX = pacman.gridX;
        const originalY = pacman.gridY;
        
        pacman.direction = Utils.DIRECTIONS.RIGHT;
        if (pacman.canMove(window.testMaze, pacman.direction)) {
            pacman.move(window.testMaze);
            assert.equals(pacman.gridX, originalX + 1);
            assert.equals(pacman.y, originalY * 20);
        }
    })
    .test('reset restores PacMan to initial state', () => {
        const pacman = new PacMan(5, 5, 20);
        
        // Change state
        pacman.direction = Utils.DIRECTIONS.UP;
        pacman.isAlive = false;
        
        // Reset
        pacman.reset(10, 10);
        
        assert.equals(pacman.gridX, 10);
        assert.equals(pacman.gridY, 10);
        assert.equals(pacman.direction, Utils.DIRECTIONS.NONE);
        assert.true(pacman.isAlive);
        assert.true(pacman.invulnerable);
    })
    .test('die changes PacMan state', () => {
        const pacman = new PacMan(5, 5, 20);
        
        pacman.die();
        
        assert.false(pacman.isAlive);
        assert.equals(pacman.direction, Utils.DIRECTIONS.NONE);
        assert.equals(pacman.nextDirection, Utils.DIRECTIONS.NONE);
    })
    .test('getBounds returns correct bounding box', () => {
        const pacman = new PacMan(5, 5, 20);
        const bounds = pacman.getBounds();
        
        assert.equals(bounds.x, 100);
        assert.equals(bounds.y, 100);
        assert.equals(bounds.width, 20);
        assert.equals(bounds.height, 20);
    })
    .test('getGridPosition returns correct position', () => {
        const pacman = new PacMan(7, 8, 20);
        const pos = pacman.getGridPosition();
        
        assert.equals(pos.x, 7);
        assert.equals(pos.y, 8);
    })
    .test('animation updates when moving', () => {
        const pacman = new PacMan(5, 5, 20);
        const initialMouthAngle = pacman.mouthAngle;
        
        pacman.direction = Utils.DIRECTIONS.RIGHT;
        pacman.updateAnimation();
        
        // Mouth angle should change when moving
        assert.true(pacman.mouthAngle !== initialMouthAngle || pacman.mouthSpeed !== 0);
    })
    .test('invulnerability timer decreases', () => {
        const pacman = new PacMan(5, 5, 20);
        
        pacman.invulnerable = true;
        pacman.invulnerabilityTimer = 100;
        
        pacman.update(window.testMaze);
        
        assert.true(pacman.invulnerabilityTimer < 100);
    });