(function () {
  var screen = document.getElementById('loadingScreen');

  var TIMING = {
    stackHold: 500, // stacked, only the top image visible (Frame 7:45)
    separate: 700, // spreading into a row (Frame 7:58)
    rowHold: 600, // short pause before enlarging
    push: 250, // second image nudges the row apart as it starts growing (Frame 7:65)
    fullscreen: 900, // second image grows to cover everything (Frame 7:72)
    fullscreenHold: 1000, // hold on the fullscreen image
    fadeOut: 500 // fade the whole overlay away once loading is complete
  };

  document.body.classList.add('loading-active');

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
      screen.dispatchEvent(new CustomEvent('loading:complete'));
      screen.classList.add('is-done');

      setTimeout(function () {
        screen.remove();
        document.body.classList.remove('loading-active');
      }, TIMING.fadeOut);
    }, t);
  }

  play();
})();
