(function () {
  var section = document.getElementById('decorations');
  var track = document.getElementById('decorationsTrack');
  if (!section || !track) {
    return;
  }

  var prevBtn = section.querySelector('.decorations__arrow--prev');
  var nextBtn = section.querySelector('.decorations__arrow--next');
  var isDesktop = window.matchMedia('(min-width: 641px)');

  function maxScrollLeft() {
    return track.scrollWidth - track.clientWidth;
  }

  function cardStep() {
    var card = track.querySelector('.decorations__card');
    if (!card) {
      return 0;
    }
    var gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    return card.getBoundingClientRect().width + gap;
  }

  function updateArrows() {
    var max = maxScrollLeft();
    prevBtn.classList.toggle('is-disabled', track.scrollLeft <= 1);
    nextBtn.classList.toggle('is-disabled', track.scrollLeft >= max - 1);
  }

  prevBtn.addEventListener('click', function () {
    track.scrollBy({ left: -cardStep(), behavior: 'smooth' });
  });

  nextBtn.addEventListener('click', function () {
    track.scrollBy({ left: cardStep(), behavior: 'smooth' });
  });

  track.addEventListener('scroll', updateArrows);
  window.addEventListener('resize', updateArrows);

  // Mouse-drag-to-scroll. Touch devices already get native horizontal
  // panning from overflow-x: auto, so this only engages for mouse
  // pointers to avoid fighting the browser's own touch scrolling.
  var isDragging = false;
  var dragMoved = false;
  var startX = 0;
  var startScrollLeft = 0;

  track.addEventListener('pointerdown', function (event) {
    if (event.pointerType !== 'mouse') {
      return;
    }
    isDragging = true;
    dragMoved = false;
    startX = event.clientX;
    startScrollLeft = track.scrollLeft;
    track.classList.add('is-dragging');
    track.setPointerCapture(event.pointerId);
  });

  track.addEventListener('pointermove', function (event) {
    if (!isDragging) {
      return;
    }
    var dx = event.clientX - startX;
    if (Math.abs(dx) > 4) {
      dragMoved = true;
    }
    track.scrollLeft = startScrollLeft - dx;
  });

  function endDrag() {
    if (!isDragging) {
      return;
    }
    isDragging = false;
    track.classList.remove('is-dragging');
  }

  track.addEventListener('pointerup', endDrag);
  track.addEventListener('pointercancel', endDrag);
  track.addEventListener('pointerleave', endDrag);

  // Swallow the click that would otherwise fire on a "Pedir no Goomer"
  // link right after a drag, so dragging the carousel doesn't
  // accidentally navigate.
  track.addEventListener(
    'click',
    function (event) {
      if (dragMoved) {
        event.preventDefault();
        event.stopPropagation();
        dragMoved = false;
      }
    },
    true
  );

  // Scroll-jacking: while the section is roughly centered in the
  // viewport, wheel input first drives the carousel horizontally.
  // Once the carousel has reached the start/end in the scroll
  // direction, the wheel event is left alone so the page resumes its
  // normal vertical scroll. Desktop-only — on mobile the carousel
  // already scrolls natively via touch, and hijacking wheel input
  // there would fight the page's normal touch scroll.
  function isEngaged() {
    var rect = section.getBoundingClientRect();
    var vh = window.innerHeight;
    return rect.top < vh * 0.6 && rect.bottom > vh * 0.4;
  }

  function onWheel(event) {
    if (!isDesktop.matches || !isEngaged()) {
      return;
    }
    var max = maxScrollLeft();
    var goingForward = event.deltaY > 0;
    var atStart = track.scrollLeft <= 0;
    var atEnd = track.scrollLeft >= max - 1;

    if ((goingForward && atEnd) || (!goingForward && atStart)) {
      return;
    }

    event.preventDefault();
    track.scrollLeft += event.deltaY;
  }

  window.addEventListener('wheel', onWheel, { passive: false });

  // Entrance animation: cards slide in from the right once the
  // section first enters view.
  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          section.classList.add('is-visible');
          io.unobserve(section);
        }
      });
    },
    { threshold: 0.4 }
  );
  io.observe(section);

  updateArrows();
})();
