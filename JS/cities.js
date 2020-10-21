/*import * as data from './listCities.json';
const { cities } = data;
console.log(cities);
*/
fetch('./listCities.json')
    .then(response => response.json())
    .then(obj => console.log(obj))