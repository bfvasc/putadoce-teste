(function () {
  var TITLE_LINE_1 = 'Nós amamos';
  var THUMB_CONFIG = [
    { key: '1', thumb: 'components/loading/Image-1.png', large: 'components/loading/Image-1-large.png', word: 'cores' },
    { key: '2', thumb: 'components/loading/Image-2.png', large: 'components/loading/Image-2-large.png', word: 'buttercream' },
    { key: '3', thumb: 'components/loading/Image-3.png', large: 'components/loading/Image-3-large.png', word: 'artistas' },
    { key: '4', thumb: 'components/loading/Image-4.png', large: 'components/loading/Image-4-large.png', word: 'inovar' }
  ];
  var ACTIVE_KEY = '2';
  var FONT_READY_TIMEOUT_MS = 2000;

  var ARROW_DOWN_SVG =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">' +
      '<path d="M12 4v15"/>' +
      '<path d="M6 13l6 6 6-6"/>' +
    '</svg>';

  // The DM Sans variable-font woff2 is preloaded in <head> (it serves
  // every weight, including this title's 600/SemiBold, from the same
  // file), but preloading only fetches the file — it doesn't
  // guarantee the font is parsed and ready by the time this element
  // paints. Keep the title hidden (via "is-loading", opacity:0) until
  // the Font Loading API confirms the specific weight/size used here
  // is actually usable, so it never flashes in a fallback font first.
  function revealTitleOnceFontIsReady(title) {
    function reveal() {
      title.classList.remove('is-loading');
    }

    if (document.fonts && document.fonts.load) {
      document.fonts.load('600 100px "DM Sans"').catch(function () {}).then(reveal);
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

    var title = document.createElement('h1');
    title.className = 'site-header__title is-loading';
    title.innerHTML = TITLE_LINE_1 + ' <span class="site-header__title-word">' + activeConfig.word + '</span>';
    var titleWord = title.querySelector('.site-header__title-word');
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

      // No entrance animation on the word swap for now — it just
      // updates immediately alongside the background crossfade above.
      titleWord.textContent = config.word;

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
