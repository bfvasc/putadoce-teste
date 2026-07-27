/* Shared controller for every nav-triggered menu panel -- registers
   each menu's trigger/panel/close-button, owns the one shared dimming
   overlay (components/nav/menu-shared.css) both panels sit above, and
   guarantees only one menu is ever open at a time: opening one closes
   whichever other menu is currently open first, so their two panels
   (each fully independent otherwise -- different sides, different
   content) never show simultaneously. components/nav/cakes-menu.js
   and components/nav/nav-menu.js each just describe their own
   elements and call register() -- the open/close/focus/Escape/overlay
   -click mechanics live here once, instead of being copy-pasted into
   every menu that needs them. */
(function () {
  var overlay = null;
  var activeMenu = null;

  function getOverlay() {
    if (!overlay) {
      overlay = document.getElementById('menuOverlay');
    }
    return overlay;
  }

  function onKeydown(event) {
    if ((event.key === 'Escape' || event.key === 'Esc') && activeMenu) {
      activeMenu.close();
    }
  }

  function onOverlayClick() {
    if (activeMenu) {
      activeMenu.close();
    }
  }

  function register(config) {
    var menu = {
      isOpen: false,
      open: open,
      close: close,
    };

    function open() {
      if (menu.isOpen) {
        return;
      }
      var previous = activeMenu;
      // Claims "active" before closing whatever was open before it --
      // so that menu's own close() (below) sees activeMenu already
      // pointing at this new one and leaves the shared overlay alone,
      // instead of momentarily thinking nothing is open anymore and
      // hiding it mid-handoff.
      activeMenu = menu;
      menu.isOpen = true;
      if (previous && previous !== menu) {
        previous.close();
      }
      config.panel.classList.add('is-open');
      config.panel.setAttribute('aria-hidden', 'false');
      config.trigger.setAttribute('aria-expanded', 'true');
      var ov = getOverlay();
      if (ov) {
        ov.classList.add('is-open');
      }
      document.addEventListener('keydown', onKeydown);
      // Moves focus in immediately rather than waiting for the open
      // transition to finish (apple-design: kill latency on the input
      // path) -- a keyboard/screen-reader user's next Tab press should
      // already land inside the menu.
      config.closeButton.focus();
    }

    function close() {
      if (!menu.isOpen) {
        return;
      }
      menu.isOpen = false;
      if (activeMenu === menu) {
        activeMenu = null;
      }
      config.panel.classList.remove('is-open');
      config.panel.setAttribute('aria-hidden', 'true');
      config.trigger.setAttribute('aria-expanded', 'false');
      var ov = getOverlay();
      // Only actually hides the overlay once no menu wants it anymore
      // -- during a handoff between menus, activeMenu already points
      // at the incoming one by the time this runs (see open() above),
      // so this correctly leaves the overlay showing.
      if (ov && !activeMenu) {
        ov.classList.remove('is-open');
      }
      document.removeEventListener('keydown', onKeydown);
      // Returns focus to whichever control opened this menu, so a
      // keyboard user ends up back where they started instead of on
      // (or inside) a now-hidden panel.
      config.trigger.focus();
    }

    config.trigger.addEventListener('click', open);
    config.closeButton.addEventListener('click', close);

    return menu;
  }

  // nav.js dispatches 'nav:ready' once nav.html's markup (including
  // the shared overlay) actually exists in the DOM -- same handoff
  // components/nav/cakes-menu.js and components/nav/nav-menu.js
  // already wait on before registering their own elements.
  document.addEventListener('nav:ready', function () {
    var ov = getOverlay();
    if (ov) {
      ov.addEventListener('click', onOverlayClick);
    }
  });

  window.PutadoceMenus = { register: register };
})();
