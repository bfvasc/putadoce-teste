(function () {
  var track = document.getElementById('loadingTrack');
  if (!track) {
    return;
  }

  // Timing lives in css/loading.css (custom properties on :root) so
  // there's exactly one place to adjust it — read it here rather than
  // hardcoding a second, potentially-drifting set of numbers in JS.
  var rootStyle = getComputedStyle(document.documentElement);

  function readMs(name) {
    return parseFloat(rootStyle.getPropertyValue(name)) || 0;
  }

  var TIMING = {
    stackHold: readMs('--loading-stack-hold'), // stage 1: stacked, before spreading
    spreadDuration: readMs('--loading-spread-duration'), // stage 1 -> 2
    rowHold: readMs('--loading-row-hold') // stage 2: row, before settling
  };

  function showFinalStateImmediately() {
    track.classList.add('is-final');
    track.classList.add('is-selected');
  }

  // prefers-reduced-motion: skip straight to the finished layout — no
  // stacking, no spreading, no timers. loading.css also disables the
  // CSS transitions themselves under the same media query, so even if
  // this script were slow to run nothing would visibly animate.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    showFinalStateImmediately();
    return;
  }

  function play() {
    var t = TIMING.stackHold;
    setTimeout(function () {
      track.classList.add('is-row');
    }, t);

    // is-final (thumbnails settle into place), is-selected
    // (image-cake-1's border/shadow), and the #87CAD1 circle reveal
    // (css/loading.css keys the circle off this same is-final class)
    // all start in this one tick — three simultaneous events, not a
    // fourth step chained after the others finish.
    t += TIMING.spreadDuration + TIMING.rowHold;
    setTimeout(function () {
      track.classList.remove('is-row');
      track.classList.add('is-final');
      track.classList.add('is-selected');
    }, t);
  }

  play();
})();
