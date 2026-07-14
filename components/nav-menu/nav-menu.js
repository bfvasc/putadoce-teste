(function () {
  var ITEMS = ['Home', 'Portfolio', 'Sobre', 'Contato'];
  var STAGGER_MS = 70;

  var MENU_ICON_SVG =
    '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">' +
      '<path d="M3 4h18v2H3V4zm0 7h18v2H3v-2zm0 7h18v2H3v-2z"/>' +
    '</svg>';

  var CLOSE_ICON_SVG =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">' +
      '<path d="M6 6l12 12M18 6L6 18"/>' +
    '</svg>';

  var INSTAGRAM_SVG =
    '<svg viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="1.8" xmlns="http://www.w3.org/2000/svg">' +
      '<rect x="3" y="3" width="18" height="18" rx="5" />' +
      '<circle cx="12" cy="12" r="4.2" />' +
      '<circle cx="17.2" cy="6.8" r="1.1" fill="#000000" stroke="none" />' +
    '</svg>';

  var WHATSAPP_SVG =
    '<svg viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">' +
      '<path d="M12 3C7.03 3 3 7.03 3 12c0 1.77.5 3.42 1.38 4.83L3 21l4.3-1.35A8.93 8.93 0 0 0 12 21c4.97 0 9-4.03 9-9s-4.03-9-9-9z" />' +
      '<path d="M8.7 8.6c.2-.45.45-.5.75-.5h.55c.2 0 .4.05.55.4.2.45.65 1.55.7 1.65.05.1.1.25 0 .4-.35.6-.65.75-.5 1.05.85 1.55 1.75 2.15 3.15 2.75.25.1.4.1.55-.05.2-.2.7-.8.9-1.05.2-.25.4-.2.65-.1.65.3 1.6.75 1.85.9.2.1.35.15.4.3.05.2.05.9-.25 1.4-.3.5-1.4.95-1.9 1-.5.05-1 .1-3.4-.9-2.9-1.2-4.6-4.2-4.75-4.4-.15-.2-1.15-1.5-1.15-2.9 0-1.35.7-2 .95-2.35z" />' +
    '</svg>';

  function buildMenu() {
    var menuBtn = document.querySelector('.site-header__menu-btn');
    if (!menuBtn) {
      return;
    }

    var overlay = document.createElement('div');
    overlay.className = 'nav-menu__overlay';

    var drawer = document.createElement('div');
    drawer.className = 'nav-menu__drawer';

    var list = document.createElement('nav');
    list.className = 'nav-menu__list';
    ITEMS.forEach(function (label, index) {
      var link = document.createElement('a');
      link.className = 'nav-menu__item';
      link.href = '#';
      link.textContent = label;
      link.style.transitionDelay = index * STAGGER_MS + 'ms';
      list.appendChild(link);
    });

    var social = document.createElement('div');
    social.className = 'nav-menu__social';
    social.style.transitionDelay = ITEMS.length * STAGGER_MS + 'ms';
    social.innerHTML =
      '<a href="#" aria-label="Instagram">' + INSTAGRAM_SVG + '</a>' +
      '<a href="#" aria-label="WhatsApp">' + WHATSAPP_SVG + '</a>';

    drawer.appendChild(list);
    drawer.appendChild(social);
    document.body.appendChild(overlay);
    document.body.appendChild(drawer);

    var isOpen = false;
    var contentTimer = null;

    function setButtonState(open) {
      menuBtn.innerHTML = open
        ? '<span>Fechar</span>' + CLOSE_ICON_SVG
        : '<span>Menu</span>' + MENU_ICON_SVG;
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    }

    function openMenu() {
      isOpen = true;
      document.body.classList.add('nav-menu-open');
      overlay.classList.add('is-visible');
      drawer.classList.add('is-open');
      setButtonState(true);

      // The content stagger only starts once the drawer has finished
      // sliding in, not alongside it.
      clearTimeout(contentTimer);
      var slideMs = parseFloat(getComputedStyle(drawer).transitionDuration) * 1000 || 400;
      contentTimer = setTimeout(function () {
        drawer.classList.add('is-content-visible');
      }, slideMs);
    }

    function closeMenu() {
      isOpen = false;
      clearTimeout(contentTimer);
      document.body.classList.remove('nav-menu-open');
      overlay.classList.remove('is-visible');
      drawer.classList.remove('is-open');
      drawer.classList.remove('is-content-visible');
      setButtonState(false);
    }

    function toggleMenu() {
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    }

    menuBtn.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', closeMenu);
    list.addEventListener('click', function (event) {
      if (event.target.closest('.nav-menu__item')) {
        closeMenu();
      }
    });
    document.addEventListener('keydown', function (event) {
      if (isOpen && event.key === 'Escape') {
        closeMenu();
      }
    });
  }

  if (document.getElementById('loadingScreen')) {
    // nav.js's own 'loading:complete' listener (registered first, since
    // nav.js loads before this script) schedules buildNav() via
    // setTimeout(fn, 0). Scheduling ours the same way here queues it
    // right after, so the Menu button already exists once this runs.
    document.addEventListener('loading:complete', function () {
      setTimeout(buildMenu, 0);
    });
  } else {
    // No loading animation on this page — nav.js already built the
    // Menu button synchronously before this script ran (script tags
    // execute in order), so there's nothing to wait for.
    buildMenu();
  }
})();
