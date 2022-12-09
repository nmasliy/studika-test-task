import axios from 'axios';

const $preloader = document.querySelector('.city-picker__preloader');
const $citiesWrapper = document.querySelector('.city-picker__items');
const $selectedWrapper = document.querySelector('.city-picker__selected');
const $cityPicker = document.querySelector('.city-picker');
const $resultsWrapper = document.querySelector('.city-picker__results');

const getCityById = (id) => {
  const city = document.querySelector(`.city-list__item[data-id="${id}"]`);

  console.log(city);

  if (!city.classList.contains('is-hidden')) {
    return city;
  }
};
const getSelectedById = (id) => document.querySelector(`.city-picker__selected li[data-id="${id}"]`);
const getAreaHTML = (item, itemExtraClass = '') => `
  <li class="city-list__item${itemExtraClass}" data-id="${item.id}">
    <div class="city-list__name">${item.name}</div>
  </li>`;
const getCityHTML = (item, itemExtraClass ='') => `
  <li class="city-list__item${itemExtraClass}" data-id="${item.id}">
    <div class="city-list__name">${item.name}</div>
    <div class="city-list__region">${item.areaName}</div>
  </li>`;

const allCities = []
let data = [];

function initCities() {
  let citiesHTML = '';

  const $cityList = document.createElement('ul');
  $cityList.classList.add('city-list');

  const $selectedList = document.createElement('ul');
  $selectedList.classList.add('selected-list');

  $citiesWrapper.insertAdjacentElement('afterbegin', $cityList);
  $selectedWrapper.insertAdjacentElement('afterbegin', $selectedList);

  data.forEach(area => {

    const areaData = {
      id: area.id,
      name: area.name,
      type: area.type
    };

    allCities.push(areaData);

    citiesHTML += getAreaHTML(areaData);

    if (area.cities) {
      area.cities.forEach(city => {

        const cityData = {
          id: city.id,
          name: city.name,
          areaName: area.name
        };

        allCities.push(cityData);

        citiesHTML += getCityHTML(cityData);
      })
    }

  })

  $preloader.remove();
  $citiesWrapper.querySelector('ul').insertAdjacentHTML('afterbegin', citiesHTML);
}

function toggleCitySelect($listItem) {
  const $selectedCitiesList = document.querySelector('.selected-list');
  const itemText = $listItem.querySelector('.city-list__name').textContent;

  if ($listItem.classList.contains('is-active')) {
    $listItem.classList.remove('is-active');

    const currentElementInList = getSelectedById($listItem.dataset.id);
    currentElementInList?.remove();

  } else {
    $listItem.classList.add('is-active');

    const selectedElementHTML = `
      <li class="selected-list__item" data-id="${$listItem.dataset.id}">
        <span class="selected-list__name">${itemText}</span>
        <button class="selected-list__delete" type="button">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z" fill="#A7A7A7"/>
          </svg>
        </button>
      </li>
    `;

    $selectedCitiesList.insertAdjacentHTML('beforeend', selectedElementHTML);
  }
}

function initSearch() {
  const $search = document.querySelector('.city-picker__search');
  const $searchInput = $search.querySelector('.city-picker__input');
  const $searchClear = $search.querySelector('.city-picker__clear');
  const $searchResults = document.querySelector('.city-picker__results');
  const $cityListNames = document.querySelectorAll('.city-list__name');

  let prevSearchValue = '';

  function showAllCities() {
    $search.classList.remove('is-active');

    $cityListNames.forEach($item => {
      const $itemParent = $item.closest('.city-list__item');

      $itemParent.classList.remove('is-hidden');
      $item.innerHTML = $item.innerText;
    })
  }

  function insertMark(str, pos, len) {
    return str.slice(0, pos) + '<mark>' + str.slice(pos, pos + len) + '</mark>' + str.slice(pos + len)
  }

  function searchHandler(e) {
    const value = e.target.value.trim().toLowerCase();

    if (value == prevSearchValue) return; // исключаем одновременное выполнение событий change и click если значение не изменилось

    prevSearchValue = value;
    
    if (value !== '') {
      const $resultList = document.createElement('ul');
      $resultList.classList.add('results-list');
      $resultList.classList.add('city-list');

      $search.classList.add('is-active');

      const allCitiesArrayHTML = allCities.map(item => {
        const extraClass = getSelectedById(item.id) ? ' is-active' : ''; // if it's selected item

        return (!item.type ? getCityHTML(item, extraClass) : getAreaHTML(item, extraClass))
      })

      let html = '';

      allCitiesArrayHTML.forEach(item => {
        html += item;
      })

      $citiesWrapper.classList.add('is-hidden');
      $searchResults.insertAdjacentElement('afterbegin',  $resultList);
      $resultList.insertAdjacentHTML('afterbegin', html);
    } else {
      $citiesWrapper.classList.remove('is-hidden');
      document.querySelector('.results-list').remove();
      // $search.classList.add('is-active');

      // $cityListNames.forEach($item => {
      //   const $itemParent = $item.closest('.city-list__item');

      //   $itemParent.classList.remove('is-hidden');
      //   $item.innerHTML = $item.innerText;
      // })
    }
  }

  function searchHandlerOld(e) {
    const val = e.target.value.trim().toLowerCase();

    if (val !== '') {
      $search.classList.add('is-active');

      $cityListNames.forEach($item => {
        const $itemParent = $item.closest('.city-list__item')

        if ($item.innerText.toLowerCase().search(val) === -1) {
          $itemParent.classList.add('is-hidden');
          $item.innerHTML = $item.innerText;
        } else {
          $itemParent.classList.remove('is-hidden');
          const str = $item.innerText;
          $item.innerHTML = insertMark(str, $item.innerText.toLowerCase().search(val), val.length);
        }
      })
    } else {
      $search.classList.add('is-active');

      $cityListNames.forEach($item => {
        const $itemParent = $item.closest('.city-list__item');

        $itemParent.classList.remove('is-hidden');
        $item.innerHTML = $item.innerText;
      })
    }
  }

  $searchInput.addEventListener('input', searchHandler);
  $searchInput.addEventListener('change', searchHandler);

  $searchClear.addEventListener('click', (e) => {
    showAllCities();
    $searchInput.value = '';
  });
}

function selectCityHandler(e) {
  const $cityListItem = e.target.closest('.city-list__item');

  console.log(e.target)

  if ($cityListItem) {
    toggleCitySelect($cityListItem);
  }
}

function initListeners() {
  $selectedWrapper.addEventListener('click', (e) => {
    const $deleteBtn = e.target.closest('.selected-list__delete');

    if ($deleteBtn) {
      const currentItem = getCityById($deleteBtn.closest('.selected-list__item').dataset.id);
      
      toggleCitySelect(currentItem);
    }
  })

  $citiesWrapper.addEventListener('click', selectCityHandler);
  $resultsWrapper.addEventListener('click', selectCityHandler);

  window.addEventListener('click', (e) => {
    if (!e.target.closest('.city-picker') && !e.target.closest('.selected-list__delete')) {
      $cityPicker.classList.remove('is-active');
    } else if (e.target.closest('.city-picker__head')) {
      $cityPicker.classList.toggle('is-active');

      if (!data.length) {
        axios('https://studika.ru/api/areas', {
          method: 'POST',
        }).then((response) => {
          data = response.data;
          initCities();
          initSearch();
        })
          .catch(err => console.log(err));
      }
    }
  })
}

initListeners();

