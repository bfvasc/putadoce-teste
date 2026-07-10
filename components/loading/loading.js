(function () {
  var screen = document.getElementById('loadingScreen');

  var TIMING = {
    stackHold: 500, // stacked, only the top image visible (Frame 7:45)
    separate: 700, // spreading into a row (Frame 7:58)
    rowHold: 600, // short pause before enlarging
    push: 250, // second image nudges the row apart as it starts growing (Frame 7:65)
    fullscreen: 900, // second image grows to cover everything (Frame 7:72)
    fullscreenHold: 1000 // hold on the fullscreen image before it becomes the header
  };

  document.body.classList.add('loading-active');

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
      document.dispatchEvent(new CustomEvent('loading:complete'));
      becomeSiteHeader();
    }, t);
  }

  play();
})();
