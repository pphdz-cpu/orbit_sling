/**
 * Orbit Sling — Phase 2
 * Spawn the comet and planets, then render them each frame.
 */

const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;

const stars = Array.from({ length: 120 }, () => ({
  x: Math.random() * CANVAS_WIDTH,
  y: Math.random() * CANVAS_HEIGHT,
  radius: Math.random() * 1.4 + 0.4,
  alpha: Math.random() * 0.6 + 0.2,
  twinkleSpeed: Math.random() * 0.02 + 0.005,
  twinkleOffset: Math.random() * Math.PI * 2,
}));

const comet = {
  x: CANVAS_WIDTH / 2,
  y: CANVAS_HEIGHT - 70,
  radius: 8,
  color: "#00e5ff",
  velocityY: -2.5,
};

const planetColors = ["#ff6b6b", "#ffd166", "#9b5de5", "#06d6a0", "#f15bb5"];

function createPlanets() {
  const count = Math.floor(Math.random() * 3) + 3;
  const padding = 36;
  const upperMinY = padding;
  const upperMaxY = CANVAS_HEIGHT * 0.45;

  return Array.from({ length: count }, (_, index) => ({
    x: padding + Math.random() * (CANVAS_WIDTH - padding * 2),
    y: upperMinY + Math.random() * (upperMaxY - upperMinY),
    radius: 16 + Math.random() * 12,
    color: planetColors[index % planetColors.length],
  }));
}

const planets = createPlanets();

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
    ctx.beginPath();
    ctx.fillStyle = planet.color;
    ctx.arc(planet.x, planet.y, planet.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawComet() {
  ctx.beginPath();
  ctx.fillStyle = "rgba(0, 229, 255, 0.25)";
  ctx.arc(comet.x, comet.y, comet.radius * 1.8, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.fillStyle = comet.color;
  ctx.arc(comet.x, comet.y, comet.radius, 0, Math.PI * 2);
  ctx.fill();
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

requestAnimationFrame(gameLoop);
