import { getAreaHTML, getCityHTML } from './helpers';
import { allCities, data } from './init';
import { $citiesWrapper, $preloader, $selectedWrapper } from './vars';

export function initCities() {
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
