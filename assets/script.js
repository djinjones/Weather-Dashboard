const searchBar = document.querySelector('#citySearch');
const searchBtn = document.querySelector('#searchBtn');
const clearSearchBtn = document.querySelector('#clearSearchBtn');
const cityList = document.querySelector('#cityList');
const weatherBoard = document.querySelector('#weatherBoard');
const APIkey = '31491d9ec3484031a3a213935240304';
const baseUrl = 'http://api.weatherapi.com/v1/'
const clearSearchModalBtn = $('#clearSearchModalBtn');
//const recentBtn = document.querySelector(".recentCityBtn")

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
    fetchWeatherData();
}

const handleSearch = function() {
    getCity();
    searchBar.value = ''
    appendRecentCities();
    
}

const appendRecentCities = function() {
    
    while (cityList.firstChild) {
        cityList.removeChild(cityList.firstChild);
    }

    let cities = JSON.parse(localStorage.getItem('cities'));
    if (!cities || cities.length === 0) {
        console.log('No recent cities');
        return;
    }
    if (cities.length > 10) {
        cities.shift()
    }
    cities.forEach(city => {
        const newButton = document.createElement('button');
        newButton.classList.add("btn", "btn-secondary", "row-12", "mx-1", "my-1", "recentCityBtn");
        newButton.dataset.city = `${city}`
        newButton.textContent = city;
        newButton.addEventListener('click', function(event){
            recentCitySearch(event);
        })
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
    console.log(recentCity)
    if (cities.includes(recentCity)) {
    for (let index = 0; index < cities.length; index++) {
        
        if (cities[index] == recentCity) {
            cities.push(recentCity)
            cities.splice(index, 1)
            localStorage.setItem('cities', JSON.stringify(cities));
            fetchWeatherData();
            appendRecentCities();
            return;
        }} 
    } else {
            cities.push(recentCity);
            fetchWeatherData();
            appendRecentCities();
            return;
        }  
}

const appendWeatherData = function() {
    // things we NEED to display: 
    // current weather conditions: sunny/cloudy, precipitation, temperature, humidity, windspeed
    // an Icon of the sunny/cloudy/rainy etc
    // button for more information that when expanded it shows a 5 day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity

}

//--------------------------------------Fetch Weather Data--------------------------------------//

async function fetchWeatherData() {
    console.log('searching for weather data');
    let cities = JSON.parse(localStorage.getItem('cities'));
    const firstCity = cities.length -1;
    const city = cities[firstCity];
    const response = await fetch(`${baseUrl}current.json?key=${APIkey}&q=${city}`);
    const data = await response.json();

    if (!data.error) {
    console.log(data);
    } else if (data.error.code == 1006) {
        for (let index = 0; index < cities.length; index++) {
            const element = cities[index];
            if (element == city) {
                cities.splice(index, 1)
                localStorage.setItem('cities' ,JSON.stringify(cities))
                appendRecentCities();
            }
        }
        alert(`The city: "${city}" does not exist or could not be found. Please check your spelling and try again.`)
    }
    
}



searchBtn.addEventListener('click', function() {
    handleSearch();
    console.log('click')
})

document.addEventListener("keydown", function(e){
    if (searchBar.value !== '' && e.key == "Enter"){
        handleSearch();
    }
})

window.onload = function () {appendRecentCities()};
    