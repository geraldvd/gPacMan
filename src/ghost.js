// Ghost class for gPacMan

class Ghost {
    constructor(gridX, gridY, cellSize, color = '#ff0000') {
        this.gridX = gridX;
        this.gridY = gridY;
        this.cellSize = cellSize;
        this.x = gridX * cellSize;
        this.y = gridY * cellSize;
        this.color = color;
        this.originalColor = color;
        
        // Movement
        this.direction = Utils.randomChoice([
            Utils.DIRECTIONS.UP,
            Utils.DIRECTIONS.DOWN,
            Utils.DIRECTIONS.LEFT,
            Utils.DIRECTIONS.RIGHT
        ]);
        this.speed = 1;
        this.baseSpeed = 1;
        this.moveTimer = 0;
        this.moveDelay = 12; // frames between moves (slower than PacMan)
        
        // AI behavior
        this.mode = 'chase'; // 'chase', 'scatter', 'vulnerable', 'eaten'
        this.modeTimer = 0;
        this.targetX = gridX;
        this.targetY = gridY;
        this.scatterTarget = this.getScatterTarget();
        
        // State
        this.isVulnerable = false;
        this.vulnerableTimer = 0;
        this.vulnerableDuration = 300; // 5 seconds at 60fps
        this.isEaten = false;
        this.homeX = gridX;
        this.homeY = gridY;
        
        // Animation
        this.animationTimer = 0;
        this.eyeDirection = { x: 0, y: 0 };
    }
    
    setMode(mode) {
        if (this.mode === 'eaten' && mode !== 'chase') return;
        
        this.mode = mode;
        this.modeTimer = 0;
        
        if (mode === 'vulnerable') {
            this.isVulnerable = true;
            this.vulnerableTimer = this.vulnerableDuration;
            this.speed = Math.max(1, this.baseSpeed - 1);
        } else if (mode === 'eaten') {
            this.isEaten = true;
            this.isVulnerable = false;
            this.speed = this.baseSpeed + 2;
            this.targetX = this.homeX;
            this.targetY = this.homeY;
        } else {
            this.isVulnerable = false;
            this.isEaten = false;
            this.speed = this.baseSpeed;
        }
    }
    
    makeVulnerable() {
        if (!this.isEaten) {
            this.setMode('vulnerable');
            // Reverse direction when becoming vulnerable
            this.direction = Utils.getOppositeDirection(this.direction);
        }
    }
    
    getScatterTarget() {
        // Scatter to corners based on color
        const corners = [
            { x: 2, y: 2 },                    // top-left (red)
            { x: 37, y: 2 },                   // top-right (pink)
            { x: 2, y: 27 },                   // bottom-left (cyan)
            { x: 37, y: 27 }                   // bottom-right (orange)
        ];
        
        // Assign corner based on color
        if (this.color === '#ff0000') return corners[0]; // red
        if (this.color === '#ffb8ff') return corners[1]; // pink
        if (this.color === '#00ffff') return corners[2]; // cyan
        if (this.color === '#ffb852') return corners[3]; // orange
        
        return corners[0]; // default
    }
    
    update(maze, pacman) {
        // Update timers
        this.modeTimer++;
        this.animationTimer++;
        
        // Handle vulnerable state
        if (this.isVulnerable) {
            this.vulnerableTimer--;
            if (this.vulnerableTimer <= 0) {
                this.setMode('chase');
            }
        }
        
        // Update AI behavior
        this.updateAI(maze, pacman);
        
        // Move
        this.moveTimer++;
        if (this.moveTimer >= this.moveDelay) {
            this.move(maze);
            this.moveTimer = 0;
        }
        
        // Update eye direction for animation
        this.updateEyeDirection();
    }
    
    updateAI(maze, pacman) {
        // Switch between chase and scatter modes
        if (this.mode === 'chase' && this.modeTimer > 600) { // 10 seconds
            this.setMode('scatter');
        } else if (this.mode === 'scatter' && this.modeTimer > 300) { // 5 seconds
            this.setMode('chase');
        }
        
        // Set target based on mode
        if (this.mode === 'chase' && !this.isVulnerable) {
            this.targetX = pacman.gridX;
            this.targetY = pacman.gridY;
        } else if (this.mode === 'scatter' && !this.isVulnerable) {
            this.targetX = this.scatterTarget.x;
            this.targetY = this.scatterTarget.y;
        } else if (this.isVulnerable) {
            // Run away from PacMan
            this.targetX = this.gridX + (this.gridX - pacman.gridX);
            this.targetY = this.gridY + (this.gridY - pacman.gridY);
        } else if (this.isEaten) {
            // Return to home
            this.targetX = this.homeX;
            this.targetY = this.homeY;
            
            // Check if reached home
            if (this.gridX === this.homeX && this.gridY === this.homeY) {
                this.setMode('chase');
            }
        }
        
        // Choose direction based on target (simplified AI)
        if (Math.random() < 0.3) { // 30% chance to change direction
            this.chooseDirection(maze);
        }
    }
    
    chooseDirection(maze) {
        const possibleDirections = [];
        const currentOpposite = Utils.getOppositeDirection(this.direction);
        
        // Check all directions
        for (const [name, dir] of Object.entries(Utils.DIRECTIONS)) {
            if (dir === Utils.DIRECTIONS.NONE || dir === currentOpposite) continue;
            
            const nextX = this.gridX + dir.x;
            const nextY = this.gridY + dir.y;
            
            if (maze.canMoveTo(nextX, nextY)) {
                const distance = Math.abs(nextX - this.targetX) + Math.abs(nextY - this.targetY);
                possibleDirections.push({ direction: dir, distance: distance });
            }
        }
        
        if (possibleDirections.length === 0) return;
        
        // Sort by distance to target
        possibleDirections.sort((a, b) => a.distance - b.distance);
        
        // Choose best direction with some randomness
        let chosenDirection;
        if (this.isVulnerable) {
            // When vulnerable, prefer directions away from target
            chosenDirection = possibleDirections[possibleDirections.length - 1].direction;
        } else {
            // Normal behavior - go towards target with some randomness
            const topChoices = possibleDirections.slice(0, Math.min(2, possibleDirections.length));
            chosenDirection = Utils.randomChoice(topChoices).direction;
        }
        
        this.direction = chosenDirection;
    }
    
    move(maze) {
        const nextGridX = this.gridX + this.direction.x;
        const nextGridY = this.gridY + this.direction.y;
        
        // Handle screen wrapping
        if (nextGridX < 0) {
            this.gridX = maze.width - 1;
        } else if (nextGridX >= maze.width) {
            this.gridX = 0;
        } else if (maze.canMoveTo(nextGridX, nextGridY)) {
            this.gridX = nextGridX;
            this.gridY = nextGridY;
        } else {
            // Can't move, choose new direction
            this.chooseDirection(maze);
            return;
        }
        
        // Update pixel position
        this.x = this.gridX * this.cellSize;
        this.y = this.gridY * this.cellSize;
    }
    
    updateEyeDirection() {
        this.eyeDirection.x = this.direction.x;
        this.eyeDirection.y = this.direction.y;
    }
    
    reset(gridX, gridY) {
        this.gridX = gridX;
        this.gridY = gridY;
        this.x = gridX * this.cellSize;
        this.y = gridY * this.cellSize;
        this.direction = Utils.randomChoice([
            Utils.DIRECTIONS.UP,
            Utils.DIRECTIONS.DOWN,
            Utils.DIRECTIONS.LEFT,
            Utils.DIRECTIONS.RIGHT
        ]);
        this.setMode('chase');
    }
    
    increaseSpeed() {
        this.baseSpeed += 0.5;
        if (!this.isVulnerable && !this.isEaten) {
            this.speed = this.baseSpeed;
        }
    }
    
    render(ctx) {
        const centerX = this.x + this.cellSize / 2;
        const centerY = this.y + this.cellSize / 2;
        const radius = this.cellSize * 0.4;
        
        ctx.save();
        
        // Set ghost color based on state
        let ghostColor = this.originalColor;
        if (this.isEaten) {
            ghostColor = 'transparent';
        } else if (this.isVulnerable) {
            if (this.vulnerableTimer < 60 && Math.floor(this.vulnerableTimer / 5) % 2) {
                ghostColor = '#ffffff'; // Flash white when vulnerability is ending
            } else {
                ghostColor = '#0000ff'; // Blue when vulnerable
            }
        }
        
        if (!this.isEaten) {
            // Draw ghost body
            ctx.fillStyle = ghostColor;
            ctx.beginPath();
            
            // Top semicircle
            ctx.arc(centerX, centerY - radius * 0.2, radius, Math.PI, 0);
            
            // Body rectangle
            ctx.rect(centerX - radius, centerY - radius * 0.2, radius * 2, radius * 1.4);
            
            // Bottom wavy edge
            const waveHeight = radius * 0.3;
            const waveWidth = radius * 0.4;
            const numWaves = 3;
            
            ctx.moveTo(centerX - radius, centerY + radius * 1.2);
            for (let i = 0; i < numWaves; i++) {
                const x1 = centerX - radius + (i * 2 + 1) * waveWidth;
                const x2 = centerX - radius + (i * 2 + 2) * waveWidth;
                const y1 = centerY + radius * 1.2 - waveHeight;
                const y2 = centerY + radius * 1.2;
                
                ctx.quadraticCurveTo(x1, y1, x2, y2);
            }
            
            ctx.closePath();
            ctx.fill();
            
            // Draw outline
            ctx.strokeStyle = ghostColor === '#0000ff' ? '#ffffff' : '#333';
            ctx.lineWidth = 1;
            ctx.stroke();
        }
        
        // Draw eyes (always visible, even when eaten)
        ctx.fillStyle = '#ffffff';
        
        // Left eye
        ctx.beginPath();
        ctx.arc(centerX - radius * 0.3, centerY - radius * 0.3, radius * 0.2, 0, Math.PI * 2);
        ctx.fill();
        
        // Right eye
        ctx.beginPath();
        ctx.arc(centerX + radius * 0.3, centerY - radius * 0.3, radius * 0.2, 0, Math.PI * 2);
        ctx.fill();
        
        // Eye pupils
        ctx.fillStyle = '#000000';
        const pupilOffset = radius * 0.1;
        
        // Left pupil
        ctx.beginPath();
        ctx.arc(
            centerX - radius * 0.3 + this.eyeDirection.x * pupilOffset,
            centerY - radius * 0.3 + this.eyeDirection.y * pupilOffset,
            radius * 0.08,
            0,
            Math.PI * 2
        );
        ctx.fill();
        
        // Right pupil
        ctx.beginPath();
        ctx.arc(
            centerX + radius * 0.3 + this.eyeDirection.x * pupilOffset,
            centerY - radius * 0.3 + this.eyeDirection.y * pupilOffset,
            radius * 0.08,
            0,
            Math.PI * 2
        );
        ctx.fill();
        
        ctx.restore();
        
        // Debug info (optional)
        if (false) { // Set to true for debugging
            ctx.fillStyle = '#fff';
            ctx.font = '10px Arial';
            ctx.fillText(this.mode, this.x, this.y - 15);
            ctx.fillText(`${this.gridX},${this.gridY}`, this.x, this.y - 5);
        }
    }
}