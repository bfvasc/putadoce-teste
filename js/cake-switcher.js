(function () {
  var hero = document.getElementById('hero');
  var track = document.getElementById('loadingTrack');
  if (!hero || !track) {
    return;
  }

  // ---- Per-cake data: the one place to add or edit a cake ----
  // Everything that changes when switching cakes lives here — the
  // central image, its alt text, the swappable right-side word, and
  // the page background color (css/loading.css's --circle-reveal-color,
  // which .loading-circle already covers the whole viewport with once
  // the entrance sequence finishes, so recoloring it recolors the page).
  // "nós amamos" and the "Pedir no Goomer" button are intentionally
  // absent — both stay fixed across every cake, straight from the hero
  // markup itself.
  var CAKES = [
    {
      id: 1,
      image: 'assets/images/homepage/image-cake-central-1.png',
      alt: 'Bolo com buttercream azul e confetes coloridos',
      word: 'buttercream',
      color: '#87cad1'
    },
    {
      id: 2,
      image: 'assets/images/homepage/image-cake-central-2.png',
      alt: 'Bolo rosa coberto de balas de goma e confetes coloridos',
      word: 'bala de goma',
      color: '#fb9dda'
    },
    {
      id: 3,
      image: 'assets/images/homepage/image-cake-central-3.png',
      alt: 'Bolo azul espinhoso com bolinhas vermelhas',
      word: 'arte e artistas',
      color: '#d8e737'
    },
    {
      id: 4,
      image: 'assets/images/homepage/image-cake-central-4.png',
      alt: 'Bolo prateado decorado com flores rosa e verdes',
      word: 'criar e inovar',
      color: '#857dec'
    }
  ];

  var heroCake = document.getElementById('heroCake');
  var heroCakeImg = heroCake ? heroCake.querySelector('.hero__cake-img') : null;
  var heroWord = document.getElementById('heroVariableWord');
  var transitionCircle = document.getElementById('heroTransitionCircle');
  var thumbButtons = track.querySelectorAll('.loading-item');

  // Timing lives in css/loading.css (custom properties on :root),
  // alongside the rest of the entrance sequence's timing — read it
  // here rather than hardcoding a second, potentially-drifting set of
  // numbers in JS. Same pattern js/loading.js and js/hero.js already
  // use for their own stage durations.
  var rootStyle = getComputedStyle(document.documentElement);
  function readMs(name) {
    return parseFloat(rootStyle.getPropertyValue(name)) || 0;
  }
  var TIMING = {
    circleDuration: readMs('--switch-circle-duration'),
    cakeDuration: readMs('--switch-cake-duration'),
    wordDuration: readMs('--switch-word-duration')
  };

  // Padding added on top of each leg's own transition duration for its
  // transitionend fallback — just enough to absorb normal scheduling
  // jitter without meaningfully delaying the sequence if the real
  // event never arrives. Same pattern used throughout this codebase.
  var TRANSITION_FALLBACK_BUFFER_MS = 100;

  function findCake(id) {
    for (var i = 0; i < CAKES.length; i++) {
      if (CAKES[i].id === id) {
        return CAKES[i];
      }
    }
    return null;
  }

  function setActiveThumb(id) {
    for (var i = 0; i < thumbButtons.length; i++) {
      var button = thumbButtons[i];
      var isActive = parseInt(button.getAttribute('data-item'), 10) === id;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    }
  }

  // ---- Small, focused appliers — the actual "write this cake's data
  // into the DOM" step, shared by both the hard-swap path and the
  // animated one below so there is exactly one place that knows how
  // to apply a cake, however the swap ends up getting there. ----
  function applyCakeImage(cake) {
    if (heroCakeImg) {
      heroCakeImg.src = cake.image;
      heroCakeImg.alt = cake.alt;
    }
    if (heroCake) {
      heroCake.setAttribute('data-cake', String(cake.id));
    }
  }

  function applyWord(cake) {
    if (heroWord) {
      heroWord.textContent = cake.word;
    }
  }

  function applyBackgroundColor(cake) {
    document.documentElement.style.setProperty('--circle-reveal-color', cake.color);
  }

  // Matches the hero markup's own default (cake 1) and
  // .loading-item[data-item="1"]'s own aria-pressed="true" default —
  // both already correct on screen before this script ever runs.
  var currentCakeId = 1;
  var isTransitioning = false;

  // ---- Hard swap: prefers-reduced-motion's path (see onThumbClick
  // below) — every piece changes in the same tick, no animation of
  // any kind. ----
  function hardSwapToCake(cake) {
    applyCakeImage(cake);
    applyWord(cake);
    applyBackgroundColor(cake);
  }

  // ---- Animated switch ----
  // The circle (protagonist), the cake, and the word all start here,
  // in the same synchronous call — never from separate independent
  // timers — so a click is the one shared trigger the whole switch
  // can never drift out of sync with. Each of the three still runs on
  // its own schedule after that (see the --switch-*-duration comment
  // in css/loading.css), which is what actually creates the motion
  // hierarchy: the circle is deliberately the longest, so the cake
  // and word — both quick enough to finish at or before it — read as
  // riding along with it rather than competing for attention.
  function playSwitchTransition(cake, originRect) {
    playCircleReveal(cake, originRect);
    playCakeSwap(cake);
    playWordFade(cake);
  }

  // Reuses .loading-circle's own grow-from-a-point technique (see the
  // CSS comment there) through a second, dedicated element rather
  // than repositioning .loading-circle itself, so the opening
  // sequence's own element is never touched by a manual switch.
  function playCircleReveal(cake, originRect) {
    if (!transitionCircle) {
      applyBackgroundColor(cake);
      finishTransition();
      return;
    }

    var originX = originRect.left + originRect.width / 2;
    var originY = originRect.top + originRect.height / 2;
    transitionCircle.style.setProperty('--transition-origin-x', originX + 'px');
    transitionCircle.style.setProperty('--transition-origin-y', originY + 'px');
    transitionCircle.style.backgroundColor = cake.color;

    // Forces the browser to register the reset origin/color/scale(0)
    // above as an actual painted frame before .is-growing gets added
    // below — otherwise both changes can get coalesced into a single
    // frame and the grow would never visibly animate.
    void transitionCircle.offsetWidth;

    var fired = false;
    var fallbackTimer;

    function finish() {
      if (fired) {
        return;
      }
      fired = true;
      clearTimeout(fallbackTimer);
      transitionCircle.removeEventListener('transitionend', onTransitionEnd);

      // The transition circle now fully covers the viewport in the
      // new color — committing it to the shared, permanent background
      // (which .loading-circle itself reads) and resetting this
      // circle back to scale(0) happen in the same tick, with no
      // transition, so there's no flash: whatever's showing through
      // once it disappears already matches what's underneath.
      applyBackgroundColor(cake);
      transitionCircle.classList.remove('is-growing');

      finishTransition();
    }

    function onTransitionEnd(event) {
      if (event.propertyName === 'transform') {
        finish();
      }
    }

    transitionCircle.addEventListener('transitionend', onTransitionEnd);
    fallbackTimer = setTimeout(finish, TIMING.circleDuration + TRANSITION_FALLBACK_BUFFER_MS);

    transitionCircle.classList.add('is-growing');
  }

  // Shrink + fade the current cake out, swap its <img> src once that
  // finishes, then grow + fade the new one back in and resume
  // floating — never the fall-from-above, which only ever plays once,
  // for the page's own initial load (js/hero.js).
  function playCakeSwap(cake) {
    if (!heroCake) {
      applyCakeImage(cake);
      return;
    }

    heroCake.classList.remove('is-floating'); // paused for the swap; resumed once the new cake has grown back in
    heroCake.classList.add('is-switching');

    var outFired = false;
    var outFallback;

    function onOutEnd(event) {
      if (event.propertyName === 'opacity') {
        swapIn();
      }
    }

    function swapIn() {
      if (outFired) {
        return;
      }
      outFired = true;
      clearTimeout(outFallback);
      heroCake.removeEventListener('transitionend', onOutEnd);

      applyCakeImage(cake);

      var inFired = false;
      var inFallback;

      function onInEnd(event) {
        if (event.propertyName === 'opacity') {
          settle();
        }
      }

      function settle() {
        if (inFired) {
          return;
        }
        inFired = true;
        clearTimeout(inFallback);
        heroCake.removeEventListener('transitionend', onInEnd);
        heroCake.classList.remove('is-switching');
        // Resumes exactly where js/hero.js's own initial settle
        // already leaves off — the cake is back at its resting
        // transform/opacity by now, so there's no seam.
        heroCake.classList.add('is-floating');
      }

      heroCake.addEventListener('transitionend', onInEnd);
      inFallback = setTimeout(settle, TIMING.cakeDuration + TRANSITION_FALLBACK_BUFFER_MS);

      heroCake.classList.remove('is-swap-hidden'); // starts the "grow + fade in" leg
    }

    heroCake.addEventListener('transitionend', onOutEnd);
    outFallback = setTimeout(swapIn, TIMING.cakeDuration + TRANSITION_FALLBACK_BUFFER_MS);

    heroCake.classList.add('is-swap-hidden'); // starts the "shrink + fade out" leg
  }

  // Same shrink-out / swap / grow-in shape as the cake above, just
  // opacity-only (no scale) and quicker, to stay the most subtle of
  // the three switch animations.
  function playWordFade(cake) {
    if (!heroWord) {
      applyWord(cake);
      return;
    }

    heroWord.classList.add('is-switching');

    var outFired = false;
    var outFallback;

    function onOutEnd(event) {
      if (event.propertyName === 'opacity') {
        swapIn();
      }
    }

    function swapIn() {
      if (outFired) {
        return;
      }
      outFired = true;
      clearTimeout(outFallback);
      heroWord.removeEventListener('transitionend', onOutEnd);

      applyWord(cake);

      var inFired = false;
      var inFallback;

      function onInEnd(event) {
        if (event.propertyName === 'opacity') {
          settle();
        }
      }

      function settle() {
        if (inFired) {
          return;
        }
        inFired = true;
        clearTimeout(inFallback);
        heroWord.removeEventListener('transitionend', onInEnd);
        heroWord.classList.remove('is-switching');
      }

      heroWord.addEventListener('transitionend', onInEnd);
      inFallback = setTimeout(settle, TIMING.wordDuration + TRANSITION_FALLBACK_BUFFER_MS);

      heroWord.classList.remove('is-swap-hidden');
    }

    heroWord.addEventListener('transitionend', onOutEnd);
    outFallback = setTimeout(swapIn, TIMING.wordDuration + TRANSITION_FALLBACK_BUFFER_MS);

    heroWord.classList.add('is-swap-hidden');
  }

  // The circle is deliberately the longest-running of the three, so
  // by the time it reports done, the cake and word are guaranteed to
  // already have too — this is the one moment the whole switch is
  // truly finished, safe to unlock the next click.
  function finishTransition() {
    isTransitioning = false;
  }

  function onThumbClick(event) {
    var id = parseInt(event.currentTarget.getAttribute('data-item'), 10);
    // Clicking the already-selected thumbnail does nothing — no
    // animation, no re-trigger. A transition already in flight is
    // also left alone rather than interrupted or queued: these are
    // discrete, deliberate clicks, not a continuous gesture, so a
    // simple lock until the current switch finishes is enough.
    if (id === currentCakeId || isTransitioning) {
      return;
    }
    var cake = findCake(id);
    if (!cake) {
      return;
    }
    currentCakeId = cake.id;
    setActiveThumb(cake.id); // instant, independent of the rest — confirms the click registered right away

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      hardSwapToCake(cake);
      return;
    }

    isTransitioning = true;
    playSwitchTransition(cake, event.currentTarget.getBoundingClientRect());
  }

  for (var i = 0; i < thumbButtons.length; i++) {
    thumbButtons[i].addEventListener('click', onThumbClick);
  }

  // css/loading.css keys the selected-thumbnail border off .is-active
  // (see the comment there) rather than a hardcoded [data-item='1'],
  // so it has to be added here explicitly — item 1's own
  // aria-pressed="true" is already correct straight from the HTML as
  // a no-JS fallback, but the CSS class itself only ever gets set by
  // this script.
  setActiveThumb(currentCakeId);
})();
