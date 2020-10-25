/*import * as data from './listCities.json';
const { cities } = data;
console.log(cities);
*/
/*
const cities = [];
fetch('./JS/listCities.json')
    .then(response => response.json())
    //.then(obj => console.log(obj))
    //.then(data => cities.push(...data))
    //.then(blob => console.log(blob))
    //.then(blob => blob.json())
    .then(data => console.log(data))
    .then(data => cities.push(...data))
*/
const cities = [];

function getCities() {
    fetch('./JS/listCities.json')
        .then(blob => blob.json())
        .then(data => {
            console.log(data)
            setCities(data)
            return data;
        })
        .catch(err => console.log(err));
}

function setCities(data) {
    this.cities = data;
}
getCities();
console.log(cities);