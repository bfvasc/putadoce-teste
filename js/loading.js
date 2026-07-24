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
    rowHold: readMs('--loading-row-hold'), // stage 2: row, before settling
    settleDuration: readMs('--loading-settle-duration') // stage 2 -> 3
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

    t += TIMING.spreadDuration + TIMING.rowHold;
    setTimeout(function () {
      track.classList.remove('is-row');
      track.classList.add('is-final');
    }, t);

    t += TIMING.settleDuration;
    setTimeout(function () {
      track.classList.add('is-selected');
    }, t);
  }

  play();
})();
