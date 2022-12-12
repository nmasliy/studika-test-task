(function () {
  const $html = document.querySelector('html');
  const $menu = document.querySelector('.header__menu');
  const $burger = document.querySelector('.header__burger');
  const $close = document.querySelector('.menu__close');
  const $overlay = document.querySelector('.header__overlay');
  const $menuItems = document.querySelectorAll('.header__nav li a');
  const TRANSITION_DELAY = 400;
  const MOBILE_MENU_BREAKPOINT = 1024;

  let isInit = false;

  const checkScreenWidth = () => {
    // Активируем меню только на экранах <= 1024
    if ($menu && window.innerWidth <= MOBILE_MENU_BREAKPOINT && !isInit) {
      isInit = true;
      $burger.addEventListener('click', toggleMenu);
      $close.addEventListener('click', closeMenu);
      $overlay.addEventListener('click', closeMenu);
      $menuItems.forEach((el) => {
        el.addEventListener('click', closeMenu);
      });
    } else {
      window.addEventListener('resize', checkScreenWidth);
    }
  };
  checkScreenWidth();

  function openMenu() {
    $overlay.style.display = 'block';
    $menu.style.display = 'block';
    $burger.setAttribute('aria-expanded', 'true');
    $burger.setAttribute('aria-label', 'Закрыть меню');

    $html.classList.add('disable-scroll');

    setTimeout(function () {
      $overlay.classList.add('is-active');
      $menu.classList.add('is-active');
      $burger.classList.add('is-active');
    }, 1);
  }

  function closeMenu() {
    $overlay.classList.remove('is-active');
    $menu.classList.remove('is-active');
    $burger.classList.remove('is-active');
    $burger.setAttribute('aria-expanded', 'false');
    $burger.setAttribute('aria-label', 'Открыть меню');

    $html.classList.remove('disable-scroll');

    setTimeout(function () {
      $overlay.style.display = '';
      $menu.style.display = '';
    }, TRANSITION_DELAY);
  }

  function toggleMenu() {
    $menu.classList.contains('is-active') ? closeMenu() : openMenu();
  }
})();
