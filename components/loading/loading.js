(function () {
  var screen = document.getElementById('loadingScreen');
  var SESSION_KEY = 'putadocePlayedLoadingAnimation';

  var TIMING = {
    stackHold: 500, // stacked, only the top image visible (Frame 7:45)
    separate: 700, // spreading into a row (Frame 7:58)
    rowHold: 600, // short pause before enlarging
    push: 250, // second image nudges the row apart as it starts growing (Frame 7:65)
    fullscreen: 900, // second image grows to cover everything (Frame 7:72)
    fullscreenHold: 1000 // hold on the fullscreen image before it becomes the header
  };

  // The fullscreen image stays on the page as the site header instead of
  // being removed, so content added below it later can scroll normally.
  function becomeSiteHeader() {
    screen.querySelectorAll('.loading-item:not([data-item="1"])').forEach(function (item) {
      item.remove();
    });

    var finalImage = screen.querySelector('[data-item="1"] .loading-item__img');

    var header = document.createElement('header');
    header.id = 'siteHeader';
    header.style.backgroundImage = 'url("' + finalImage.src + '")';

    screen.replaceWith(header);
    document.body.classList.remove('loading-active');
  }

  function play() {
    document.body.classList.add('loading-active');

    var t = TIMING.stackHold;
    setTimeout(function () {
      screen.classList.add('is-row');
    }, t);

    t += TIMING.separate + TIMING.rowHold;
    setTimeout(function () {
      screen.classList.add('is-push');
    }, t);

    t += TIMING.push;
    setTimeout(function () {
      screen.classList.add('is-fullscreen');
    }, t);

    t += TIMING.fullscreen + TIMING.fullscreenHold;
    setTimeout(function () {
      sessionStorage.setItem(SESSION_KEY, '1');
      document.dispatchEvent(new CustomEvent('loading:complete'));
      becomeSiteHeader();
    }, t);
  }

  // The entrance animation is only worth watching once per browser
  // session — coming back to the homepage later (e.g. clicking the nav
  // logo from another page) should show the header already in its
  // resting state instead of replaying the whole sequence. sessionStorage
  // (not localStorage) is the right scope here: it persists across
  // navigations within the same tab/session but resets on a fresh visit,
  // matching "first time in a session" rather than "first time ever".
  //
  // header.js and nav.js only build their own pieces once 'loading:complete'
  // fires (nav.js additionally requires becomeSiteHeader() to have already
  // run, since #siteHeader doesn't exist until then) — both scripts run
  // synchronously right after this one in document order, so dispatching
  // the event immediately (or via setTimeout(fn, 0)) here would risk
  // firing before they've registered their listeners: this script is
  // the very first one parsed, so a timer queued this early can still
  // fire in between later <script> tags being executed (verified this
  // actually happens in Chromium — it's not just a theoretical risk).
  // nav.js's own setTimeout(fn, 0) trick avoids that same race safely
  // only because it's queued from inside the *real* animation's final
  // timer, ~4 seconds after every script has long since run — not
  // reliable this early. DOMContentLoaded is the correct primitive
  // here: it's spec-guaranteed to fire only once the whole document has
  // been parsed and every synchronous script (including nav.js's and
  // header.js's own top-level listener registration) has executed.
  if (sessionStorage.getItem(SESSION_KEY) === '1') {
    document.addEventListener('DOMContentLoaded', function () {
      document.dispatchEvent(new CustomEvent('loading:complete'));
      becomeSiteHeader();
    });
  } else {
    play();
  }
})();
