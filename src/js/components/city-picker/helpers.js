import { $cityPicker, TRANSITION_DELAY } from './vars';

export const getCityNodeById = (
  id,
  $parent = document.querySelector('.city-picker__items')
) => $parent.querySelector(`.city-list__item[data-id="${id}"]`);

export const getSelectedNodeById = (id) =>
  document.querySelector(`.selected-list__item[data-id="${id}"]`);

export const getSelectedHTML = (id, name) => `
  <li class="selected-list__item" data-id="${id}">
    <span class="selected-list__name">${name}</span>
    <button class="selected-list__delete" type="button">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z" fill="#A7A7A7"/>
      </svg>
    </button>
  </li>`;

export const getAreaHTML = (id, name, itemClass = '') => `
  <li class="city-list__item${itemClass}" data-id="${id}">
    <div class="city-list__name">${name}</div>
  </li>`;

export const getCityHTML = (id, name, areaName, itemClass = '') => `
  <li class="city-list__item${itemClass}" data-id="${id}">
    <div class="city-list__name">${name}</div>
    <div class="city-list__region">${areaName}</div>
  </li>`;

export const openCityPicker = () => {
  $cityPicker.classList.add('is-active');
  setTimeout(() => $cityPicker.classList.add('is-animated'), TRANSITION_DELAY);
};

export const closeCityPicker = () => {
  $cityPicker.classList.remove('is-animated');
  setTimeout(() => $cityPicker.classList.remove('is-active'), TRANSITION_DELAY);
};
