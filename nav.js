/* ============================================================
   NAV.JS — Side navigation open/close logic
   ============================================================ */

(function () {
  const hamburger = document.getElementById('hamburger');
  const sideNav   = document.getElementById('side-nav');
  const overlay   = document.getElementById('nav-overlay');
  const closeBtn  = document.getElementById('nav-close');

  if (!hamburger || !sideNav || !overlay) return;

  function openNav() {
    sideNav.classList.add('open');
    overlay.classList.add('active');
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeNav() {
    sideNav.classList.remove('open');
    overlay.classList.remove('active');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', function () {
    if (sideNav.classList.contains('open')) {
      closeNav();
    } else {
      openNav();
    }
  });

  overlay.addEventListener('click', closeNav);

  if (closeBtn) {
    closeBtn.addEventListener('click', closeNav);
  }

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && sideNav.classList.contains('open')) {
      closeNav();
    }
  });

  // Active link highlighting — match current page filename
  (function highlightActive() {
    const path = window.location.pathname;
    const page = path.split('/').pop() || 'index.html';
    const links = sideNav.querySelectorAll('.nav-links a');

    links.forEach(function (link) {
      const href = link.getAttribute('href');
      if (!href) return;
      const linkPage = href.split('/').pop();

      // Handle root / index.html
      const isCurrent = (linkPage === page) ||
        (page === '' && linkPage === 'index.html') ||
        (page === 'index.html' && linkPage === 'index.html');

      if (isCurrent) {
        link.classList.add('active');
      }
    });
  })();
})();
