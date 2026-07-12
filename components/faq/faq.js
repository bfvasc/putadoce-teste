(function () {
  var list = document.getElementById('faqList');
  if (!list) {
    return;
  }

  // Multiple items can be open at once — each toggle is independent.
  list.addEventListener('click', function (event) {
    var button = event.target.closest('.faq__question');
    if (!button) {
      return;
    }

    var item = button.closest('.faq__item');
    var isOpen = item.classList.toggle('is-open');
    button.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });
})();
