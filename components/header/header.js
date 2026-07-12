(function () {
  var THUMB_CONFIG = [
    { key: '1', thumb: 'components/loading/Image-1.png', large: 'components/loading/Image-1-large.png', title: 'Nós amamos cores' },
    { key: '2', thumb: 'components/loading/Image-2.png', large: 'components/loading/Image-2-large.png', title: 'Nós amamos buttercream' },
    { key: '3', thumb: 'components/loading/Image-3.png', large: 'components/loading/Image-3-large.png', title: 'Nós amamos artistas' },
    { key: '4', thumb: 'components/loading/Image-4.png', large: 'components/loading/Image-4-large.png', title: 'Nós amamos inovar' }
  ];
  var ACTIVE_KEY = '2';
  var TITLE_FADE_MS = 300;
  var FONT_READY_TIMEOUT_MS = 2000;
  var NAV_REVEAL_DELAY_MS = 350;

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

  var MENU_ICON_SVG =
    '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">' +
      '<path d="M3 4h18v2H3V4zm0 7h18v2H3v-2zm0 7h18v2H3v-2z"/>' +
    '</svg>';

  var ARROW_DOWN_SVG =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">' +
      '<path d="M12 4v15"/>' +
      '<path d="M6 13l6 6 6-6"/>' +
    '</svg>';

  // The Antonio Bold woff2 is preloaded in <head>, but preloading only
  // fetches the file — it doesn't guarantee the font is parsed and ready
  // by the time this element paints. Keep the title hidden (via the same
  // "is-fading" opacity:0 state used for the thumbnail crossfade) until
  // the Font Loading API confirms it's actually usable, so it never
  // flashes in a fallback font first.
  function revealTitleOnceFontIsReady(title) {
    function reveal() {
      title.classList.remove('is-fading');
    }

    if (document.fonts && document.fonts.load) {
      document.fonts.load('700 100px Antonio').catch(function () {}).then(reveal);
    } else {
      reveal();
    }

    // Safety net: never leave the title invisible if font loading stalls.
    setTimeout(reveal, FONT_READY_TIMEOUT_MS);
  }

  function buildHeader(header) {
    var bgA = document.createElement('div');
    bgA.className = 'site-header__bg';
    var bgB = document.createElement('div');
    bgB.className = 'site-header__bg';

    var activeConfig = THUMB_CONFIG.find(function (c) { return c.key === ACTIVE_KEY; });
    bgA.style.backgroundImage = 'url("' + activeConfig.large + '")';
    bgA.classList.add('is-visible');

    var nav = document.createElement('nav');
    nav.className = 'site-header__nav';
    nav.innerHTML =
      '<a class="site-header__logo" href="#" aria-label="Putadoce">' +
        '<img class="site-header__logo-img" src="components/assets/Logo.svg" alt="Putadoce" />' +
      '</a>' +
      '<button class="btn-pink site-header__menu-btn" type="button">' +
        '<span>Menu</span>' + MENU_ICON_SVG +
      '</button>';

    var title = document.createElement('h1');
    title.className = 'site-header__title is-fading';
    title.textContent = activeConfig.title;
    revealTitleOnceFontIsReady(title);

    var thumbs = document.createElement('div');
    thumbs.className = 'site-header__thumbs';
    THUMB_CONFIG.forEach(function (config) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'site-header__thumb' + (config.key === ACTIVE_KEY ? ' is-active' : '');
      btn.style.backgroundImage = 'url("' + config.thumb + '")';
      btn.setAttribute('aria-label', 'Show image ' + config.key);
      btn.dataset.key = config.key;
      thumbs.appendChild(btn);
    });

    var pill = document.createElement('a');
    pill.className = 'btn-pink site-header__pill';
    pill.href = '#site-content';
    pill.innerHTML = '<span>O site continua mais pra baixo</span>' + ARROW_DOWN_SVG;

    header.appendChild(bgA);
    header.appendChild(bgB);
    header.appendChild(title);
    header.appendChild(thumbs);
    header.appendChild(pill);

    // The nav is fixed/persistent across the whole page, so it lives
    // as a direct body child rather than inside #siteHeader (which
    // has overflow:hidden and would clip a fixed-position descendant
    // once the page scrolls past it).
    document.body.insertBefore(nav, document.body.firstChild);
    setUpNavScrollBehavior(nav);

    var layers = [bgA, bgB];
    var visibleLayer = bgA;

    thumbs.addEventListener('click', function (event) {
      var btn = event.target.closest('.site-header__thumb');
      if (!btn || btn.classList.contains('is-active')) {
        return;
      }

      var config = THUMB_CONFIG.find(function (c) { return c.key === btn.dataset.key; });
      var hiddenLayer = layers[0] === visibleLayer ? layers[1] : layers[0];

      hiddenLayer.style.backgroundImage = 'url("' + config.large + '")';
      // Force layout so the new background is applied before the opacity
      // transition starts, otherwise the crossfade can be skipped.
      void hiddenLayer.offsetWidth;
      hiddenLayer.classList.add('is-visible');
      visibleLayer.classList.remove('is-visible');
      visibleLayer = hiddenLayer;

      title.classList.add('is-fading');
      setTimeout(function () {
        title.textContent = config.title;
        title.classList.remove('is-fading');
      }, TITLE_FADE_MS);

      thumbs.querySelectorAll('.site-header__thumb').forEach(function (el) {
        el.classList.remove('is-active');
      });
      btn.classList.add('is-active');
    });
  }

  document.addEventListener('loading:complete', function () {
    // becomeSiteHeader() in loading.js runs synchronously right after this
    // event dispatches, so #siteHeader doesn't exist yet — wait a tick.
    setTimeout(function () {
      var header = document.getElementById('siteHeader');
      if (header) {
        buildHeader(header);
      }
    }, 0);
  });
})();
