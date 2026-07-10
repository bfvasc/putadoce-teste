(function () {
  var screen = document.getElementById('loadingScreen');
  var replayButton = document.getElementById('replayButton');

  var TIMING = {
    stackHold: 500, // stacked, only the top image visible (Frame 7:45)
    separate: 700, // spreading into a row (Frame 7:58)
    rowHold: 600, // short pause before enlarging
    push: 250, // second image nudges the row apart as it starts growing (Frame 7:65)
    fullscreen: 900, // second image grows to cover everything (Frame 7:72)
    fullscreenHold: 1000 // hold on the fullscreen image
  };

  var timers = [];

  function schedule(fn, delay) {
    timers.push(setTimeout(fn, delay));
  }

  function clearSchedule() {
    timers.forEach(clearTimeout);
    timers.length = 0;
  }

  function resetInstantly() {
    screen.classList.add('no-transition');
    screen.classList.remove('is-row', 'is-push', 'is-fullscreen');
    // Force reflow so the next transition re-enables cleanly.
    void screen.offsetWidth;
    screen.classList.remove('no-transition');
  }

  function play() {
    clearSchedule();
    resetInstantly();

    var t = TIMING.stackHold;
    schedule(function () {
      screen.classList.add('is-row');
    }, t);

    t += TIMING.separate + TIMING.rowHold;
    schedule(function () {
      screen.classList.add('is-push');
    }, t);

    t += TIMING.push;
    schedule(function () {
      screen.classList.add('is-fullscreen');
    }, t);

    t += TIMING.fullscreen + TIMING.fullscreenHold;
    schedule(function () {
      screen.dispatchEvent(new CustomEvent('loading:complete'));
      play(); // loop for easy review; drop this call when wiring into the real homepage
    }, t);
  }

  replayButton.addEventListener('click', play);

  play();
})();
