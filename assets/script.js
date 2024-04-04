const searchBar = document.querySelector('#citySearch');
const searchBtn = document.querySelector('#searchBtn');
const clearSearchBtn = document.querySelector('#clearSearchBtn');
const cityList = document.querySelector('#cityList');
const weatherBoard = document.querySelector('#weatherBoard');
const APIkey = '31491d9ec3484031a3a213935240304';
const baseUrl = 'http://api.weatherapi.com/v1/'
const clearSearchModalBtn = $('#clearSearchModalBtn');


console.log(`getting weather data from weatherapi.com ${baseUrl}`)

const getCity = function() {
    let city = searchBar.value;
    let cities = JSON.parse(localStorage.getItem('cities'))
    if (!cities){cities=[]}
    if (city == ''){return;}
    
    cities.push(city);
    console.log(cities);
    if (cities.length > 10) {
        cities.shift();
    }
    cities = JSON.stringify(cities)
    localStorage.setItem('cities', cities);
}

const handleSearch = function() {
    getCity();
    searchBar.value = ''
    fetchWeatherData();
    appendRecentCities();
}

document.addEventListener('click', function(event) {
    recentCitySearch(event);
})

const appendRecentCities = function() {
    while (cityList.firstChild) {
        cityList.removeChild(cityList.firstChild);
    }


    let cities = JSON.parse(localStorage.getItem('cities'));
    if (!cities || cities.length === 0) {
        console.log('No recent cities');
        return;
    }
    cities.forEach(city => {
        const newButton = document.createElement('button');
        newButton.classList.add("btn", "btn-secondary", "row-12", "mx-1", "my-1", "recentCityBtn");
        newButton.dataset.city = `${city}`
        newButton.textContent = city;
        cityList.append(newButton);
    });
}

const handleClearSearches = function() {
    
    let cities = JSON.parse(localStorage.getItem('cities'));
        cities=[];
        cities = JSON.stringify(cities);
        localStorage.setItem('cities', cities);
    
}

clearSearchModalBtn.on('click', function(){ 
$( function() {
    $( "#dialog-confirm" ).dialog({
      display: true,
      resizable: false,
      height: "auto",
      width: 400,
      modal: true,
      buttons: {
        "Clear recent searches": function() {
            handleClearSearches();
            appendRecentCities();
          $( this ).dialog( "close" );
        },
        Cancel: function() {
          $( this ).dialog( "close" );
        }
      }
    });
  } );
})

const recentCitySearch = function(event) {
    const cities = JSON.parse(localStorage.getItem('cities'));
    const recentCity = event.target.dataset.city
    console.log(recentCity);

    appendRecentCities();
}

//--------------------------------------Fetch Weather Data--------------------------------------//

// const getWeatherData = function() {
//     let cities = JSON.parse(localStorage.getItem('cities'));
//     const firstCity = cities.length -1;
//     const city = cities[firstCity];
//     console.log('Attempting to fetch weather data from weatherapi.com...')
//     fetchWeatherData();

//     fetch(`https://${baseUrl}current.json?key=${APIkey}&q=${city}`)
//     .then(function (response) {
//         response.json();
//         console.log(response)
//         return response;
//     })
//     .then(function(data){
//         console.log(data);
//     }) 
// }

async function fetchWeatherData() {
    let cities = JSON.parse(localStorage.getItem('cities'));
    const firstCity = cities.length -1;
    const city = cities[firstCity];
    const response = await fetch(`${baseUrl}current.json?key=${APIkey}&q=${city}`);
    const data = await response.json();
    console.log(data);
}



searchBtn.addEventListener('click', function() {
    handleSearch();
    console.log('click')
})

window.onload = function () {appendRecentCities()};
    