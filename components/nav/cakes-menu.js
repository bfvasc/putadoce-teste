(function () {
  // nav.js injects nav.html (which contains this menu's markup)
  // asynchronously and dispatches 'nav:ready' right after -- the same
  // event-based handoff pattern js/loading.js already uses for
  // components/nav/nav.js itself (see 'circle-reveal:complete' there),
  // so this file never has to guess whether the fetch has resolved yet.
  document.addEventListener('nav:ready', init, { once: true });

  function init() {
    var menu = document.getElementById('cakesMenu');
    var overlay = document.getElementById('cakesMenuOverlay');
    var trigger = document.getElementById('cakesMenuTrigger');
    var closeButton = document.getElementById('cakesMenuClose');

    if (!menu || !overlay || !trigger || !closeButton) {
      return;
    }

    var isOpen = false;

    function openMenu() {
      if (isOpen) {
        return;
      }
      isOpen = true;
      menu.classList.add('is-open');
      menu.setAttribute('aria-hidden', 'false');
      trigger.setAttribute('aria-expanded', 'true');
      document.addEventListener('keydown', onKeydown);
      // Moves focus in immediately rather than waiting for the open
      // transition to finish -- a keyboard/screen-reader user's next
      // Tab press should already land inside the menu, not stall on
      // the animation (apple-design: kill latency on the input path).
      closeButton.focus();
    }

    function closeMenu() {
      if (!isOpen) {
        return;
      }
      isOpen = false;
      menu.classList.remove('is-open');
      menu.setAttribute('aria-hidden', 'true');
      trigger.setAttribute('aria-expanded', 'false');
      document.removeEventListener('keydown', onKeydown);
      // Returns focus to the control that opened the menu, so a
      // keyboard user ends up back where they started instead of on
      // (or inside) an now-hidden panel.
      trigger.focus();
    }

    function onKeydown(event) {
      if (event.key === 'Escape' || event.key === 'Esc') {
        closeMenu();
      }
    }

    // The overlay is a plain sibling of the panel, not an ancestor it
    // sits behind -- clicking anywhere on the panel itself never
    // reaches this listener, so no target-checking is needed to tell
    // "clicked outside" from "clicked inside." Because the overlay
    // sits above the hero in stacking order (see cakes-menu.css) while
    // the menu is open, the click also never reaches anything behind
    // it (no cake-switching, nothing else on the page reacts).
    trigger.addEventListener('click', openMenu);
    closeButton.addEventListener('click', closeMenu);
    overlay.addEventListener('click', closeMenu);
  }
})();
