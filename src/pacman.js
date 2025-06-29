// PacMan character class

class PacMan {
    constructor(gridX, gridY, cellSize) {
        this.gridX = gridX;
        this.gridY = gridY;
        this.cellSize = cellSize;
        this.x = gridX * cellSize;
        this.y = gridY * cellSize;
        
        // Movement
        this.direction = Utils.DIRECTIONS.NONE;
        this.nextDirection = Utils.DIRECTIONS.NONE;
        this.speed = 2; // pixels per frame
        this.moveTimer = 0;
        this.moveDelay = 8; // frames between moves
        
        // Animation
        this.mouthAngle = 0;
        this.mouthSpeed = 0.3;
        this.animationTimer = 0;
        
        // State
        this.isAlive = true;
        this.invulnerable = false;
        this.invulnerabilityTimer = 0;
    }
    
    setNextDirection(direction) {
        this.nextDirection = direction;
    }
    
    update(maze) {
        if (!this.isAlive) return;
        
        // Handle invulnerability timer
        if (this.invulnerable) {
            this.invulnerabilityTimer--;
            if (this.invulnerabilityTimer <= 0) {
                this.invulnerable = false;
            }
        }
        
        // Try to change direction if requested
        if (this.nextDirection !== Utils.DIRECTIONS.NONE) {
            if (this.canMove(maze, this.nextDirection)) {
                this.direction = this.nextDirection;
                this.nextDirection = Utils.DIRECTIONS.NONE;
            }
        }
        
        // Move if possible
        this.moveTimer++;
        if (this.moveTimer >= this.moveDelay) {
            this.move(maze);
            this.moveTimer = 0;
        }
        
        // Update animation
        this.updateAnimation();
    }
    
    canMove(maze, direction) {
        const nextGridX = this.gridX + direction.x;
        const nextGridY = this.gridY + direction.y;
        
        // Handle screen wrapping
        if (nextGridX < 0 || nextGridX >= maze.width) {
            return true; // Allow wrapping
        }
        
        return maze.canMoveTo(nextGridX, nextGridY);
    }
    
    move(maze) {
        if (this.direction === Utils.DIRECTIONS.NONE || !this.canMove(maze, this.direction)) {
            return;
        }
        
        // Calculate new position
        const newGridX = this.gridX + this.direction.x;
        const newGridY = this.gridY + this.direction.y;
        
        // Handle screen wrapping (horizontal only)
        if (newGridX < 0) {
            this.gridX = maze.width - 1;
        } else if (newGridX >= maze.width) {
            this.gridX = 0;
        } else {
            this.gridX = newGridX;
        }
        
        this.gridY = newGridY;
        
        // Update pixel position
        this.x = this.gridX * this.cellSize;
        this.y = this.gridY * this.cellSize;
    }
    
    updateAnimation() {
        this.animationTimer++;
        
        if (this.direction !== Utils.DIRECTIONS.NONE) {
            // Animate mouth when moving
            this.mouthAngle += this.mouthSpeed;
            if (this.mouthAngle > Math.PI * 0.8) {
                this.mouthSpeed = -Math.abs(this.mouthSpeed);
            } else if (this.mouthAngle < 0.1) {
                this.mouthSpeed = Math.abs(this.mouthSpeed);
            }
        } else {
            // Close mouth when not moving
            this.mouthAngle = Math.max(0, this.mouthAngle - 0.1);
        }
    }
    
    reset(gridX, gridY) {
        this.gridX = gridX;
        this.gridY = gridY;
        this.x = gridX * this.cellSize;
        this.y = gridY * this.cellSize;
        this.direction = Utils.DIRECTIONS.NONE;
        this.nextDirection = Utils.DIRECTIONS.NONE;
        this.isAlive = true;
        this.invulnerable = true;
        this.invulnerabilityTimer = 120; // 2 seconds at 60fps
        this.mouthAngle = 0;
    }
    
    die() {
        this.isAlive = false;
        this.direction = Utils.DIRECTIONS.NONE;
        this.nextDirection = Utils.DIRECTIONS.NONE;
    }
    
    render(ctx) {
        const centerX = this.x + this.cellSize / 2;
        const centerY = this.y + this.cellSize / 2;
        const radius = this.cellSize * 0.4;
        
        // Calculate rotation based on direction
        let rotation = 0;
        if (this.direction === Utils.DIRECTIONS.RIGHT) rotation = 0;
        else if (this.direction === Utils.DIRECTIONS.DOWN) rotation = Math.PI / 2;
        else if (this.direction === Utils.DIRECTIONS.LEFT) rotation = Math.PI;
        else if (this.direction === Utils.DIRECTIONS.UP) rotation = -Math.PI / 2;
        
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(rotation);
        
        // Render invulnerability effect
        if (this.invulnerable && Math.floor(this.invulnerabilityTimer / 5) % 2) {
            ctx.globalAlpha = 0.5;
        }
        
        // Draw PacMan body
        ctx.fillStyle = '#ffff00';
        ctx.beginPath();
        
        if (this.mouthAngle > 0.1) {
            // Draw with mouth open
            ctx.arc(0, 0, radius, this.mouthAngle / 2, -this.mouthAngle / 2, true);
            ctx.lineTo(0, 0);
        } else {
            // Draw full circle when mouth is closed
            ctx.arc(0, 0, radius, 0, Math.PI * 2);
        }
        
        ctx.fill();
        
        // Draw outline
        ctx.strokeStyle = '#ffdd00';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw eye
        if (this.isAlive) {
            ctx.fillStyle = '#000';
            ctx.beginPath();
            ctx.arc(-radius * 0.3, -radius * 0.4, radius * 0.15, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.restore();
        
        // Debug info (optional)
        if (false) { // Set to true for debugging
            ctx.fillStyle = '#fff';
            ctx.font = '12px Arial';
            ctx.fillText(`${this.gridX},${this.gridY}`, this.x, this.y - 5);
        }
    }
    
    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.cellSize,
            height: this.cellSize
        };
    }
    
    getGridPosition() {
        return { x: this.gridX, y: this.gridY };
    }
}