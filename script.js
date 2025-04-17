// Load sound effects
const shootSound = new Audio("shoot.mp3");
const zombieSound = new Audio("zombie-hit.mp3");
const gameOverSound = new Audio("game-over.mp3");

const player = document.getElementById("player");
const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");
const fireBtn = document.getElementById("fireBtn");
const scoreDisplay = document.getElementById("score");

let playerX = window.innerWidth / 2 - 25;
let score = 0;
let gameRunning = true;

player.style.left = `${playerX}px`;

function createZombie() {
  const zombie = document.createElement("div");
  zombie.classList.add("zombie");
  zombie.style.left = `${Math.random() * (window.innerWidth - 40)}px`;
  document.body.appendChild(zombie);

  let zombieY = 0;
  const interval = setInterval(() => {
    if (!gameRunning) {
      clearInterval(interval);
      zombie.remove();
      return;
    }

    zombieY += 2;
    zombie.style.top = `${zombieY}px`;

    const zombieRect = zombie.getBoundingClientRect();
    const playerRect = player.getBoundingClientRect();

    // Collision with player
    if (
      zombieRect.bottom > playerRect.top &&
      zombieRect.left < playerRect.right &&
      zombieRect.right > playerRect.left
    ) {
      gameOverSound.play(); // ☠️ Game over sound
      alert("Game Over!");
      gameRunning = false;
      location.reload();
    }
  }, 30);
}

function shootBullet() {
  shootSound.play(); // 🔫 Fire sound

  const bullet = document.createElement("div");
  bullet.classList.add("bullet");
  bullet.style.left = `${player.offsetLeft + 22}px`;
  bullet.style.top = `${player.offsetTop}px`;
  document.body.appendChild(bullet);

  let bulletY = player.offsetTop;
  const interval = setInterval(() => {
    bulletY -= 10;
    bullet.style.top = `${bulletY}px`;

    if (bulletY < 0) {
      bullet.remove();
      clearInterval(interval);
    }

    const bulletRect = bullet.getBoundingClientRect();
    const zombies = document.querySelectorAll(".zombie");

    zombies.forEach((zombie) => {
      const zRect = zombie.getBoundingClientRect();
      if (
        bulletRect.top < zRect.bottom &&
        bulletRect.bottom > zRect.top &&
        bulletRect.left < zRect.right &&
        bulletRect.right > zRect.left
      ) {
        zombieSound.play(); // 💥 Zombie hit sound
        zombie.remove();
        bullet.remove();
        clearInterval(interval);
        score++;
        scoreDisplay.textContent = `Score: ${score}`;
      }
    });
  }, 16);
}

// Movement buttons
leftBtn.addEventListener("click", () => {
  if (playerX > 0) {
    playerX -= 20;
    player.style.left = `${playerX}px`;
  }
});

rightBtn.addEventListener("click", () => {
  if (playerX < window.innerWidth - 50) {
    playerX += 20;
    player.style.left = `${playerX}px`;
  }
});

fireBtn.addEventListener("click", shootBullet);

// Create zombies repeatedly
setInterval(() => {
  if (gameRunning) createZombie();
}, 1500);
