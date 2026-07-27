(function () {
  // Same event-based handoff as components/nav/cakes-menu.js: nav.js
  // injects nav.html (which contains this menu's markup) and
  // dispatches 'nav:ready' right after, so this file never has to
  // guess whether the fetch has resolved yet.
  document.addEventListener('nav:ready', init, { once: true });

  function init() {
    var panel = document.getElementById('navMenu');
    var trigger = document.getElementById('navMenuTrigger');
    var closeButton = document.getElementById('navMenuClose');

    if (!panel || !trigger || !closeButton || !window.PutadoceMenus) {
      return;
    }

    // The open/close/focus/Escape/overlay-click mechanics, and the
    // "only one menu open at a time" rule shared with the "Bolos"
    // cakes menu, live in components/nav/menu-shared.js rather than
    // duplicated here.
    window.PutadoceMenus.register({ panel: panel, trigger: trigger, closeButton: closeButton });
  }
})();
