import PerfectScrollbar from 'perfect-scrollbar';

const $scrollbarContainers = document.querySelectorAll('.perfect-scrollbar');

$scrollbarContainers.forEach(($scrollbar) => {
  new PerfectScrollbar($scrollbar, { minScrollbarLength: 50 });
});
