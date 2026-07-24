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
      var wrapper = document.createElement('div');
      wrapper.innerHTML = html;
      var nav = wrapper.firstElementChild;
      if (!nav) {
        return;
      }

      document.body.insertBefore(nav, document.body.firstChild);

      if (prefersReducedMotion || !hasLoadingSequence) {
        revealNav();
      }
    })
    .catch(function () {
      // The header is non-critical chrome — if the include itself
      // fails to load, fail silently rather than leaving the page
      // stuck on a console error.
    });
})();
