import { getAreaHTML, getCityHTML, getSelectedNodeById } from './helpers';
import { allCities } from './init';
import { $citiesWrapper } from './vars';

export function initSearch() {
  const $search = document.querySelector('.city-picker__search');
  const $searchInput = $search.querySelector('.city-picker__input');
  const $searchClear = $search.querySelector('.city-picker__clear');
  const $searchResults = document.querySelector('.city-picker__results');

  let prevSearchValue = '';

  function searchHandler(e) {
    const value = e.target.value.trim().toLowerCase();

    // исключаем одновременное выполнение событий change и click если значение не изменилось
    if (value === prevSearchValue) return;

    prevSearchValue = value;

    if (value !== '') {
      document.querySelector('.results-list')?.remove();

      const $resultList = document.createElement('ul');
      $resultList.classList.add('results-list');
      $resultList.classList.add('city-list');

      $search.classList.add('is-active');

      const allCitiesArrayHTML = allCities.map((item) => {
        const extraClass = getSelectedNodeById(item.id) ? ' is-active' : '';

        if (item.name.toLowerCase().search(value) === -1) {
          return null;
        } else {
          const str = item.name;
          const itemNameHTML = insertMark(
            str,
            item.name.toLowerCase().search(value),
            value.length
          );

          return !item.type
            ? getCityHTML(item.id, itemNameHTML, item.areaName, extraClass)
            : getAreaHTML(item.id, itemNameHTML, extraClass);
        }
      });

      let html = '';

      allCitiesArrayHTML.forEach((item) => {
        if (item) {
          html += item;
        }
      });

      $citiesWrapper.classList.add('is-hidden');
      $searchResults.insertAdjacentElement('afterbegin', $resultList);
      $resultList.insertAdjacentHTML('afterbegin', html);
    } else {
      document.querySelector('.results-list').remove();
      $citiesWrapper.classList.remove('is-hidden');
    }
  }

  function showAllCities() {
    $search.classList.remove('is-active');

    document.querySelector('.results-list').remove();
    $citiesWrapper.classList.remove('is-hidden');
  }

  function insertMark(str, pos, len) {
    return (
      str.slice(0, pos) +
      '<mark>' +
      str.slice(pos, pos + len) +
      '</mark>' +
      str.slice(pos + len)
    );
  }

  $searchInput.addEventListener('input', searchHandler);
  $searchInput.addEventListener('change', searchHandler);

  $searchClear.addEventListener('click', (e) => {
    showAllCities();
    $searchInput.value = '';
  });
}
