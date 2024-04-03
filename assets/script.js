const searchBar = document.querySelector('#citySearch');
const searchBtn = document.querySelector('#searchBtn');
const clearSearchBtn = document.querySelector('#clearSearchBtn');
const cityList = document.querySelector('#cityList');
const weatherBoard = document.querySelector('#weatherBoard');
const APIkey = '31491d9ec3484031a3a213935240304';
const clearSearchModalBtn = $('#clearSearchModalBtn');



const getCity = function() {
    let city = searchBar.value;
    let cities = JSON.parse(localStorage.getItem('cities'))
    if (!cities){cities=[]}
    if (city == ''){return;}
    
    cities.push(city);
    console.log(cities);
    if (cities.length > 10) {
        shift(cities);
    }
    cities = JSON.stringify(cities)
    localStorage.setItem('cities', cities);
}

const handleSearch = function() {
    getCity();
    searchBar.value = ''
    appendRecentCities();
}

const appendRecentCities = function() {
    console.log('appending recent cities...');
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
        newButton.classList.add("btn", "btn-secondary", "row-12", "mx-1", "my-1");
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

//--------------------------------------Fetch Weather Data--------------------------------------//

const getWeatherData = function() {
    const length = cities.length -1
    const city = cities[length]
}


searchBtn.addEventListener('click', function() {
    handleSearch();
    console.log('click')
})

window.onload = function () {appendRecentCities()};
    