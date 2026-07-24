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
    settleDuration: readMs('--loading-settle-duration') // stage 2 -> 3, used below as the fallback's deadline
  };

  // Padding added on top of --loading-settle-duration for the
  // transitionend fallback below — just enough to absorb normal
  // scheduling jitter without meaningfully delaying the sequence if
  // the real event never arrives.
  var SETTLE_FALLBACK_BUFFER_MS = 100;

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

  // is-selected is the single shared trigger for both image-cake-1's
  // border/shadow AND the circle reveal (css/loading.css keys the
  // circle off this same class) — adding it in exactly one place is
  // what keeps the two perfectly in sync instead of risking drift
  // between two separately-scheduled timers.
  //
  // It has to wait for the settle transition (stage 2 -> 3, the
  // thumbnails shrinking and moving to their final position) to
  // actually finish, not just start — otherwise the circle starts
  // growing while the thumbnails are still visibly mid-move. Listening
  // for the real transitionend event on image-cake-1 (filtered to its
  // "transform" property, since width/height/border-color/box-shadow
  // all transition too and each fires its own transitionend) is more
  // accurate than a second hardcoded delay, which could drift out of
  // sync with --loading-settle-duration if that value ever changes
  // without this one being updated to match. The setTimeout fallback
  // covers the rare case that event never fires at all (an
  // interrupted transition, a browser quirk, etc.) so the sequence
  // can't get permanently stuck before the selected state/circle.
  function triggerSelectedStateAfterSettle() {
    var item1 = track.querySelector('.loading-item[data-item="1"]');
    var fired = false;
    var fallbackTimer;

    function fire() {
      if (fired) {
        return;
      }
      fired = true;
      clearTimeout(fallbackTimer);
      if (item1) {
        item1.removeEventListener('transitionend', onTransitionEnd);
      }
      track.classList.add('is-selected');
    }

    function onTransitionEnd(event) {
      if (event.propertyName === 'transform') {
        fire();
      }
    }

    if (item1) {
      item1.addEventListener('transitionend', onTransitionEnd);
    }

    fallbackTimer = setTimeout(fire, TIMING.settleDuration + SETTLE_FALLBACK_BUFFER_MS);
  }

  function play() {
    var t = TIMING.stackHold;
    setTimeout(function () {
      track.classList.add('is-row');
    }, t);

    t += TIMING.spreadDuration + TIMING.rowHold;
    setTimeout(function () {
      track.classList.remove('is-row');
      track.classList.add('is-final'); // starts the settle transition
      triggerSelectedStateAfterSettle(); // fires once it actually ends
    }, t);
  }

  play();
})();
