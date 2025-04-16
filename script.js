const gameArea = document.getElementById('gameArea');
const player = document.getElementById('player');
const gameOverScreen = document.getElementById('gameOver');
const scoreEl = document.createElement('div');
scoreEl.style.position = 'absolute';
scoreEl.style.top = '10px';
scoreEl.style.left = '10px';
scoreEl.style.fontSize = '20px';
scoreEl.style.color = 'white';
gameArea.appendChild(scoreEl);

let playerX = window.innerWidth / 2;
let bullets = [];
let zombies = [];
let score = 0;
let gameRunning = true;

// Sound effects
const shootSound = new Audio('shoot.mp3');  // Make sure you have shoot.mp3 file
const zombieHitSound = new Audio('zombie-hit.mp3');  // Make sure you have zombie-hit.mp3 file
const gameOverSound = new Audio('game-over.mp3');  // Make sure you have game-over.mp3 file

// Player controls
document.addEventListener('keydown', (e) => {
  if (!gameRunning) return;

  if (e.key === 'ArrowLeft' && playerX > 0) {
    playerX -= 30;  // Increase movement speed
  }
  if (e.key === 'ArrowRight' && playerX < window.innerWidth - 50) {
    playerX += 30;  // Increase movement speed
  }
  if (e.key === ' ') {
    shootBullet();
  }
  player.style.left = `${playerX}px`;
});

// Shoot bullet and play sound
function shootBullet() {
  const bullet = document.createElement('div');
  bullet.className = 'bullet';
  bullet.style.left = `${playerX + 22}px`;
  bullet.style.bottom = `70px`;
  gameArea.appendChild(bullet);
  bullets.push(bullet);

  shootSound.play();  // Play shoot sound
}

// Spawn zombies at random X (adjust spawn rate)
function spawnZombie() {
  if (!gameRunning) return;

  const zombie = document.createElement('div');
  zombie.className = 'zombie';
  zombie.style.left = `${Math.random() * (window.innerWidth - 50)}px`;
  gameArea.appendChild(zombie);
  zombies.push(zombie);
}

// Update the game (move bullets, zombies)
function updateGame() {
  if (!gameRunning) return;

  // Move bullets
  bullets.forEach((bullet, i) => {
    bullet.style.bottom = `${parseInt(bullet.style.bottom) + 10}px`;
    if (parseInt(bullet.style.bottom) > window.innerHeight) {
      bullet.remove();
      bullets.splice(i, 1);
    }
  });

  // Move zombies
  zombies.forEach((zombie, i) => {
    const top = parseInt(zombie.style.top || 0) + 2;
    zombie.style.top = `${top}px`;

    // Game Over condition
    if (top > window.innerHeight - 100) {
      endGame();
    }

    // Collision detection
    bullets.forEach((bullet, j) => {
      const bX = bullet.offsetLeft;
      const bY = window.innerHeight - parseInt(bullet.style.bottom);
      const zX = zombie.offsetLeft;
      const zY = zombie.offsetTop;

      if (
        bX > zX && bX < zX + 50 &&
        bY > zY && bY < zY + 50
      ) {
        zombie.remove();
        bullet.remove();
        zombies.splice(i, 1);
        bullets.splice(j, 1);
        
        score += 10;  // Increase score on zombie kill
        scoreEl.innerText = `Score: ${score}`;  // Update score display

        zombieHitSound.play();  // Play sound when zombie is hit
      }
    });
  });

  requestAnimationFrame(updateGame);
}

// End game and play game over sound
function endGame() {
  gameRunning = false;
  gameOverScreen.style.display = 'block';
  gameOverSound.play();  // Play game over sound
}

// Restart game
function restartGame() {
  location.reload();
}

// Start game loop and zombie spawner (slow down spawn rate)
setInterval(spawnZombie, 3000); // Spawn zombies every 2 sec (adjusted)
updateGame(); // Start animation loop
// Touch Button Controls for Mobile
const leftBtn = document.getElementById('leftBtn');
const rightBtn = document.getElementById('rightBtn');
const fireBtn = document.getElementById('fireBtn');

// Move Left
leftBtn.addEventListener('touchstart', () => {
  if (playerX > 0 && gameRunning) {
    playerX -= 30;
    player.style.left = `${playerX}px`;
  }
});

// Move Right
rightBtn.addEventListener('touchstart', () => {
  if (playerX < window.innerWidth - 50 && gameRunning) {
    playerX += 30;
    player.style.left = `${playerX}px`;
  }
});

// Fire Bullet
fireBtn.addEventListener('touchstart', () => {
  if (gameRunning) {
    shootBullet();
  }
});
