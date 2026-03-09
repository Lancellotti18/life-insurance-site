/* ============================================================
   BACKGROUND.JS — Animated glowing orbs canvas
   40 white orbs, pulsing alpha, slow float, wrap edges
   ============================================================ */

(function () {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const ORB_COUNT = 40;
  const MAX_SPEED = 0.5;
  let orbs = [];
  let animId;
  let particles = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function createOrb() {
    return {
      x: rand(0, canvas.width),
      y: rand(0, canvas.height),
      r: rand(2, 8),
      vx: rand(-MAX_SPEED, MAX_SPEED),
      vy: rand(-MAX_SPEED, MAX_SPEED),
      baseAlpha: rand(0.6, 1.0),
      alpha: rand(0.6, 1.0),
      phase: rand(0, Math.PI * 2),
      phaseSpeed: rand(0.005, 0.022),
    };
  }

  function initOrbs() {
    orbs = [];
    for (let i = 0; i < ORB_COUNT; i++) {
      orbs.push(createOrb());
    }
  }

  function drawOrb(orb) {
    const gradient = ctx.createRadialGradient(
      orb.x, orb.y, 0,
      orb.x, orb.y, orb.r * 4
    );
    gradient.addColorStop(0, `rgba(255, 255, 255, ${orb.alpha})`);
    gradient.addColorStop(0.4, `rgba(255, 255, 255, ${orb.alpha * 0.45})`);
    gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);

    ctx.beginPath();
    ctx.arc(orb.x, orb.y, orb.r * 4, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();

    // Solid core
    ctx.beginPath();
    ctx.arc(orb.x, orb.y, orb.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${orb.alpha})`;
    ctx.fill();
  }

  function spawnExplosion(x, y) {
    const count = 18;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const speed = rand(1.5, 5);
      particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        r: rand(2, 5),
        alpha: 1,
        life: 1,
        decay: rand(0.018, 0.035),
      });
    }
  }

  function drawParticle(p) {
    const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3);
    gradient.addColorStop(0, `rgba(255, 255, 255, ${p.alpha})`);
    gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
    ctx.fill();
  }

  function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const orb of orbs) {
      // Pulse alpha with sine wave
      orb.phase += orb.phaseSpeed;
      orb.alpha = orb.baseAlpha * (0.65 + 0.35 * Math.sin(orb.phase));

      // Move
      orb.x += orb.vx;
      orb.y += orb.vy;

      // Wrap around edges
      const margin = orb.r * 4;
      if (orb.x < -margin) orb.x = canvas.width + margin;
      if (orb.x > canvas.width + margin) orb.x = -margin;
      if (orb.y < -margin) orb.y = canvas.height + margin;
      if (orb.y > canvas.height + margin) orb.y = -margin;

      drawOrb(orb);
    }

    // Update and draw explosion particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.94;
      p.vy *= 0.94;
      p.life -= p.decay;
      p.alpha = p.life;
      if (p.life <= 0) { particles.splice(i, 1); continue; }
      drawParticle(p);
    }

    animId = requestAnimationFrame(update);
  }

  function init() {
    resize();
    initOrbs();
    if (animId) cancelAnimationFrame(animId);
    update();
  }

  window.addEventListener('click', (e) => {
    spawnExplosion(e.clientX, e.clientY);
  });

  window.addEventListener('resize', () => {
    resize();
    // Reposition any orbs that are now out of bounds after resize
    for (const orb of orbs) {
      if (orb.x > canvas.width) orb.x = rand(0, canvas.width);
      if (orb.y > canvas.height) orb.y = rand(0, canvas.height);
    }
  });

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
