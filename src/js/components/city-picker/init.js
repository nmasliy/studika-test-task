import axios from 'axios';
import { selectCity, selectCityHandler } from './select-city';
import { closeCityPicker, openCityPicker } from './helpers';
import {
  $citiesWrapper,
  $cityPicker,
  $resultsWrapper,
  $saveBtn,
  $selectedWrapper,
} from './vars';
import { initSearch } from './search';
import { initCities } from './cities';

export const allCities = [];
export let data = [];

export function initCityPicker() {
  $saveBtn.addEventListener('click', (e) => {
    e.preventDefault();

    const $savedCities = document.querySelectorAll('.selected-list__item');

    if ($savedCities.length > 0) {
      const savedCitiesData = [];

      $savedCities.forEach(($item) => {
        savedCitiesData.push({
          name: $item.querySelector('.selected-list__name').textContent,
          id: $item.dataset.id,
        });
      });

      console.log('Send data: ');
      console.log(savedCitiesData);
    }
  });

  $selectedWrapper.addEventListener('click', (e) => {
    const $deleteBtn = e.target.closest('.selected-list__delete');

    if ($deleteBtn) {
      const id = $deleteBtn.closest('.selected-list__item').dataset.id;
      selectCity(id);
    }
  });

  $citiesWrapper.addEventListener('click', selectCityHandler);
  $resultsWrapper.addEventListener('click', selectCityHandler);

  window.addEventListener('click', (e) => {
    if (!e.target.closest('.city-picker')) closeCityPicker();
    else if (e.target.closest('.city-picker__head')) {
      $cityPicker.classList.contains('is-active')
        ? closeCityPicker()
        : openCityPicker();

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
