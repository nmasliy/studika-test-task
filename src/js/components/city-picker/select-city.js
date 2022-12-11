import {
  getCityNodeById,
  getSelectedNodeById,
  getSelectedHTML,
} from './helpers';

import { $resultsWrapper, TRANSITION_DELAY } from './vars';

export function selectCity(id, isSetActive) {
  const $city = getCityNodeById(id);
  const $selectedCityList = document.querySelector('.selected-list');
  const name = $city.querySelector('.city-list__name').textContent;

  if (isSetActive) {
    getCityNodeById(id).classList.add('is-active'); // Делаем активным эл. в .city-picker__items
    getCityNodeById(id, $resultsWrapper)?.classList.add('is-active'); // Делаем активным эл. в .city-picker__results

    $selectedCityList.insertAdjacentHTML(
      'beforeend',
      getSelectedHTML(id, name)
    );
  } else {
    getCityNodeById(id).classList.remove('is-active'); // Убираем активность эл. в .city-picker__items
    getCityNodeById(id, $resultsWrapper)?.classList.remove('is-active'); // Убираем активность эл. в .city-picker__results

    removeSelectedElement(getSelectedNodeById(id));
  }
}

export function selectCityHandler(e) {
  const $cityListItem = e.target.closest('.city-list__item');

  if ($cityListItem) {
    $cityListItem.classList.contains('is-active')
      ? selectCity($cityListItem.dataset.id)
      : selectCity($cityListItem.dataset.id, true);
  }
}

function removeSelectedElement($element) {
  $element.classList.add('is-fade-out');

  setTimeout(() => $element.remove(), TRANSITION_DELAY);
}
