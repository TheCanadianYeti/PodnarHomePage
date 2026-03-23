/* ── Dark / Light toggle ─────────────────────────────────── */
function toggleLight() {
  const isLight = document.body.classList.toggle("light");
  document.getElementById("toggleIcon").textContent = isLight ? "☀" : "☽";
  drawGrid(); // redraw with new color
}

/* ── Animated grid background ───────────────────────────── */
const canvas = document.getElementById("grid");
const ctx    = canvas.getContext("2d");

let mouse = { x: -9999, y: -9999 };
let cols, rows, cellSize;

window.addEventListener("mousemove", e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});
window.addEventListener("mouseleave", () => {
  mouse.x = -9999;
  mouse.y = -9999;
});

function resize() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  cellSize = Math.max(50, Math.min(80, window.innerWidth / 14));
  cols = Math.ceil(canvas.width  / cellSize) + 1;
  rows = Math.ceil(canvas.height / cellSize) + 1;
}

function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const isLight    = document.body.classList.contains("light");
  const baseAlpha  = isLight ? 0.08 : 0.07;
  const glowColor  = isLight ? "21,112,216" : "47,143,255";
  const glowRadius = 180;

  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      const x = c * cellSize;
      const y = r * cellSize;

      // distance from mouse to this intersection
      const dx   = mouse.x - x;
      const dy   = mouse.y - y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const glow = Math.max(0, 1 - dist / glowRadius);

      const alpha = baseAlpha + glow * 0.45;

      // vertical line segment
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + cellSize);
      ctx.strokeStyle = `rgba(${glowColor},${alpha})`;
      ctx.lineWidth   = glow > 0.05 ? 1 + glow * 0.8 : 0.5;
      ctx.stroke();

      // horizontal line segment
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + cellSize, y);
      ctx.strokeStyle = `rgba(${glowColor},${alpha})`;
      ctx.lineWidth   = glow > 0.05 ? 1 + glow * 0.8 : 0.5;
      ctx.stroke();

      // dot at intersection if near mouse
      if (glow > 0.15) {
        ctx.beginPath();
        ctx.arc(x, y, 1.5 * glow, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${glowColor},${glow * 0.9})`;
        ctx.fill();
      }
    }
  }
}

let raf;
function loop() {
  drawGrid();
  raf = requestAnimationFrame(loop);
}

window.addEventListener("resize", () => { resize(); });
resize();
loop();

/* ── Card spotlight (CSS custom property approach) ───────── */
document.querySelectorAll(".card").forEach(card => {
  card.addEventListener("mousemove", e => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
    card.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
  });
});
