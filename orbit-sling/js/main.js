/**
 * Orbit Sling — Phase 2 (image assets)
 * Spawn the comet and planets, then render them each frame with drawImage().
 */

const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;

const ASSET_PATHS = {
  comet: "assets/images/comet.png",
  planet: "assets/images/planet.png",
};

const SPRITE_FRAMES = {
  comet: { x: 210, y: 430, width: 150, height: 140, hitboxRadius: 28 },
  planet: { x: 260, y: 30, width: 440, height: 540, hitboxRadius: 185 },
};

const stars = Array.from({ length: 120 }, () => ({
  x: Math.random() * CANVAS_WIDTH,
  y: Math.random() * CANVAS_HEIGHT,
  radius: Math.random() * 1.4 + 0.4,
  alpha: Math.random() * 0.6 + 0.2,
  twinkleSpeed: Math.random() * 0.02 + 0.005,
  twinkleOffset: Math.random() * Math.PI * 2,
}));

const images = {
  comet: null,
  planet: null,
};

const comet = {
  x: CANVAS_WIDTH / 2,
  y: CANVAS_HEIGHT - 70,
  hitboxRadius: 15,
  velocityY: -2.5,
};

function createPlanets() {
  const count = Math.floor(Math.random() * 3) + 3;
  const padding = 36;
  const upperMinY = padding;
  const upperMaxY = CANVAS_HEIGHT * 0.45;

  return Array.from({ length: count }, () => {
    const hitboxRadius = 16 + Math.random() * 12;

    return {
      x: padding + Math.random() * (CANVAS_WIDTH - padding * 2),
      y: upperMinY + Math.random() * (upperMaxY - upperMinY),
      hitboxRadius,
    };
  });
}

const planets = createPlanets();

function loadImage(key, src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      images[key] = image;
      resolve(image);
    };
    image.onerror = () => {
      reject(new Error(`Failed to load image: ${src}`));
    };
    image.src = src;
  });
}

function loadAssets() {
  return Promise.all(
    Object.entries(ASSET_PATHS).map(([key, src]) => loadImage(key, src))
  );
}

function getDisplaySize(frame, hitboxRadius) {
  const scale = (hitboxRadius * 2) / (frame.hitboxRadius * 2);

  return {
    width: frame.width * scale,
    height: frame.height * scale,
  };
}

function drawSprite(image, frame, x, y, hitboxRadius) {
  const { width, height } = getDisplaySize(frame, hitboxRadius);

  ctx.drawImage(
    image,
    frame.x,
    frame.y,
    frame.width,
    frame.height,
    x - width / 2,
    y - height / 2,
    width,
    height
  );
}

function clearScreen() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

function drawSpaceBackground(timestamp) {
  const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
  gradient.addColorStop(0, "#0f1630");
  gradient.addColorStop(1, "#05060c");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  for (const star of stars) {
    const twinkle = 0.55 + Math.sin(timestamp * star.twinkleSpeed + star.twinkleOffset) * 0.45;
    ctx.beginPath();
    ctx.fillStyle = `rgba(230, 238, 255, ${star.alpha * twinkle})`;
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawPlanets() {
  for (const planet of planets) {
    drawSprite(images.planet, SPRITE_FRAMES.planet, planet.x, planet.y, planet.hitboxRadius);
  }
}

function drawComet() {
  drawSprite(images.comet, SPRITE_FRAMES.comet, comet.x, comet.y, comet.hitboxRadius);
}

function updateComet() {
  comet.y += comet.velocityY;
}

function gameLoop(timestamp) {
  clearScreen();
  drawSpaceBackground(timestamp);
  updateComet();
  drawPlanets();
  drawComet();
  requestAnimationFrame(gameLoop);
}

loadAssets()
  .then(() => {
    requestAnimationFrame(gameLoop);
  })
  .catch((error) => {
    console.error(error);
    ctx.fillStyle = "#e8edf7";
    ctx.font = "16px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Failed to load game assets.", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
  });
