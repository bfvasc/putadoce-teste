(function () {
  // nav.js injects nav.html (which contains this menu's markup)
  // asynchronously and dispatches 'nav:ready' right after -- the same
  // event-based handoff pattern js/loading.js already uses for
  // components/nav/nav.js itself (see 'circle-reveal:complete' there),
  // so this file never has to guess whether the fetch has resolved yet.
  document.addEventListener('nav:ready', init, { once: true });

  function init() {
    var panel = document.getElementById('cakesMenu');
    var trigger = document.getElementById('cakesMenuTrigger');
    var closeButton = document.getElementById('cakesMenuClose');

    if (!panel || !trigger || !closeButton || !window.PutadoceMenus) {
      return;
    }

    // The actual open/close/focus/Escape/overlay-click mechanics, and
    // the "only one menu open at a time" rule, live in
    // components/nav/menu-shared.js -- shared with the site nav menu
    // (components/nav/nav-menu.js) rather than duplicated here.
    window.PutadoceMenus.register({ panel: panel, trigger: trigger, closeButton: closeButton });
  }
})();
