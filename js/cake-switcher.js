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
  var thumbButtons = track.querySelectorAll('.loading-item');

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

  // Matches the hero markup's own default (cake 1) and
  // .loading-item[data-item="1"]'s own aria-pressed="true" default —
  // both already correct on screen before this script ever runs.
  var currentCakeId = 1;

  // Deliberately just a hard swap for now — image, word, background
  // color, and the active thumbnail all change in the same tick, no
  // transition of any kind (see the task this shipped in: no circle
  // reveal or cross-fade yet, that's a separate later task). Note
  // what this function deliberately does NOT touch: .hero__cake's own
  // is-visible/is-floating classes. The fall-in entrance only ever
  // plays once, for cake 1 on page load (js/hero.js) — switching
  // cakes here only ever swaps the <img> src underneath, so the
  // cake's continuous float keeps running, uninterrupted, across every
  // switch. A later task can animate the swap itself — e.g. reusing
  // .loading-circle for a reveal, the same element the page's own
  // initial-load entrance already grows from — without needing to
  // touch how the new state is looked up or applied here.
  function switchToCake(id) {
    if (id === currentCakeId) {
      return;
    }
    var cake = findCake(id);
    if (!cake) {
      return;
    }
    currentCakeId = cake.id;

    if (heroCakeImg) {
      heroCakeImg.src = cake.image;
      heroCakeImg.alt = cake.alt;
    }
    if (heroCake) {
      heroCake.setAttribute('data-cake', String(cake.id));
    }
    if (heroWord) {
      heroWord.textContent = cake.word;
    }

    document.documentElement.style.setProperty('--circle-reveal-color', cake.color);
    setActiveThumb(cake.id);
  }

  function onThumbClick(event) {
    switchToCake(parseInt(event.currentTarget.getAttribute('data-item'), 10));
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
