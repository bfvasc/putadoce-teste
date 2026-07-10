(function () {
  var THUMB_CONFIG = [
    { key: '1', thumb: 'components/loading/Image-1.png', large: 'components/loading/Image-1-large.png' },
    { key: '2', thumb: 'components/loading/Image-2.png', large: 'components/loading/Image-2-large.png' },
    { key: '3', thumb: 'components/loading/Image-3.png', large: 'components/loading/Image-3-large.png' },
    { key: '4', thumb: 'components/loading/Image-4.png', large: 'components/loading/Image-4-large.png' }
  ];
  var ACTIVE_KEY = '2';

  var LOGO_ICON_SVG =
    '<svg viewBox="0 0 22 36" fill="none" xmlns="http://www.w3.org/2000/svg">' +
      '<path d="M11 34C11 28 9.5 25 9.5 20" stroke="#FF2B00" stroke-width="3" stroke-linecap="round"/>' +
      '<circle cx="11" cy="11" r="10.5" fill="#FF2B00"/>' +
      '<path d="M11 3.2A7.8 7.8 0 1 1 5.2 8.8" stroke="#FFFFFF" stroke-width="1.5" fill="none" stroke-linecap="round"/>' +
      '<path d="M11 6.4A4.8 4.8 0 1 1 7.7 10.4" stroke="#FFFFFF" stroke-width="1.2" fill="none" stroke-linecap="round"/>' +
    '</svg>';

  var MENU_ICON_SVG =
    '<svg viewBox="0 0 24 24" fill="#FF2B00" xmlns="http://www.w3.org/2000/svg">' +
      '<path d="M3 4h18v2H3V4zm0 7h18v2H3v-2zm0 7h18v2H3v-2z"/>' +
    '</svg>';

  var ARROW_DOWN_SVG =
    '<svg viewBox="0 0 24 24" fill="none" stroke="#FF2B00" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">' +
      '<path d="M12 4v15"/>' +
      '<path d="M6 13l6 6 6-6"/>' +
    '</svg>';

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
        '<span class="site-header__logo-word">PUTA</span>' +
        '<span class="site-header__logo-icon">' + LOGO_ICON_SVG + '</span>' +
        '<span class="site-header__logo-word">DOCE</span>' +
      '</a>' +
      '<button class="site-header__menu-btn" type="button">' +
        '<span>Menu</span>' + MENU_ICON_SVG +
      '</button>';

    var title = document.createElement('h1');
    title.className = 'site-header__title';
    title.textContent = 'Nós amamos buttercream';

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
    pill.className = 'site-header__pill';
    pill.href = '#site-content';
    pill.innerHTML = '<span>O site continua mais pra baixo</span>' + ARROW_DOWN_SVG;

    header.appendChild(bgA);
    header.appendChild(bgB);
    header.appendChild(nav);
    header.appendChild(title);
    header.appendChild(thumbs);
    header.appendChild(pill);

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
