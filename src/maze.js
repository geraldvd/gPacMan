// Maze class for gPacMan

class Maze {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.grid = [];
        this.startPosition = { x: 1, y: 1 };
        this.ghostStartPositions = [
            { x: Math.floor(width / 2) - 1, y: Math.floor(height / 2) },
            { x: Math.floor(width / 2), y: Math.floor(height / 2) },
            { x: Math.floor(width / 2) + 1, y: Math.floor(height / 2) },
            { x: Math.floor(width / 2), y: Math.floor(height / 2) - 1 }
        ];
        
        // Cell types
        this.CELL_TYPES = {
            WALL: 0,
            EMPTY: 1,
            DOT: 2,
            POWER_PELLET: 3,
            GHOST_HOUSE: 4
        };
        
        this.generateMaze();
    }
    
    generateMaze() {
        // Initialize grid with walls
        this.grid = Array(this.height).fill().map(() => Array(this.width).fill(this.CELL_TYPES.WALL));
        
        // Create a simple maze pattern
        this.createSimpleMaze();
        
        // Place dots and power pellets
        this.placeDots();
    }
    
    createSimpleMaze() {
        // Create outer walls and inner paths
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                // Outer walls
                if (x === 0 || x === this.width - 1 || y === 0 || y === this.height - 1) {
                    this.grid[y][x] = this.CELL_TYPES.WALL;
                }
                // Create a pattern of walls and empty spaces
                else if ((x % 4 === 0 && y % 4 === 0) && 
                        (x < this.width - 3 && y < this.height - 3)) {
                    // Create wall blocks
                    for (let dy = 0; dy < 2 && y + dy < this.height - 1; dy++) {
                        for (let dx = 0; dx < 2 && x + dx < this.width - 1; dx++) {
                            this.grid[y + dy][x + dx] = this.CELL_TYPES.WALL;
                        }
                    }
                } else {
                    this.grid[y][x] = this.CELL_TYPES.EMPTY;
                }
            }
        }
        
        // Ensure start position is empty
        this.grid[this.startPosition.y][this.startPosition.x] = this.CELL_TYPES.EMPTY;
        
        // Create ghost house area
        const centerX = Math.floor(this.width / 2);
        const centerY = Math.floor(this.height / 2);
        
        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -2; dx <= 2; dx++) {
                const x = centerX + dx;
                const y = centerY + dy;
                if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
                    this.grid[y][x] = this.CELL_TYPES.GHOST_HOUSE;
                }
            }
        }
        
        // Ensure ghost start positions are valid
        for (const pos of this.ghostStartPositions) {
            if (pos.x >= 0 && pos.x < this.width && pos.y >= 0 && pos.y < this.height) {
                this.grid[pos.y][pos.x] = this.CELL_TYPES.GHOST_HOUSE;
            }
        }
        
        // Create paths to ensure connectivity
        this.createPaths();
    }
    
    createPaths() {
        // Create horizontal paths
        for (let y = 2; y < this.height - 2; y += 6) {
            for (let x = 1; x < this.width - 1; x++) {
                if (this.grid[y][x] === this.CELL_TYPES.WALL) {
                    this.grid[y][x] = this.CELL_TYPES.EMPTY;
                }
            }
        }
        
        // Create vertical paths
        for (let x = 2; x < this.width - 2; x += 6) {
            for (let y = 1; y < this.height - 1; y++) {
                if (this.grid[y][x] === this.CELL_TYPES.WALL) {
                    this.grid[y][x] = this.CELL_TYPES.EMPTY;
                }
            }
        }
    }
    
    placeDots() {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (this.grid[y][x] === this.CELL_TYPES.EMPTY) {
                    // Don't place dots near start position
                    const distFromStart = Math.abs(x - this.startPosition.x) + Math.abs(y - this.startPosition.y);
                    if (distFromStart > 2) {
                        this.grid[y][x] = this.CELL_TYPES.DOT;
                    }
                }
            }
        }
        
        // Place power pellets in corners
        const corners = [
            { x: 2, y: 2 },
            { x: this.width - 3, y: 2 },
            { x: 2, y: this.height - 3 },
            { x: this.width - 3, y: this.height - 3 }
        ];
        
        for (const corner of corners) {
            if (this.isValidPosition(corner.x, corner.y) && 
                this.grid[corner.y][corner.x] !== this.CELL_TYPES.WALL) {
                this.grid[corner.y][corner.x] = this.CELL_TYPES.POWER_PELLET;
            }
        }
    }
    
    isWall(x, y) {
        if (!this.isValidPosition(x, y)) return true;
        return this.grid[y][x] === this.CELL_TYPES.WALL;
    }
    
    isValidPosition(x, y) {
        return x >= 0 && x < this.width && y >= 0 && y < this.height;
    }
    
    canMoveTo(x, y) {
        if (!this.isValidPosition(x, y)) return false;
        return this.grid[y][x] !== this.CELL_TYPES.WALL;
    }
    
    getStartPosition() {
        return { ...this.startPosition };
    }
    
    getGhostStartPositions() {
        return this.ghostStartPositions.map(pos => ({ ...pos }));
    }
    
    getDotPositions() {
        const positions = [];
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (this.grid[y][x] === this.CELL_TYPES.DOT) {
                    positions.push({ x, y });
                }
            }
        }
        return positions;
    }
    
    getPowerPelletPositions() {
        const positions = [];
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (this.grid[y][x] === this.CELL_TYPES.POWER_PELLET) {
                    positions.push({ x, y });
                }
            }
        }
        return positions;
    }
    
    render(ctx, cellSize) {
        ctx.strokeStyle = '#0000ff';
        ctx.lineWidth = 2;
        
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const pixelX = x * cellSize;
                const pixelY = y * cellSize;
                
                if (this.grid[y][x] === this.CELL_TYPES.WALL) {
                    // Draw wall
                    ctx.fillStyle = '#0000ff';
                    ctx.fillRect(pixelX, pixelY, cellSize, cellSize);
                    
                    // Add wall borders for better visibility
                    ctx.strokeStyle = '#4444ff';
                    ctx.strokeRect(pixelX, pixelY, cellSize, cellSize);
                } else if (this.grid[y][x] === this.CELL_TYPES.GHOST_HOUSE) {
                    // Draw ghost house
                    ctx.fillStyle = '#333333';
                    ctx.fillRect(pixelX, pixelY, cellSize, cellSize);
                    ctx.strokeStyle = '#666666';
                    ctx.strokeRect(pixelX, pixelY, cellSize, cellSize);
                }
            }
        }
    }
}