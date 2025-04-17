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

    if (
      zombieRect.bottom >= playerRect.top &&
      zombieRect.left < playerRect.right &&
      zombieRect.right > playerRect.left
    ) {
      gameRunning = false;
      alert("Game Over! Score: " + score);
      location.reload();
    }
  }, 16);
}

function shootBullet() {
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
        zombie.remove();
        bullet.remove();
        clearInterval(interval);
        score++;
        scoreDisplay.textContent = `Score: ${score}`;
      }
    });
  }, 16);
}

// Button event handlers with touch and click
function handleMoveLeft(e) {
  e.preventDefault();
  if (playerX > 0 && gameRunning) {
    playerX -= 30;
    player.style.left = `${playerX}px`;
  }
}

function handleMoveRight(e) {
  e.preventDefault();
  if (playerX < window.innerWidth - 50 && gameRunning) {
    playerX += 30;
    player.style.left = `${playerX}px`;
  }
}

function handleFire(e) {
  e.preventDefault();
  if (gameRunning) {
    shootBullet();
  }
}

leftBtn.addEventListener("click", handleMoveLeft);
leftBtn.addEventListener("touchstart", handleMoveLeft, { passive: false });

rightBtn.addEventListener("click", handleMoveRight);
rightBtn.addEventListener("touchstart", handleMoveRight, { passive: false });

fireBtn.addEventListener("click", handleFire);
fireBtn.addEventListener("touchstart", handleFire, { passive: false });

// Zombie spawner
setInterval(() => {
  if (gameRunning) {
    createZombie();
  }
}, 1200);
