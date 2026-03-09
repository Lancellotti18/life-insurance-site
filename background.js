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

    animId = requestAnimationFrame(update);
  }

  function init() {
    resize();
    initOrbs();
    if (animId) cancelAnimationFrame(animId);
    update();
  }

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
