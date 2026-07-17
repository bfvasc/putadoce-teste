(function () {
  var ITEMS = [
    { label: 'Home', href: 'index.html' },
    { label: 'Portfolio', href: 'portfolio.html' },
    { label: 'Sobre', href: '#' },
    { label: 'Contato', href: '#' }
  ];
  var STAGGER_MS = 70;

  // Vertical layout spec for the fullscreen menu (see
  // updateItemFontSize below): fixed gaps in px, plus the item
  // font-size's own min/max bounds. GAP_TOP is measured below the
  // real nav bar, not from the very top of the viewport.
  var GAP_TOP_PX = 80;
  var GAP_MIDDLE_PX = 80;
  var GAP_BOTTOM_PX = 40;
  var ITEM_FONT_MIN_PX = 28;
  var ITEM_FONT_MAX_PX = 80;

  var MENU_ICON_SVG =
    '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">' +
      '<path d="M3 4h18v2H3V4zm0 7h18v2H3v-2zm0 7h18v2H3v-2z"/>' +
    '</svg>';

  var CLOSE_ICON_SVG =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">' +
      '<path d="M6 6l12 12M18 6L6 18"/>' +
    '</svg>';

  // arrow-link.svg from components/assets/icons/, inlined with
  // fill="currentColor" (the file itself hardcodes #FF2B00) so it
  // renders white against the menu's red background via the
  // .nav-menu__item-icon svg color instead.
  var ARROW_LINK_SVG =
    '<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">' +
      '<path d="M80.0185 47.0711L36.9856 90.104L29.9146 83.033L72.9475 40H35.0186V30H90.0185V85H80.0185V47.0711Z" fill="currentColor" />' +
    '</svg>';

  // instagram.svg / whatsapp.svg from components/assets/icons/, same
  // currentColor treatment as the arrow above.
  var INSTAGRAM_SVG =
    '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
      '<path d="M12.001 8.99994C10.3436 8.99994 9.00098 10.343 9.00098 11.9999C9.00098 13.6572 10.3441 14.9999 12.001 14.9999C13.6583 14.9999 15.001 13.6568 15.001 11.9999C15.001 10.3426 13.6579 8.99994 12.001 8.99994ZM12.001 6.99994C14.7614 6.99994 17.001 9.23704 17.001 11.9999C17.001 14.7604 14.7639 16.9999 12.001 16.9999C9.24051 16.9999 7.00098 14.7628 7.00098 11.9999C7.00098 9.23947 9.23808 6.99994 12.001 6.99994ZM18.501 6.74909C18.501 7.4392 17.9402 7.99911 17.251 7.99911C16.5609 7.99911 16.001 7.43834 16.001 6.74909C16.001 6.05984 16.5617 5.49994 17.251 5.49994C17.9393 5.49907 18.501 6.05984 18.501 6.74909ZM12.001 3.99994C9.5265 3.99994 9.12318 4.00649 7.97227 4.05774C7.18815 4.09455 6.66253 4.20001 6.17416 4.38961C5.74016 4.55793 5.42709 4.75892 5.09352 5.09249C4.75867 5.42734 4.55804 5.73957 4.3904 6.17377C4.20036 6.66326 4.09493 7.18805 4.05878 7.97109C4.00703 9.07514 4.00098 9.46099 4.00098 11.9999C4.00098 14.4744 4.00753 14.8777 4.05877 16.0285C4.0956 16.8123 4.2012 17.3387 4.39034 17.8259C4.5591 18.2605 4.7605 18.5743 5.09246 18.9063C5.42863 19.242 5.74179 19.4433 6.17187 19.6093C6.66619 19.8004 7.19148 19.906 7.97212 19.9421C9.07618 19.9938 9.46203 19.9999 12.001 19.9999C14.4755 19.9999 14.8788 19.9933 16.0296 19.9421C16.8117 19.9054 17.3385 19.7995 17.827 19.6105C18.2604 19.4422 18.5752 19.2401 18.9074 18.9084C19.2436 18.5717 19.4445 18.2593 19.6107 17.8282C19.8013 17.3357 19.9071 16.8097 19.9432 16.0288C19.9949 14.9247 20.001 14.5388 20.001 11.9999C20.001 9.52546 19.9944 9.12215 19.9432 7.97131C19.9064 7.189 19.8005 6.66143 19.6113 6.17312C19.4434 5.74032 19.2417 5.42629 18.9084 5.09249C18.573 4.75709 18.2616 4.55687 17.8271 4.38936C17.338 4.19948 16.8124 4.0939 16.0298 4.05775C14.9258 4.00599 14.5399 3.99994 12.001 3.99994ZM12.001 1.99994C14.7176 1.99994 15.0568 2.00994 16.1235 2.05994C17.1876 2.10911 17.9135 2.27744 18.551 2.52494C19.2101 2.77911 19.7668 3.12244 20.3226 3.67827C20.8776 4.23411 21.221 4.79244 21.476 5.44994C21.7226 6.08661 21.891 6.81327 21.941 7.87744C21.9885 8.94411 22.001 9.28327 22.001 11.9999C22.001 14.7166 21.991 15.0557 21.941 16.1224C21.8918 17.1866 21.7226 17.9124 21.476 18.5499C21.2218 19.2091 20.8776 19.7657 20.3226 20.3216C19.7668 20.8766 19.2076 21.2199 18.551 21.4749C17.9135 21.7216 17.1876 21.8899 16.1235 21.9399C15.0568 21.9874 14.7176 21.9999 12.001 21.9999C9.28431 21.9999 8.94514 21.9899 7.87848 21.9399C6.81431 21.8907 6.08931 21.7216 5.45098 21.4749C4.79264 21.2207 4.23514 20.8766 3.67931 20.3216C3.12348 19.7657 2.78098 19.2066 2.52598 18.5499C2.27848 17.9124 2.11098 17.1866 2.06098 16.1224C2.01348 15.0557 2.00098 14.7166 2.00098 11.9999C2.00098 9.28327 2.01098 8.94411 2.06098 7.87744C2.11014 6.81244 2.27848 6.08744 2.52598 5.44994C2.78014 4.79161 3.12348 4.23411 3.67931 3.67827C4.23514 3.12244 4.79348 2.77994 5.45098 2.52494C6.08848 2.27744 6.81348 2.10994 7.87848 2.05994C8.94514 2.01244 9.28431 1.99994 12.001 1.99994Z" fill="currentColor" />' +
    '</svg>';

  var WHATSAPP_SVG =
    '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
      '<path d="M7.25361 18.4943L7.97834 18.9169C9.18909 19.6229 10.5651 19.9999 12.001 19.9999C16.4193 19.9999 20.001 16.4182 20.001 11.9999C20.001 7.58166 16.4193 3.99994 12.001 3.99994C7.5827 3.99994 4.00098 7.58166 4.00098 11.9999C4.00098 13.4362 4.37821 14.8127 5.08466 16.0237L5.50704 16.7477L4.85355 19.1493L7.25361 18.4943ZM2.00516 21.9999L3.35712 17.0314C2.49494 15.5535 2.00098 13.8344 2.00098 11.9999C2.00098 6.47709 6.47813 1.99994 12.001 1.99994C17.5238 1.99994 22.001 6.47709 22.001 11.9999C22.001 17.5227 17.5238 21.9999 12.001 21.9999C10.1671 21.9999 8.44851 21.5063 6.97086 20.6446L2.00516 21.9999ZM8.39232 7.30827C8.5262 7.29886 8.66053 7.29742 8.79459 7.30396C8.84875 7.30752 8.90265 7.31378 8.95659 7.32001C9.11585 7.3384 9.29098 7.43539 9.34986 7.56888C9.64818 8.2453 9.93764 8.92559 10.2182 9.60957C10.2801 9.76056 10.2428 9.95627 10.125 10.1456C10.0652 10.2427 9.97128 10.3789 9.86248 10.5182C9.74939 10.6629 9.50599 10.929 9.50599 10.929C9.50599 10.929 9.40738 11.0472 9.44455 11.1943C9.45903 11.2499 9.50521 11.3309 9.54708 11.399C9.57027 11.4367 9.5918 11.4704 9.60577 11.4937C9.86169 11.921 10.2057 12.3542 10.6259 12.7615C10.7463 12.8782 10.8631 12.9973 10.9887 13.1079C11.457 13.5208 11.9868 13.8582 12.559 14.1081L12.5641 14.1104C12.6486 14.1468 12.692 14.1667 12.8157 14.2192C12.8781 14.2456 12.9419 14.2684 13.0074 14.2857C13.0311 14.2919 13.0554 14.2954 13.0798 14.2971C13.2415 14.3068 13.335 14.2031 13.3749 14.1554C14.0984 13.2789 14.1646 13.2217 14.1696 13.2221V13.2237C14.2647 13.1235 14.4142 13.0887 14.5476 13.0969C14.6085 13.1006 14.6691 13.1123 14.7245 13.1376C15.2563 13.3802 16.1258 13.7586 16.1258 13.7586L16.7073 14.02C16.8047 14.067 16.8936 14.1777 16.8979 14.2853C16.9005 14.3522 16.9077 14.4602 16.8838 14.6578C16.8525 14.9165 16.7738 15.228 16.6956 15.3912C16.6406 15.5057 16.5694 15.6073 16.4866 15.6933C16.3743 15.8099 16.2909 15.8807 16.1559 15.9813C16.0737 16.0425 16.0311 16.0713 16.0311 16.0713C15.8922 16.1589 15.8139 16.2027 15.6484 16.2908C15.391 16.4279 15.1066 16.5067 14.8153 16.5217C14.6296 16.5312 14.4444 16.5446 14.2589 16.5346C14.2507 16.5341 13.6907 16.4481 13.6907 16.4481C12.2688 16.0741 10.9538 15.3735 9.85034 14.4019C9.62473 14.2033 9.4155 13.9884 9.20194 13.7758C8.31288 12.8907 7.63982 11.9363 7.23169 11.0335C7.03043 10.5883 6.90299 10.1115 6.90098 9.62092C6.89729 9.01399 7.09599 8.42314 7.46569 7.9418C7.53857 7.84691 7.60774 7.74849 7.72709 7.6358C7.85348 7.51645 7.93392 7.45238 8.02057 7.40805C8.13607 7.34896 8.26293 7.31736 8.39232 7.30827Z" fill="currentColor" />' +
    '</svg>';

  function buildMenu() {
    var menuBtn = document.querySelector('.site-header__menu-btn');
    if (!menuBtn) {
      return;
    }

    var drawer = document.createElement('div');
    drawer.className = 'nav-menu__drawer';

    var list = document.createElement('nav');
    list.className = 'nav-menu__list';
    ITEMS.forEach(function (item, index) {
      var link = document.createElement('a');
      link.className = 'nav-menu__item';
      link.href = item.href;
      link.style.transitionDelay = index * STAGGER_MS + 'ms';
      link.innerHTML =
        '<span class="nav-menu__item-text">' + item.label + '</span>' +
        '<span class="nav-menu__item-icon">' + ARROW_LINK_SVG + '</span>';
      list.appendChild(link);
    });

    var social = document.createElement('div');
    social.className = 'nav-menu__social';
    social.style.transitionDelay = ITEMS.length * STAGGER_MS + 'ms';
    social.innerHTML =
      '<a href="#" aria-label="Instagram">' + INSTAGRAM_SVG + '</a>' +
      '<a href="#" aria-label="WhatsApp">' + WHATSAPP_SVG + '</a>';

    drawer.appendChild(list);
    drawer.appendChild(social);
    document.body.appendChild(drawer);

    var isOpen = false;
    var contentTimer = null;

    // Solves for the item font-size that makes the 4 items — their
    // own line-height plus each one's fixed border/padding — plus
    // the three fixed gaps from the spec (GAP_TOP_PX below the nav
    // bar, GAP_MIDDLE_PX above the social row, GAP_BOTTOM_PX below
    // it) add up to exactly the viewport height. A purely
    // width-based fluid size (the old clamp(…vw…)) can't account for
    // this: on a short-but-wide viewport, 4 items at a width-driven
    // size can still be taller than the screen, pushing the social
    // row off-screen — this is measured against actual height
    // instead, every time the menu opens or the window resizes.
    //
    // border-top-width/padding are read via getComputedStyle rather
    // than hardcoded, so this keeps working correctly if
    // .nav-menu__item's own CSS ever changes. The line-height ratio
    // is likewise derived from the *current* rendered font-size/line-
    // height rather than hardcoding "1.1" a second time here, for the
    // same reason.
    function updateItemFontSize() {
      var firstItem = list.querySelector('.nav-menu__item');
      if (!firstItem) {
        return;
      }

      var itemStyle = getComputedStyle(firstItem);
      var currentFontSize = parseFloat(itemStyle.fontSize);
      var lineHeightRatio = parseFloat(itemStyle.lineHeight) / currentFontSize;
      var itemChrome =
        parseFloat(itemStyle.borderTopWidth) +
        parseFloat(itemStyle.paddingTop) +
        parseFloat(itemStyle.paddingBottom);

      var nav = document.querySelector('.site-header__nav');
      var navHeight = nav ? nav.getBoundingClientRect().height : 72;
      var socialHeight = social.getBoundingClientRect().height || 40;
      var viewportHeight = window.innerHeight;

      var available =
        viewportHeight -
        navHeight -
        GAP_TOP_PX -
        GAP_MIDDLE_PX -
        GAP_BOTTOM_PX -
        socialHeight -
        ITEMS.length * itemChrome;

      var fontSize = available / (ITEMS.length * lineHeightRatio);
      fontSize = Math.max(ITEM_FONT_MIN_PX, Math.min(ITEM_FONT_MAX_PX, fontSize));

      drawer.style.setProperty('--nav-menu-item-font-size', fontSize + 'px');
    }

    function setButtonState(open) {
      menuBtn.innerHTML = open
        ? '<span>Fechar</span>' + CLOSE_ICON_SVG
        : '<span>Menu</span>' + MENU_ICON_SVG;
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    }

    function openMenu() {
      isOpen = true;
      updateItemFontSize();
      document.body.classList.add('nav-menu-open');
      drawer.classList.add('is-open');
      setButtonState(true);

      // The content stagger only starts once the drawer has finished
      // sliding in, not alongside it.
      clearTimeout(contentTimer);
      var slideMs = parseFloat(getComputedStyle(drawer).transitionDuration) * 1000 || 400;
      contentTimer = setTimeout(function () {
        drawer.classList.add('is-content-visible');
      }, slideMs);
    }

    function closeMenu() {
      isOpen = false;
      clearTimeout(contentTimer);
      document.body.classList.remove('nav-menu-open');
      drawer.classList.remove('is-open');
      drawer.classList.remove('is-content-visible');
      setButtonState(false);
    }

    function toggleMenu() {
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    }

    menuBtn.addEventListener('click', toggleMenu);
    list.addEventListener('click', function (event) {
      if (event.target.closest('.nav-menu__item')) {
        closeMenu();
      }
    });
    document.addEventListener('keydown', function (event) {
      if (isOpen && event.key === 'Escape') {
        closeMenu();
      }
    });

    // Re-run the height-based font-size calculation on resize (e.g.
    // rotating a phone, or resizing a desktop window) while the menu
    // is open — rAF-debounced so a drag-resize doesn't recalculate
    // on every intermediate event.
    var resizeRaf = null;
    window.addEventListener('resize', function () {
      if (!isOpen) {
        return;
      }
      if (resizeRaf) {
        cancelAnimationFrame(resizeRaf);
      }
      resizeRaf = requestAnimationFrame(updateItemFontSize);
    });
  }

  if (document.getElementById('loadingScreen')) {
    // nav.js's own 'loading:complete' listener (registered first, since
    // nav.js loads before this script) schedules buildNav() via
    // setTimeout(fn, 0). Scheduling ours the same way here queues it
    // right after, so the Menu button already exists once this runs.
    document.addEventListener('loading:complete', function () {
      setTimeout(buildMenu, 0);
    });
  } else {
    // No loading animation on this page — nav.js already built the
    // Menu button synchronously before this script ran (script tags
    // execute in order), so there's nothing to wait for.
    buildMenu();
  }
})();
