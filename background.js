const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let balls = [];
const BALL_COUNT = 35;

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = document.body.scrollHeight;
}

class Ball {
  constructor() { this.init(); }
  init() {
    this.x  = Math.random() * canvas.width;
    this.y  = Math.random() * canvas.height;
    this.r  = Math.random() * 7 + 3;
    this.vx = (Math.random() - 0.5) * 0.6;
    this.vy = (Math.random() - 0.5) * 0.6;
    this.alpha = Math.random() * 0.45 + 0.55;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < -this.r)              this.x = canvas.width  + this.r;
    if (this.x > canvas.width  + this.r) this.x = -this.r;
    if (this.y < -this.r)              this.y = canvas.height + this.r;
    if (this.y > canvas.height + this.r) this.y = -this.r;
  }
  draw() {
    // Outer glow
    const grd = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r * 3);
    grd.addColorStop(0,   `rgba(255,255,255,${this.alpha})`);
    grd.addColorStop(0.4, `rgba(255,255,255,${this.alpha * 0.4})`);
    grd.addColorStop(1,   'rgba(255,255,255,0)');
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r * 3, 0, Math.PI * 2);
    ctx.fillStyle = grd;
    ctx.fill();

    // Solid core
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${this.alpha})`;
    ctx.fill();
  }
}

function init() {
  resize();
  balls = Array.from({ length: BALL_COUNT }, () => new Ball());
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  balls.forEach(b => { b.update(); b.draw(); });
  requestAnimationFrame(animate);
}

window.addEventListener('resize', () => { resize(); });
// Re-measure on scroll so canvas covers full page height
window.addEventListener('scroll', () => { resize(); });

init();
animate();
