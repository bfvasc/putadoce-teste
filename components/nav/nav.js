(function () {
  var NAV_HTML_PATH = 'components/nav/nav.html';

  function revealNav() {
    var nav = document.querySelector('.nav');
    if (nav) {
      nav.classList.add('is-visible');
    }
  }

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasLoadingSequence = !!document.getElementById('loadingScreen');

  // On the homepage (has #loadingScreen), the header must not slide in
  // until js/loading.js's circle reveal has actually finished — it
  // dispatches 'circle-reveal:complete' for exactly this, the same
  // transitionend-based trigger it already uses internally for its own
  // stages, rather than this file guessing at a second independent
  // delay. The listener is registered here, before the fetch() below
  // even starts, so a slow network can never cause it to miss an event
  // that fires while the include is still loading. Pages without a
  // loading sequence, or with reduced motion requested, just show the
  // header as soon as it exists in the DOM (see the fetch below).
  if (!prefersReducedMotion && hasLoadingSequence) {
    document.addEventListener('circle-reveal:complete', revealNav, { once: true });
  }

  fetch(NAV_HTML_PATH)
    .then(function (response) {
      return response.text();
    })
    .then(function (html) {
      // nav.html now ships more than one top-level element -- the
      // <header> itself, plus the cakes-menu overlay/panel it opens --
      // so every top-level element needs to land as its own direct
      // <body> child, not nested inside the header: the header's own
      // slide-in `transform` would otherwise become the containing
      // block for the menu's position:fixed overlay/panel, breaking
      // their full-viewport sizing. insertAdjacentHTML keeps every
      // top-level element from the fragment, in order, unlike the
      // previous wrapper.firstElementChild approach this replaces
      // (which silently dropped anything after the first element).
      document.body.insertAdjacentHTML('afterbegin', html);

      var nav = document.querySelector('.nav');
      if (!nav) {
        return;
      }

      if (prefersReducedMotion || !hasLoadingSequence) {
        revealNav();
      }

      // Lets components/nav/cakes-menu.js -- loaded as its own script,
      // with no way to otherwise know when this fetch resolves -- know
      // nav.html's markup (header + cakes-menu) now actually exists in
      // the DOM, so it's safe to query and wire up.
      document.dispatchEvent(new CustomEvent('nav:ready'));
    })
    .catch(function () {
      // The header is non-critical chrome — if the include itself
      // fails to load, fail silently rather than leaving the page
      // stuck on a console error.
    });
})();
