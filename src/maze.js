// Maze class for gPacMan

class Maze {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.grid = [];
        this.startPosition = { x: Math.floor(width / 2), y: Math.floor(3 * height / 4) };
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
        // Create a classic PacMan-style maze layout
        // Start with all walls
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                this.grid[y][x] = this.CELL_TYPES.WALL;
            }
        }
        
        // Create the classic PacMan maze pattern
        this.createPacManLayout();
        
        // Create ghost house in center
        this.createGhostHouse();
        
        // Ensure start position is accessible
        this.grid[this.startPosition.y][this.startPosition.x] = this.CELL_TYPES.EMPTY;
        
        // Create connection paths
        this.createConnectingPaths();
    }
    
    createPacManLayout() {
        // Create main corridors and classic PacMan wall patterns
        
        // Horizontal corridors
        for (let y = 3; y < this.height - 3; y += 6) {
            for (let x = 1; x < this.width - 1; x++) {
                this.grid[y][x] = this.CELL_TYPES.EMPTY;
                if (y + 1 < this.height - 1) {
                    this.grid[y + 1][x] = this.CELL_TYPES.EMPTY;
                }
            }
        }
        
        // Vertical corridors
        for (let x = 3; x < this.width - 3; x += 8) {
            for (let y = 1; y < this.height - 1; y++) {
                this.grid[y][x] = this.CELL_TYPES.EMPTY;
                if (x + 1 < this.width - 1) {
                    this.grid[y][x + 1] = this.CELL_TYPES.EMPTY;
                }
            }
        }
        
        // Create L-shaped wall patterns (classic PacMan style)
        this.createLShapedWalls();
        
        // Create T-junction patterns
        this.createTJunctions();
        
        // Create corner blocks
        this.createCornerBlocks();
        
        // Create center area corridors
        this.createCenterCorridors();
    }
    
    createLShapedWalls() {
        const patterns = [
            // Top-left area
            {x: 2, y: 2, width: 6, height: 3},
            {x: 2, y: 2, width: 3, height: 6},
            
            // Top-right area
            {x: this.width - 8, y: 2, width: 6, height: 3},
            {x: this.width - 5, y: 2, width: 3, height: 6},
            
            // Bottom-left area
            {x: 2, y: this.height - 5, width: 6, height: 3},
            {x: 2, y: this.height - 8, width: 3, height: 6},
            
            // Bottom-right area
            {x: this.width - 8, y: this.height - 5, width: 6, height: 3},
            {x: this.width - 5, y: this.height - 8, width: 3, height: 6},
        ];
        
        for (const pattern of patterns) {
            this.createWallBlock(pattern.x, pattern.y, pattern.width, pattern.height);
        }
    }
    
    createTJunctions() {
        // Create T-shaped junction patterns throughout the maze
        const tPatterns = [
            // Top area T-junctions
            {x: Math.floor(this.width / 4), y: 6, width: 5, height: 3},
            {x: Math.floor(3 * this.width / 4) - 2, y: 6, width: 5, height: 3},
            
            // Middle area T-junctions
            {x: 6, y: Math.floor(this.height / 3), width: 3, height: 5},
            {x: this.width - 9, y: Math.floor(this.height / 3), width: 3, height: 5},
            
            // Bottom area T-junctions
            {x: Math.floor(this.width / 4), y: this.height - 9, width: 5, height: 3},
            {x: Math.floor(3 * this.width / 4) - 2, y: this.height - 9, width: 5, height: 3},
        ];
        
        for (const pattern of tPatterns) {
            this.createWallBlock(pattern.x, pattern.y, pattern.width, pattern.height);
        }
    }
    
    createCornerBlocks() {
        // Create small corner blocks for more interesting navigation
        const cornerSize = 2;
        const positions = [
            {x: 10, y: 8}, {x: this.width - 12, y: 8},
            {x: 10, y: this.height - 10}, {x: this.width - 12, y: this.height - 10},
            {x: Math.floor(this.width / 3), y: Math.floor(this.height / 4)},
            {x: Math.floor(2 * this.width / 3), y: Math.floor(this.height / 4)},
            {x: Math.floor(this.width / 3), y: Math.floor(3 * this.height / 4)},
            {x: Math.floor(2 * this.width / 3), y: Math.floor(3 * this.height / 4)},
        ];
        
        for (const pos of positions) {
            this.createWallBlock(pos.x, pos.y, cornerSize, cornerSize);
        }
    }
    
    createCenterCorridors() {
        // Create horizontal corridor through center
        const centerY = Math.floor(this.height / 2);
        for (let x = 0; x < this.width; x++) {
            this.grid[centerY][x] = this.CELL_TYPES.EMPTY;
        }
        
        // Create vertical corridors connecting to center
        const quarterX = Math.floor(this.width / 4);
        const threeQuarterX = Math.floor(3 * this.width / 4);
        
        for (let y = Math.floor(this.height / 4); y < Math.floor(3 * this.height / 4); y++) {
            this.grid[y][quarterX] = this.CELL_TYPES.EMPTY;
            this.grid[y][threeQuarterX] = this.CELL_TYPES.EMPTY;
        }
    }
    
    createWallBlock(startX, startY, width, height) {
        for (let y = startY; y < startY + height && y < this.height; y++) {
            for (let x = startX; x < startX + width && x < this.width; x++) {
                if (x >= 0 && y >= 0) {
                    this.grid[y][x] = this.CELL_TYPES.WALL;
                }
            }
        }
    }
    
    createGhostHouse() {
        // Create ghost house in center
        const centerX = Math.floor(this.width / 2);
        const centerY = Math.floor(this.height / 2);
        
        // Ghost house is a rectangular area
        for (let dy = -2; dy <= 2; dy++) {
            for (let dx = -3; dx <= 3; dx++) {
                const x = centerX + dx;
                const y = centerY + dy;
                if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
                    if (Math.abs(dy) === 2 || Math.abs(dx) === 3) {
                        // Walls around the ghost house
                        this.grid[y][x] = this.CELL_TYPES.WALL;
                    } else {
                        // Interior of ghost house
                        this.grid[y][x] = this.CELL_TYPES.GHOST_HOUSE;
                    }
                }
            }
        }
        
        // Create entrance to ghost house (top opening)
        this.grid[centerY - 2][centerX] = this.CELL_TYPES.EMPTY;
        this.grid[centerY - 2][centerX - 1] = this.CELL_TYPES.EMPTY;
        this.grid[centerY - 2][centerX + 1] = this.CELL_TYPES.EMPTY;
        
        // Ensure ghost start positions are in the house
        for (const pos of this.ghostStartPositions) {
            if (pos.x >= 0 && pos.x < this.width && pos.y >= 0 && pos.y < this.height) {
                this.grid[pos.y][pos.x] = this.CELL_TYPES.GHOST_HOUSE;
            }
        }
    }
    
    createConnectingPaths() {
        // Ensure all areas are connected by creating additional corridors
        
        // Create outer perimeter path
        for (let x = 1; x < this.width - 1; x++) {
            this.grid[1][x] = this.CELL_TYPES.EMPTY;
            this.grid[this.height - 2][x] = this.CELL_TYPES.EMPTY;
        }
        
        for (let y = 1; y < this.height - 1; y++) {
            this.grid[y][1] = this.CELL_TYPES.EMPTY;
            this.grid[y][this.width - 2] = this.CELL_TYPES.EMPTY;
        }
        
        // Add some strategic openings in wall blocks
        this.createStrategicOpenings();
    }
    
    createStrategicOpenings() {
        // Create openings in walls to ensure good gameplay flow
        const openings = [
            {x: 5, y: Math.floor(this.height / 6)},
            {x: this.width - 6, y: Math.floor(this.height / 6)},
            {x: 5, y: Math.floor(5 * this.height / 6)},
            {x: this.width - 6, y: Math.floor(5 * this.height / 6)},
            {x: Math.floor(this.width / 6), y: Math.floor(this.height / 3)},
            {x: Math.floor(5 * this.width / 6), y: Math.floor(this.height / 3)},
        ];
        
        for (const opening of openings) {
            if (this.isValidPosition(opening.x, opening.y)) {
                this.grid[opening.y][opening.x] = this.CELL_TYPES.EMPTY;
                // Create small corridors around openings
                for (let dy = -1; dy <= 1; dy++) {
                    for (let dx = -1; dx <= 1; dx++) {
                        const x = opening.x + dx;
                        const y = opening.y + dy;
                        if (this.isValidPosition(x, y) && 
                            this.grid[y][x] === this.CELL_TYPES.WALL) {
                            this.grid[y][x] = this.CELL_TYPES.EMPTY;
                        }
                    }
                }
            }
        }
    }
    
    
    placeDots() {
        // Don't place dots on every empty space - use a more sparse pattern for playability
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (this.grid[y][x] === this.CELL_TYPES.EMPTY) {
                    // Don't place dots near start position
                    const distFromStart = Math.abs(x - this.startPosition.x) + Math.abs(y - this.startPosition.y);
                    if (distFromStart > 2) {
                        // Only place dots in a sparse pattern - skip many empty spaces
                        // Place dots on main corridors and key intersections
                        const isMainCorridor = (x % 2 === 1 && y % 2 === 1) || // intersection points
                                             (x % 2 === 1 && y === 1) || // top corridor
                                             (x % 2 === 1 && y === this.height - 2) || // bottom corridor
                                             (y % 2 === 1 && x === 1) || // left corridor
                                             (y % 2 === 1 && x === this.width - 2) || // right corridor
                                             (y === Math.floor(this.height / 2)); // center horizontal corridor
                        
                        if (isMainCorridor || (x % 3 === 0 && y % 3 === 0)) {
                            this.grid[y][x] = this.CELL_TYPES.DOT;
                        }
                    }
                }
            }
        }
        
        // Place power pellets in strategic locations (find empty spaces in corners)
        this.placePowerPellets();
    }
    
    placePowerPellets() {
        // Find suitable locations for power pellets in each quadrant
        // Place them in strategic empty locations rather than converting dots
        const quadrants = [
            { startX: 1, endX: Math.floor(this.width / 2), startY: 1, endY: Math.floor(this.height / 2) }, // top-left
            { startX: Math.floor(this.width / 2), endX: this.width - 1, startY: 1, endY: Math.floor(this.height / 2) }, // top-right
            { startX: 1, endX: Math.floor(this.width / 2), startY: Math.floor(this.height / 2), endY: this.height - 1 }, // bottom-left
            { startX: Math.floor(this.width / 2), endX: this.width - 1, startY: Math.floor(this.height / 2), endY: this.height - 1 } // bottom-right
        ];
        
        for (const quadrant of quadrants) {
            let placed = false;
            
            // Try to find a good spot in the outer areas of each quadrant
            const positions = [
                // Try corners first
                { x: quadrant.startX + 1, y: quadrant.startY + 1 },
                { x: quadrant.endX - 2, y: quadrant.startY + 1 },
                { x: quadrant.startX + 1, y: quadrant.endY - 2 },
                { x: quadrant.endX - 2, y: quadrant.endY - 2 },
                // Try along edges
                { x: quadrant.startX + 3, y: quadrant.startY + 1 },
                { x: quadrant.startX + 1, y: quadrant.startY + 3 },
                { x: quadrant.endX - 4, y: quadrant.startY + 1 },
                { x: quadrant.endX - 2, y: quadrant.startY + 3 },
            ];
            
            // First try to place in empty spaces
            for (const pos of positions) {
                if (this.isValidPosition(pos.x, pos.y) && 
                    this.grid[pos.y][pos.x] === this.CELL_TYPES.EMPTY) {
                    this.grid[pos.y][pos.x] = this.CELL_TYPES.POWER_PELLET;
                    placed = true;
                    break;
                }
            }
            
            // If no empty spaces, then convert a dot
            if (!placed) {
                for (const pos of positions) {
                    if (this.isValidPosition(pos.x, pos.y) && 
                        this.grid[pos.y][pos.x] === this.CELL_TYPES.DOT) {
                        this.grid[pos.y][pos.x] = this.CELL_TYPES.POWER_PELLET;
                        placed = true;
                        break;
                    }
                }
            }
            
            // Last resort: find any suitable space in the quadrant
            if (!placed) {
                for (let y = quadrant.startY; y < quadrant.endY && !placed; y++) {
                    for (let x = quadrant.startX; x < quadrant.endX && !placed; x++) {
                        if (this.grid[y][x] === this.CELL_TYPES.EMPTY) {
                            this.grid[y][x] = this.CELL_TYPES.POWER_PELLET;
                            placed = true;
                        } else if (this.grid[y][x] === this.CELL_TYPES.DOT) {
                            this.grid[y][x] = this.CELL_TYPES.POWER_PELLET;
                            placed = true;
                        }
                    }
                }
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