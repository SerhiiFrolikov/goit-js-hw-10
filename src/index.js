import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import './css/styles.css';

const DEBOUNCE_DELAY = 300;
let inputValue = '';

const fetchCountryField = document.querySelector("#search-box");
const countryList = document.querySelector(".country-list");
const countryInfo = document.querySelector(".country-info");

fetchCountryField.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(e) {
    e.preventDefault();

    inputValue = e.target.value.trim();
    if (!inputValue) {
        countryList.innerHTML = '';
        countryInfo.innerHTML = '';
        return
    }

    fetchCountries(inputValue)
        .then((name) => {
            console.log(name);
            if (name.length < 2) {
                countryList.innerHTML = '';
                countryInfo.innerHTML = renderCountriesInfo(name);
            } if (name.length > 2 && name.length < 10) {
                countryList.innerHTML = renderCountriesList(name);
                countryInfo.innerHTML = '';
            } if (name.length >= 10) {
                Notify.info('Too many matches found. Please enter a more specific name.');
                countryList.innerHTML = '';
                countryInfo.innerHTML = '';
            }
        })
        .catch((error) => {
            Notify.failure('Oops, there is no country with that name');
            countryList.innerHTML = '';
            countryInfo.innerHTML = '';
        });

};

function renderCountriesList(arr) {
    return arr.map(
        ({ name: { official }, flags: { svg } }) =>
            `<li class="county">
            <img src="${svg}" alt="${official}" width=80px height=80px>
            <h2>${official}</h2>
            </li>`
    ).join('');
};

function renderCountriesInfo(arr) {
    return arr.map(
        ({ name: { official }, flags: { svg }, capital, languages, population }) =>    
        `  <div < class="name-flag"><img src="${svg}" alt="${official}" width=80px height=80px>
            <h2>${official}</h2></div>
            <h2>Capital: ${capital}</h2>
            <h2>Population: ${population}</h2>
            <h2>Languages: ${Object.values(languages)}</h2>
      `).join("");
 };