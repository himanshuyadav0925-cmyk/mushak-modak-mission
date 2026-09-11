# 🐭 Mushak: Modak Mission 🐭

A festive browser-based 2D action game developed for the **Ganesh Chaturthi Game Design Contest**.

## 🎮 Game Concept

Help **Mushak**, Lord Ganesha's loyal mouse companion, collect as many delicious **modaks** (traditional sweet dumplings) as possible while avoiding dangerous obstacles! Complete the level by collecting 50 modaks before time runs out.

This game celebrates the festive spirit of Ganesh Chaturthi with a fun, challenging gameplay experience suitable for all ages.

## ✨ Features

- **Player Control**: Smooth movement with keyboard (Arrow Keys/WASD) or mobile touch controls
- **Collectibles**: 
  - 🍪 Normal Modaks (+10 points each)
  - 💎 Bonus items (+25 points each)
- **Obstacles**: Avoid moving red blocks that reduce your lives
- **Lives System**: Start with 3 lives, lose one when hit by an obstacle
- **Timer**: Complete the level within 120 seconds
- **Score System**: Earn points for collecting modaks and bonuses
- **Particle Effects**: Visual feedback when collecting items
- **Sound Effects**: Simple Web Audio API generated sounds (with mute option)
- **Mobile Support**: Fully responsive design with on-screen controls
- **Local Leaderboard**: Save your scores using browser localStorage
- **Festive Theme**: Beautiful Ganesh Chaturthi inspired visuals

## 🎯 How to Play

### Objective
Collect **50 modaks** to complete the level before time runs out!

### Desktop Controls
- **Arrow Keys** - Move up, down, left, right
- **WASD** - Alternative movement keys
- **P** - Pause/Resume game
- **Esc** - Return to main menu

### Mobile Controls
- Use **on-screen arrow buttons** to move
- Tap and hold buttons for continuous movement

### Gameplay Rules
1. Collect modaks scattered across the game area
2. Grab bonus items for extra points when they appear
3. Avoid obstacles (red blocks with warning symbols)
4. You have 3 lives - lose them all and it's game over
5. Beat the 120-second timer to win
6. Collect all 50 modaks to complete the level

### Scoring
- **Modak** = +10 points
- **Bonus Item** = +25 points
- **Obstacles** = -1 life (no point penalty)

## 🛠️ Technologies Used

- **HTML5** - Game structure and UI
- **CSS3** - Styling and responsive design
- **Vanilla JavaScript** - Game logic and mechanics
- **Canvas API** - Game rendering
- **Web Audio API** - Sound effects
- **localStorage** - Leaderboard persistence

**No frameworks or libraries used** - Pure vanilla web technologies for educational clarity.

## 📁 Project Structure

```
mushak-modak-mission/
├── index.html          # Main HTML file with all game screens
├── style.css           # Complete styling and responsive design
├── script.js           # Game logic and mechanics
└── README.md           # This file
```

### File Descriptions

**index.html**
- Contains HTML structure for all game screens
- Start screen, how to play, game screen, game over, win, pause, and leaderboard screens
- Mobile control buttons for touch devices
- Canvas element for game rendering

**style.css**
- Festive Ganesh Chaturthi themed styling
- Responsive design for desktop and mobile
- Animations for UI elements
- Game header and canvas styling
- Mobile control buttons styling
- Accessibility features (focus states, high contrast mode support)

**script.js**
- Main game logic with ~1000 lines of well-commented code
- Player class for character movement and rendering
- Modak class for collectible items
- Bonus class for bonus items with rotation animation
- Obstacle class for hazards with collision detection
- ParticleEffect class for visual feedback
- Game class handling all game mechanics
- Event listeners for keyboard and touch input
- Local leaderboard management
- Web Audio API sound effects

## 🚀 How to Run Locally

### Option 1: Clone from GitHub
```bash
git clone https://github.com/himanshuyadav0925-cmyk/mushak-modak-mission.git
cd mushak-modak-mission
```

### Option 2: Direct File Access
Download all files and keep them in the same folder.

### Running the Game
1. Open `index.html` in a modern web browser (Chrome, Firefox, Safari, Edge)
2. The game will automatically detect if you're on mobile or desktop
3. Click "Play Game" to start!

**No server or build tools required** - just open the HTML file!

## 🎓 Code Structure Explanation

### Main Game Flow

1. **Initialization** (`Game` class constructor)
   - Creates canvas element
   - Sets up event listeners for keyboard and touch
   - Detects mobile vs desktop

2. **Game Start** (`startGame()` method)
   - Initializes player at center-bottom
   - Resets score, lives, timer
   - Starts game loop and timer

3. **Game Loop** (`startGameLoop()` method)
   - Runs 60 times per second
   - Calls `update()` then `draw()` each frame

4. **Update Logic** (`update()` method)
   - Spawns modaks, bonuses, and obstacles randomly
   - Updates all game objects positions
   - Checks collisions between player and items
   - Checks collision with obstacles
   - Updates UI display

5. **Rendering** (`draw()` method)
   - Clears canvas
   - Draws background (festive patterns)
   - Draws all game objects
   - Uses canvas 2D context for efficient rendering

### Key Classes

**Player**
- Tracks position and velocity
- Handles movement based on key input
- Draws mouse character with ears, eyes, tail
- Manages invulnerability timer after being hit

**Modak**
- Collectible sweet item
- Static position
- Collision detection with player

**Bonus**
- Rotating star item worth more points
- Animated with rotation effect
- Rare spawning

**Obstacle**
- Dangerous red block
- Moves around canvas bouncing off walls
- Causes damage on collision

**ParticleEffect**
- Visual feedback when collecting items
- Creates 8-12 particles per effect
- Applies gravity and fade out animation

### Game Mechanics

**Collision Detection**
- Rectangle-based AABB (Axis-Aligned Bounding Box) collision
- Checks all obstacles every frame
- Modaks and bonuses removed on collection

**Spawning System**
- Random probability-based spawning
- Difficulty increases with level
- Maximum obstacle count scales with progress

**Invulnerability**
- Player becomes invulnerable for 2 seconds after hit
- Visual flashing effect during invulnerability
- Prevents rapid health loss

**Sound System**
- Web Audio API for dynamic sound generation
- No external audio files
- Mutable for accessibility

**Leaderboard**
- Stores top 10 scores in browser localStorage
- Persists between sessions
- Simple JSON storage

## 📱 Mobile Support

The game automatically detects mobile devices and:
- Hides keyboard controls
- Shows on-screen arrow buttons
- Adjusts canvas size for screen dimensions
- Uses touch events for button interaction
- Maintains full functionality on tablets and phones

## ♿ Accessibility Features

- Clear readable fonts with sufficient contrast
- High contrast mode support via CSS media queries
- Reduced motion support for animations
- Button focus states for keyboard navigation
- Large touch targets for mobile (45x45px minimum)
- Semantic HTML structure
- Descriptive button labels

## 🎨 Visual Design

The game features a festive Ganesh Chaturthi theme with:
- **Warm colors**: Orange and yellow gradients representing diyas and festive lights
- **Rangoli patterns**: Decorative circles in the background
- **Flower elements**: Stylized flowers in corners
- **Character design**: Simple cute mouse character (Mushak)
- **Item design**: Traditional modak shape and bonus star
- **Obstacle design**: Red warning blocks with symbols

## 🔊 Sound Effects

Generated using Web Audio API:
- **Collect sound**: High-pitched beep when collecting modak
- **Bonus sound**: Higher-pitched beep for bonus items
- **Hit sound**: Low-pitched sound when hit by obstacle
- **Game Over sound**: Descending tone
- **Win sound**: Three ascending tones for celebration

## 💾 Data Persistence

### Leaderboard Storage
Scores are saved in browser's `localStorage` under key: `mushakLeaderboard`

**Format:**
```javascript
[
  {
    "name": "Player Name",
    "score": 1250,
    "date": "9/11/2026",
    "isWin": true
  }
]
```

**To clear leaderboard:**
Open browser console and run: `localStorage.removeItem('mushakLeaderboard')`

## 🐛 Browser Compatibility

- Chrome/Chromium (recommended)
- Firefox
- Safari
- Edge
- Opera

Requires HTML5 Canvas and ES6 JavaScript support.

## 🎓 Educational Notes for Students

This project is designed to be beginner-friendly and easy to understand:

### Easy to Modify:
- Change `GAME_CONFIG` to adjust difficulty
- Add new item types by creating new classes
- Modify colors in CSS for different themes
- Adjust canvas size for different resolutions

### Learning Outcomes:
- Canvas rendering and animation
- Game loop architecture
- Collision detection algorithms
- Event handling (keyboard and touch)
- Object-oriented programming with classes
- State management
- Web Audio API basics
- Responsive web design
- localStorage API usage

### Code Quality:
- Well-commented throughout
- Clear variable and function names
- Organized into logical sections
- No external dependencies
- Follows ES6 standards

## 🙏 Credits

**Developer**: Student Project for Ganesh Chaturthi Game Design Contest
**Theme**: Ganesh Chaturthi - A Hindu festival celebrating Lord Ganesha
**Character**: Mushak (Ganesha's mouse companion)
**Assets**: Original artwork using HTML5 Canvas

**Inspiration**: 
- Ganesh Chaturthi traditions and celebrations
- Classic arcade game mechanics
- Educational game design principles

## 📋 Contest Compliance

✅ Original game implementation from scratch
✅ Uses only HTML, CSS, and vanilla JavaScript
✅ No frameworks or build tools required
✅ Runs directly in modern browsers
✅ Beginner-friendly code with explanations
✅ Fully functional and playable
✅ Mobile and desktop support
✅ Respectful of religious themes
✅ All game features implemented
✅ Local leaderboard included

## 🎮 Game Features Checklist

- ✅ Start screen with title and description
- ✅ How to play instructions
- ✅ Playable main game with player movement
- ✅ Modak collection mechanic
- ✅ Obstacle avoidance
- ✅ Scoring system
- ✅ Lives/health system
- ✅ Timer and time management
- ✅ Level completion detection
- ✅ Game over screen
- ✅ Win screen with celebration
- ✅ Pause functionality
- ✅ Mobile touch controls
- ✅ Keyboard controls
- ✅ Particle effects
- ✅ Sound effects (Web Audio API)
- ✅ Mute button
- ✅ Local leaderboard
- ✅ Responsive design
- ✅ Accessibility features

## 📞 Support

For issues or questions:
1. Check browser console for errors (F12)
2. Ensure JavaScript is enabled
3. Try clearing browser cache
4. Test in a different browser
5. Check that all files (HTML, CSS, JS) are in the same folder

## 📄 License

This project is created as an educational student project for the Ganesh Chaturthi Game Design Contest. Feel free to use, modify, and learn from the code.

---

**Made with ❤️ for Ganesh Chaturthi 2024**

*Ganpati Bappa Morya!* 🙏
