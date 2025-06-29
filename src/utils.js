// Utility functions for gPacMan

const Utils = {
    // Direction constants
    DIRECTIONS: {
        UP: { x: 0, y: -1 },
        DOWN: { x: 0, y: 1 },
        LEFT: { x: -1, y: 0 },
        RIGHT: { x: 1, y: 0 },
        NONE: { x: 0, y: 0 }
    },

    // Check if two rectangles collide
    rectCollision(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    },

    // Check if a point is inside a rectangle
    pointInRect(point, rect) {
        return point.x >= rect.x &&
               point.x <= rect.x + rect.width &&
               point.y >= rect.y &&
               point.y <= rect.y + rect.height;
    },

    // Calculate distance between two points
    distance(p1, p2) {
        return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
    },

    // Convert grid coordinates to pixel coordinates
    gridToPixel(gridX, gridY, cellSize) {
        return {
            x: gridX * cellSize,
            y: gridY * cellSize
        };
    },

    // Convert pixel coordinates to grid coordinates
    pixelToGrid(pixelX, pixelY, cellSize) {
        return {
            x: Math.floor(pixelX / cellSize),
            y: Math.floor(pixelY / cellSize)
        };
    },

    // Clamp a value between min and max
    clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    },

    // Get opposite direction
    getOppositeDirection(direction) {
        const opposites = {
            UP: this.DIRECTIONS.DOWN,
            DOWN: this.DIRECTIONS.UP,
            LEFT: this.DIRECTIONS.RIGHT,
            RIGHT: this.DIRECTIONS.LEFT,
            NONE: this.DIRECTIONS.NONE
        };
        
        for (let key in this.DIRECTIONS) {
            if (this.DIRECTIONS[key] === direction) {
                return opposites[key];
            }
        }
        return this.DIRECTIONS.NONE;
    },

    // Generate random integer between min and max (inclusive)
    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    // Choose random element from array
    randomChoice(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
};