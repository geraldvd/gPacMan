// Main entry point for gPacMan

class GameManager {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.game = null;
        this.isGameActive = false;
        
        this.init();
    }
    
    init() {
        // Show start screen
        this.showStartScreen();
        
        // Set up event listeners
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Start button
        document.getElementById('start-button').addEventListener('click', () => {
            this.startGame();
        });
        
        // Restart button
        document.getElementById('restart-button').addEventListener('click', () => {
            this.restartGame();
        });
        
        // Keyboard controls for menus
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                if (!this.isGameActive) {
                    if (!document.getElementById('game-start').classList.contains('hidden')) {
                        this.startGame();
                    } else if (!document.getElementById('game-over').classList.contains('hidden')) {
                        this.restartGame();
                    }
                }
            }
        });
        
        // Prevent context menu on right click
        this.canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
        
        // Handle window resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }
    
    showStartScreen() {
        document.getElementById('game-start').classList.remove('hidden');
        document.getElementById('game-over').classList.add('hidden');
        this.isGameActive = false;
    }
    
    hideStartScreen() {
        document.getElementById('game-start').classList.add('hidden');
    }
    
    showGameOver() {
        document.getElementById('game-over').classList.remove('hidden');
        this.isGameActive = false;
    }
    
    hideGameOver() {
        document.getElementById('game-over').classList.add('hidden');
    }
    
    startGame() {
        this.hideStartScreen();
        this.hideGameOver();
        
        // Create new game instance
        this.game = new Game(this.canvas);
        this.isGameActive = true;
        
        // Set up game over callback
        const originalGameOver = this.game.gameOver.bind(this.game);
        this.game.gameOver = () => {
            originalGameOver();
            this.showGameOver();
        };
        
        // Start the game
        this.game.start();
    }
    
    restartGame() {
        if (this.game) {
            this.game.stop();
        }
        
        this.hideGameOver();
        this.startGame();
    }
    
    handleResize() {
        // Keep canvas centered
        const container = document.getElementById('game-container');
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        
        // Calculate scale to fit screen while maintaining aspect ratio
        const canvasAspectRatio = this.canvas.width / this.canvas.height;
        const windowAspectRatio = windowWidth / windowHeight;
        
        let scale;
        if (windowAspectRatio > canvasAspectRatio) {
            // Window is wider than canvas aspect ratio
            scale = Math.min(1, (windowHeight * 0.8) / this.canvas.height);
        } else {
            // Window is taller than canvas aspect ratio
            scale = Math.min(1, (windowWidth * 0.9) / this.canvas.width);
        }
        
        // Apply scale
        container.style.transform = `scale(${scale})`;
    }
    
    // Utility method to check if game is running
    isGameRunning() {
        return this.isGameActive && this.game && this.game.isRunning;
    }
}

// Audio manager for sound effects (placeholder for future implementation)
class AudioManager {
    constructor() {
        this.sounds = {};
        this.muted = false;
        this.volume = 0.5;
    }
    
    // Placeholder methods for future audio implementation
    loadSound(name, url) {
        // TODO: Implement sound loading
    }
    
    playSound(name) {
        if (this.muted) return;
        // TODO: Implement sound playing
    }
    
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        // TODO: Update all sound volumes
    }
    
    toggleMute() {
        this.muted = !this.muted;
        return this.muted;
    }
}

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Create global game manager
    window.gameManager = new GameManager();
    window.audioManager = new AudioManager();
    
    // Handle initial resize
    window.gameManager.handleResize();
    
    console.log('gPacMan initialized successfully!');
    console.log('Controls: Arrow keys to move, Space to pause, Enter to start/restart');
});