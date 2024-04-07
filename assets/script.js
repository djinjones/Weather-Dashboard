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
    appendWeatherData();
}

const handleClearSearches = function() {
    
    let cities = JSON.parse(localStorage.getItem('cities'));
        cities=[];
        cities = JSON.stringify(cities);
        localStorage.setItem('cities', cities);
    
}

// This was a jquery function i found for the modal
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
            return;
        }} 
    } else {
            cities.push(recentCity);
            localStorage.setItem('cities', JSON.stringify(cities));
            fetchWeatherData();
            return;
        }  
}

const appendWeatherData = function() {
    const weatherData = JSON.parse(localStorage.getItem('currentWeather'));
    while (weatherBoard.firstChild) {
        weatherBoard.removeChild(weatherBoard.firstChild);
    }
    // things we NEED to display: 
    // current weather conditions: sunny/cloudy, precipitation, temperature, humidity, windspeed + one more item
    // an Icon of the sunny/cloudy/rainy etc
    // button for more information that when expanded it shows a 5 day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
    const hero = document.createElement('div');
    const extraInfo = document.createElement('div');
    const exactLocation = document.createElement('p');
    const temperature = document.createElement('h2');
    const weatherIcon = document.createElement('img');
    const condition = document.createElement('p');
    const feelsLike = document.createElement('p')
    const humidity = document.createElement('p');
    const windSpeed = document.createElement('p');
    //const localTime = document.createElement('p').classList.add("container custom-box local-time");
    const windDirection = document.createElement('p');
    const fiveDayForecast = document.createElement('h2');

    hero.classList.add("container-md","custom-hero", "col-4");
    extraInfo.classList.add("container-md","extra-info-box", "col-2");
    exactLocation.classList.add("container", "custom-main-box", "custom-location")
    temperature.classList.add("container","custom-main-box");
    weatherIcon.classList.add("container","custom-main-box","weather","weather-icon");
    condition.classList.add("container","custom-main-box","weather");
    feelsLike.classList.add("container","custom-main-box","weather");
    humidity.classList.add("container","custom-box","humidity");
    windSpeed.classList.add("container","custom-box","wind-speed");
    windDirection.classList.add("custom-box","wind-direction");
    fiveDayForecast.classList.add("row", "fiveDayForecastH2");
    
    exactLocation.textContent = weatherData.location.name + ", " + weatherData.location.region
    temperature.textContent = Math.floor(weatherData.current.temp_f)+ "°F";
    weatherIcon.setAttribute('src',weatherData.current.condition.icon);
    condition.textContent = weatherData.current.condition.text;
    feelsLike.textContent = "Feels like: " + Math.floor(weatherData.current.feelslike_f) + "°F";
    humidity.textContent = weatherData.current.humidity + "% humidity";
    windSpeed.textContent = weatherData.current.gust_mph + "mph gusts";
    windDirection.textContent = "Wind coming from: " + weatherData.current.wind_dir;
    fiveDayForecast.textContent = "5 day forecast"
    
    
    windSpeed.append(windDirection);
    
    hero.append(exactLocation, weatherIcon, temperature, feelsLike, condition, humidity, windSpeed,);
    
    extraInfo.append(fiveDayForecast);
    weatherBoard.append(hero, extraInfo)
    appendFiveDay(weatherData);
}

const appendFiveDay = function(weatherData) {
    const forecasts = weatherData.forecast.forecastday
    const extraInfo = document.querySelector('.extra-info-box')
    forecasts.forEach(forecast => {
    const newDay = document.createElement('div');
    const newTemp = document.createElement('p');
    const newImg = document.createElement('img');
    const newWindSpeed = document.createElement('p');
    const newHumidity = document.createElement('p');
    const newDate = document.createElement('p');
    newTemp.textContent ='Low: ' + forecast.day.mintemp_f + '° | High: ' + forecast.day.maxtemp_f + '°';
    newImg.setAttribute('src', forecast.day.condition.icon);
    newWindSpeed.textContent = 'Gusts up to: ' + Math.floor(forecast.day.maxwind_mph/3);
    newHumidity.textContent = forecast.day.avghumidity + '% humidity'
    newDate.textContent = dayjs(forecast.date).format('dddd');
    newDate.classList.add('newDate')
    newDay.classList.add('smallWeatherBox')
    newDay.append(newImg, newTemp, newWindSpeed, newHumidity, newDate);
    extraInfo.append(newDay)

    });
}

//--------------------------------------Fetch Weather Data--------------------------------------//
// I used a different weather API because i forgot that one was already provideda
async function fetchWeatherData() {
    console.log('searching for weather data...');
    let cities = JSON.parse(localStorage.getItem('cities'));
    const firstCity = cities.length -1;
    const city = cities[firstCity];
    const current = 'forecast.json'
    const APIurl = `${baseUrl}${current}?key=${APIkey}&q=${city}&days=5`
    const response = await fetch(APIurl);
    const data = await response.json();
    localStorage.setItem('currentWeather', JSON.stringify(data))
//    fetchFiveDay(city);
    if (!data.error) {
    console.log(data);
    appendRecentCities();
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

// async function fetchFiveDay(city) {
//     const current = 'forecast.json';
//     const response = await fetch(`${baseUrl}${current}?key=${APIkey}&q=${city}&days=5`) ;
//     const data = await response.json();
//     const fiveDay = data.forecast.forecastday
//     localStorage.setItem('forecast', JSON.stringify(fiveDay));
//     console.log(data)
    
// }



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
    