(function () {
  const $buttonsWrapper = document.querySelector('.menu-tabs__head');

  $buttonsWrapper.addEventListener('click', (e) => {
    $btn = e.target.closest('.menu-tabs__btn');

    if ($btn) {
      const newActiveId = $btn.dataset.id;

      if (!$btn.classList.contains('is-active')) {
        const $activeTab = document.querySelector('.menu-tabs__item.is-active');
        const $activeBtn = document.querySelector('.menu-tabs__btn.is-active');

        if ($activeBtn && $activeTab) {
          $activeTab.classList.remove('is-active');
          $activeBtn.classList.remove('is-active');
        }

        const $newActiveTab = document.querySelector(
          `.menu-tabs__item[data-id="${newActiveId}"]`
        );

        $newActiveTab.classList.add('is-active');
        $btn.classList.add('is-active');
      }
    }
  });
})();
