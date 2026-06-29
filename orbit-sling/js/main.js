/**
 * Orbit Sling — Phase 1
 * Responsive canvas shell with a continuous requestAnimationFrame loop
 * that clears and redraws the screen each frame.
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

function drawPhaseOnePlaceholder() {
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.fillStyle = "rgba(232, 237, 247, 0.92)";
  ctx.font = "600 28px system-ui, sans-serif";
  ctx.fillText("Orbit Sling Ready", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 12);

  ctx.fillStyle = "rgba(232, 237, 247, 0.55)";
  ctx.font = "14px system-ui, sans-serif";
  ctx.fillText("Game loop running", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 22);
}

function gameLoop(timestamp) {
  clearScreen();
  drawSpaceBackground(timestamp);
  drawPhaseOnePlaceholder();
  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
