(function () {
  var section = document.getElementById('sobre');
  if (!section) {
    return;
  }

  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          section.classList.add('is-visible');
          io.unobserve(section);
        }
      });
    },
    { threshold: 0.3 }
  );
  io.observe(section);
})();
