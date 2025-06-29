# gPacMan

A JavaScript implementation of the classic PacMan game that runs directly in the browser.

## Features

- Classic PacMan gameplay with maze navigation
- Animated PacMan character with mouth movement
- Four colorful ghosts with AI behavior (chase, scatter, vulnerable modes)
- Dot collection and power pellets
- Score tracking, lives system, and level progression
- Smooth animations and visual effects
- Responsive controls (arrow keys)
- Pause functionality (spacebar)
- Complete test suite

## How to Play

1. Open `index.html` in your web browser
2. Click "Start Game" or press Enter
3. Use arrow keys to move PacMan around the maze
4. Collect all dots to advance to the next level
5. Eat power pellets to make ghosts vulnerable
6. Avoid ghosts (unless they're blue/vulnerable)
7. Press spacebar to pause/resume the game

## Controls

- **Arrow Keys**: Move PacMan (Up, Down, Left, Right)
- **Spacebar**: Pause/Resume game
- **Enter**: Start game or restart after game over

## Game Mechanics

- **Dots**: Worth 10 points each
- **Power Pellets**: Worth 50 points each, make ghosts vulnerable
- **Vulnerable Ghosts**: Worth 200 points when eaten
- **Lives**: Start with 3 lives, lose one when caught by a ghost
- **Screen Wrapping**: PacMan can wrap around screen edges horizontally

## File Structure

```
gPacMan/
├── index.html          # Main game page
├── styles.css          # Game styling
├── src/
│   ├── main.js         # Game initialization and management
│   ├── game.js         # Main game logic and loop
│   ├── pacman.js       # PacMan character class
│   ├── ghost.js        # Ghost AI and behavior
│   ├── maze.js         # Maze generation and collision detection
│   └── utils.js        # Utility functions and constants
├── tests/
│   ├── test-runner.html # Test suite runner
│   ├── test-framework.js # Simple testing framework
│   ├── utils.test.js    # Utils module tests
│   ├── maze.test.js     # Maze class tests
│   ├── pacman.test.js   # PacMan class tests
│   ├── ghost.test.js    # Ghost class tests
│   └── game.test.js     # Game logic tests
└── README.md           # This file
```

## Running Tests

1. Open `tests/test-runner.html` in your web browser
2. Click "Run All Tests" to execute the complete test suite
3. View detailed test results and coverage

The test suite includes:
- **Utils Tests**: Testing utility functions and helpers
- **Maze Tests**: Maze generation, collision detection, pathfinding
- **PacMan Tests**: Character movement, animation, state management
- **Ghost Tests**: AI behavior, mode switching, vulnerability
- **Game Tests**: Score tracking, collision detection, game flow

## Technical Details

- **Pure JavaScript**: No external dependencies
- **Canvas Rendering**: All graphics drawn programmatically
- **Object-Oriented Design**: Modular class-based architecture
- **60 FPS Game Loop**: Smooth animation using requestAnimationFrame
- **Responsive Design**: Scales to fit different screen sizes
- **Comprehensive Testing**: 40+ unit tests covering core functionality

## Browser Compatibility

Works in all modern browsers that support:
- HTML5 Canvas
- ES6 Classes
- requestAnimationFrame

## Development

To modify or extend the game:

1. Edit the source files in the `src/` directory
2. Run the test suite to ensure functionality
3. Open `index.html` to test your changes

The codebase is well-documented and follows modern JavaScript practices.

## Credits

Created as a demonstration of vanilla JavaScript game development techniques.