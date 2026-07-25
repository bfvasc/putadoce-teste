(function () {
  var hero = document.getElementById('hero');
  if (!hero) {
    return;
  }

  var cake = document.getElementById('heroCake');
  var revealEls = hero.querySelectorAll('.hero__reveal');

  function showRevealElsImmediately() {
    for (var i = 0; i < revealEls.length; i++) {
      revealEls[i].classList.add('is-visible');
    }
  }

  function showFinalStateImmediately() {
    if (cake) {
      cake.classList.add('is-visible');
      cake.classList.add('is-floating');
    }
    showRevealElsImmediately();
  }

  // Reduced motion: skip the fall/entrance/float entirely and render the
  // resting hero state right away — deliberately NOT registering the
  // 'circle-reveal:complete' listener below for this case. js/loading.js
  // dispatches that event synchronously from its own reduced-motion
  // branch, which can fire before this script has even run depending on
  // script load order, so waiting on it here would risk missing it
  // permanently. Matches how components/nav/nav.js sidesteps the same
  // race for the header's own entrance.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    showFinalStateImmediately();
    return;
  }

  // Timing lives in css/loading.css (custom properties on :root),
  // alongside the rest of the entrance sequence's timing — read it here
  // rather than hardcoding a second, potentially-drifting number in JS.
  var rootStyle = getComputedStyle(document.documentElement);
  var fallDuration = parseFloat(rootStyle.getPropertyValue('--hero-fall-duration')) || 0;

  // Padding added on top of the fall transition's own duration for its
  // transitionend fallback — just enough to absorb normal scheduling
  // jitter without meaningfully delaying the sequence if the real event
  // never arrives. Same pattern js/loading.js uses for its own stages.
  var TRANSITION_FALLBACK_BUFFER_MS = 100;

  function onCakeSettled() {
    if (cake) {
      cake.classList.add('is-floating');
    }
    showRevealElsImmediately();
  }

  function playEntrance() {
    if (!cake) {
      showRevealElsImmediately();
      return;
    }

    var fired = false;
    var fallbackTimer;

    function fire() {
      if (fired) {
        return;
      }
      fired = true;
      clearTimeout(fallbackTimer);
      cake.removeEventListener('transitionend', onTransitionEnd);
      onCakeSettled();
    }

    function onTransitionEnd(event) {
      if (event.propertyName === 'transform') {
        fire();
      }
    }

    cake.addEventListener('transitionend', onTransitionEnd);
    fallbackTimer = setTimeout(fire, fallDuration + TRANSITION_FALLBACK_BUFFER_MS);

    cake.classList.add('is-visible'); // starts the fall transition
  }

  // Reuses js/loading.js's own trigger — the cake only starts falling
  // once the #87CAD1 circle reveal has actually finished, never an
  // independent timer of its own.
  document.addEventListener('circle-reveal:complete', playEntrance, { once: true });
})();
