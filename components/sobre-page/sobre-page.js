(function () {
  var header = document.getElementById('sobreHeader');
  if (!header) {
    return;
  }

  // Unlike .sobre's IntersectionObserver-triggered reveal on the
  // homepage (that card is scrolled into view), this header is
  // fullscreen and always the very first thing visible — there's
  // nothing to scroll to, so the grow-in just plays on load instead.
  // Double rAF ensures the initial transform: scale(0) has actually
  // painted a frame before "is-visible" is added, so the transition
  // reliably plays instead of risking being skipped as a same-frame
  // style change.
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      header.classList.add('is-visible');
    });
  });
})();
