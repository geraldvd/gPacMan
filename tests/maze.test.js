// Tests for Maze class

TestRunner
    .suite('Maze')
    .test('Maze initializes with correct dimensions', () => {
        const maze = new Maze(40, 30);
        assert.equals(maze.width, 40);
        assert.equals(maze.height, 30);
        assert.notNull(maze.grid);
    })
    .test('Maze has valid start position', () => {
        const maze = new Maze(40, 30);
        const start = maze.getStartPosition();
        
        assert.notNull(start);
        assert.true(start.x >= 0 && start.x < maze.width);
        assert.true(start.y >= 0 && start.y < maze.height);
        assert.true(maze.canMoveTo(start.x, start.y));
    })
    .test('Maze has ghost start positions', () => {
        const maze = new Maze(40, 30);
        const ghostPositions = maze.getGhostStartPositions();
        
        assert.true(ghostPositions.length > 0);
        for (const pos of ghostPositions) {
            assert.true(pos.x >= 0 && pos.x < maze.width);
            assert.true(pos.y >= 0 && pos.y < maze.height);
        }
    })
    .test('isWall correctly identifies walls', () => {
        const maze = new Maze(40, 30);
        
        // Borders should be walls
        assert.true(maze.isWall(0, 0));
        assert.true(maze.isWall(maze.width - 1, 0));
        assert.true(maze.isWall(0, maze.height - 1));
        assert.true(maze.isWall(maze.width - 1, maze.height - 1));
    })
    .test('isValidPosition checks boundaries', () => {
        const maze = new Maze(40, 30);
        
        assert.true(maze.isValidPosition(0, 0));
        assert.true(maze.isValidPosition(maze.width - 1, maze.height - 1));
        assert.false(maze.isValidPosition(-1, 0));
        assert.false(maze.isValidPosition(0, -1));
        assert.false(maze.isValidPosition(maze.width, 0));
        assert.false(maze.isValidPosition(0, maze.height));
    })
    .test('canMoveTo allows movement to non-wall cells', () => {
        const maze = new Maze(40, 30);
        const start = maze.getStartPosition();
        
        assert.true(maze.canMoveTo(start.x, start.y));
        assert.false(maze.canMoveTo(0, 0)); // Border wall
    })
    .test('getDotPositions returns valid positions', () => {
        const maze = new Maze(40, 30);
        const dotPositions = maze.getDotPositions();
        
        assert.true(dotPositions.length > 0);
        for (const pos of dotPositions) {
            assert.true(maze.isValidPosition(pos.x, pos.y));
            assert.false(maze.isWall(pos.x, pos.y));
        }
    })
    .test('getPowerPelletPositions returns valid positions', () => {
        const maze = new Maze(40, 30);
        const pelletPositions = maze.getPowerPelletPositions();
        
        assert.true(pelletPositions.length > 0);
        for (const pos of pelletPositions) {
            assert.true(maze.isValidPosition(pos.x, pos.y));
            assert.false(maze.isWall(pos.x, pos.y));
        }
    })
    .test('maze grid is properly initialized', () => {
        const maze = new Maze(10, 10);
        
        assert.equals(maze.grid.length, 10);
        assert.equals(maze.grid[0].length, 10);
        
        // Check that all cells have valid types
        for (let y = 0; y < maze.height; y++) {
            for (let x = 0; x < maze.width; x++) {
                const cellType = maze.grid[y][x];
                assert.true(Object.values(maze.CELL_TYPES).includes(cellType));
            }
        }
    });