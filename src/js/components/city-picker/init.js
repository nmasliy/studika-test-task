import axios from 'axios';
import { selectCityHandler, toggleCitySelect } from './select-city';
import {
  getAreaHTML,
  getCityNodeById,
  getCityHTML,
  getSelectedNodeById,
} from './helpers';
import {
  $citiesWrapper,
  $cityPicker,
  $preloader,
  $resultsWrapper,
  $selectedWrapper,
} from './vars';

export const allCities = [];
export let data = [];

function initCities() {
  let citiesHTML = '';

  const $cityList = document.createElement('ul');
  $cityList.classList.add('city-list');

  const $selectedList = document.createElement('ul');
  $selectedList.classList.add('selected-list');

  $citiesWrapper.insertAdjacentElement('afterbegin', $cityList);
  $selectedWrapper.insertAdjacentElement('afterbegin', $selectedList);

  data.forEach((area) => {
    const areaData = {
      id: area.id,
      name: area.name,
      type: area.type,
    };

    allCities.push(areaData);

    citiesHTML += getAreaHTML(areaData.id, areaData.name);

    if (area.cities) {
      area.cities.forEach((city) => {
        const cityData = {
          id: city.id,
          name: city.name,
          areaName: area.name,
        };

        allCities.push(cityData);

        citiesHTML += getCityHTML(
          cityData.id,
          cityData.name,
          cityData.areaName
        );
      });
    }
  });

  $preloader.remove();
  $citiesWrapper
    .querySelector('ul')
    .insertAdjacentHTML('afterbegin', citiesHTML);
}

function initSearch() {
  const $search = document.querySelector('.city-picker__search');
  const $searchInput = $search.querySelector('.city-picker__input');
  const $searchClear = $search.querySelector('.city-picker__clear');
  const $searchResults = document.querySelector('.city-picker__results');

  let prevSearchValue = '';

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
  // TODO: баг: при удалении дублируется selected item
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
        const extraClass = getSelectedNodeById(item.id) ? ' is-active' : ''; // if it's selected item

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

  $searchInput.addEventListener('input', searchHandler);
  $searchInput.addEventListener('change', searchHandler);

  $searchClear.addEventListener('click', (e) => {
    showAllCities();
    $searchInput.value = '';
  });
}

function initListeners() {
  $selectedWrapper.addEventListener('click', (e) => {
    const $deleteBtn = e.target.closest('.selected-list__delete');

    if ($deleteBtn) {
      const currentItem = getCityNodeById(
        $deleteBtn.closest('.selected-list__item').dataset.id,
        $selectedWrapper
      );

      toggleCitySelect(currentItem);
    }
  });

  $citiesWrapper.addEventListener('click', selectCityHandler);
  $resultsWrapper.addEventListener('click', selectCityHandler);

  window.addEventListener('click', (e) => {
    if (
      !e.target.closest('.city-picker') &&
      !e.target.closest('.selected-list__delete')
    ) {
      $cityPicker.classList.remove('is-active');
    } else if (e.target.closest('.city-picker__head')) {
      $cityPicker.classList.toggle('is-active');

      if (!data.length) {
        axios('https://studika.ru/api/areas', {
          method: 'POST',
        })
          .then((response) => {
            data = response.data;
            initCities();
            initSearch();
          })
          .catch((err) => console.log(err));
      }
    }
  });
}

initListeners();