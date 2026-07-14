(function () {
  var NAV_REVEAL_DELAY_MS = 350;

  var MENU_ICON_SVG =
    '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">' +
      '<path d="M3 4h18v2H3V4zm0 7h18v2H3v-2zm0 7h18v2H3v-2z"/>' +
    '</svg>';

  // Hides the fixed nav while the page is actively scrolling (in
  // either direction) and reveals it again once scrolling has been
  // idle for NAV_REVEAL_DELAY_MS, regardless of scroll position.
  function setUpNavScrollBehavior(nav) {
    var revealTimer = null;

    window.addEventListener(
      'scroll',
      function () {
        // The drawer locks page scroll (body.nav-menu-open sets
        // overflow:hidden), so this shouldn't fire while it's open —
        // but skip hiding defensively anyway, since hiding the nav
        // would hide the "Fechar" button needed to close it.
        if (document.body.classList.contains('nav-menu-open')) {
          return;
        }

        nav.classList.add('is-hidden');
        clearTimeout(revealTimer);
        revealTimer = setTimeout(function () {
          nav.classList.remove('is-hidden');
        }, NAV_REVEAL_DELAY_MS);
      },
      { passive: true }
    );
  }

  function buildNav() {
    var nav = document.createElement('nav');
    nav.className = 'site-header__nav';
    nav.innerHTML =
      '<a class="site-header__logo" href="#" aria-label="Putadoce">' +
        '<img class="site-header__logo-img" src="components/assets/Logo.svg" alt="Putadoce" />' +
      '</a>' +
      '<button class="btn-pink site-header__menu-btn" type="button">' +
        '<span>Menu</span>' + MENU_ICON_SVG +
      '</button>';

    // Fixed/persistent across the whole page, so it lives as a direct
    // body child rather than inside any single section (which could
    // clip a fixed-position descendant with its own overflow:hidden,
    // as #siteHeader does on the homepage).
    document.body.insertBefore(nav, document.body.firstChild);
    setUpNavScrollBehavior(nav);
  }

  if (document.getElementById('loadingScreen')) {
    // This page has the homepage's loading animation — wait for it to
    // finish before building the nav. becomeSiteHeader() in loading.js
    // runs synchronously right after 'loading:complete' dispatches, so
    // defer one tick, and do it via setTimeout(fn, 0) (rather than
    // building straight away) so nav-menu.js — which queues itself the
    // same way — reliably finds the Menu button already built.
    document.addEventListener('loading:complete', function () {
      setTimeout(buildNav, 0);
    });
  } else {
    // No loading animation on this page — nothing to wait for.
    buildNav();
  }
})();
