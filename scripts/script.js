var body = $('#body');
var buttonDivEl = $('#previousButtons');

var cardCityEl = $('#cardCity');
var cardTempEl = $('#temp');
var cardWindEl = $('#wind');
var cardHumidityEl = $('#humidity');
var cardUvEl = $('#uv');


var apiKey = '4d63ba9d93efddcbcaf8047f7d2ec8b0';

var city = 'salt lake city';

var previousSearchArray = [];

var currentSearch;

if (JSON.parse(localStorage.getItem("previousSearch")) !== null){
previousSearchArray = JSON.parse(localStorage.getItem("previousSearch"));
}

// previousSearchArray = ['Los Angeles', 'San Diego', 'Salt Lake City'];



async function searchCity(city) {
    

    requestUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city.split(' ').join('+')},US&appid=${apiKey}&units=imperial`;

        await fetch(requestUrl)
        .then(function (response) {
            if (response.status === 404) {
                
                console.log("City not found");
              }
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            updateCard(data.name,data.main.temp,data.wind.speed,data.main.humidity,data.weather[0].description);
            searchCity5Day(data.name)
        });
}
async function searchCity5Day(city) {
    

    requestUrl = `http://api.openweathermap.org/data/2.5/forecast?q=${city.split(' ').join('+')},US&appid=${apiKey}&units=imperial`;

        await fetch(requestUrl)
        .then(function (response) {
            if (response.status === 404) {
                
                console.log("City not found");
              }
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            

        });
}


// (city, temp, wind, humidity, uv)


// searchCity(city);
// searchCity("los angeles");
// searchCity('sacramento');
// searchCity('salem');





$('#searchText').on("keyup", function(e) {
    if (e.keyCode == 13) {
        searchRequest();
    }
});

function searchRequest(){
    currentSearch = $('#searchText').val();
    searchCity(currentSearch);
    updatePreviousSearchArray();
    populatePrevious();
    

}

function updatePreviousSearchArray(){
    var saveSearch = true;

    previousSearchArray.forEach(search => {

        if(search === currentSearch){
            saveSearch = false;
        }
        
    });

    if(saveSearch===true){
        previousSearchArray.unshift(currentSearch);
    }

    if(previousSearchArray.length>10){
        previousSearchArray.pop();
    }


    localStorage.setItem("previousSearch", JSON.stringify(previousSearchArray));
}

function deleteButtons(){
    buttonDivEl.empty();
}

function populatePrevious(){
    deleteButtons();

    for (let i = 0; i < previousSearchArray.length; i++) {
        
        var newButton = $('<button>');
        newButton.attr('class', 'btn btn-secondary');
        newButton.attr('type', 'button');
        newButton.text(previousSearchArray[i]);

        newButton.attr('onclick',`searchCity("${previousSearchArray[i]}")`);

        buttonDivEl.append(newButton);
        
    }
}

function updateCard(city, temp, wind, humidity, wDesc){

    cardCityEl.text(`${city}`); 
    cardTempEl.text(`Temp: ${temp}°F`)
    cardWindEl.text(`Wind: ${wind} MPH`)
    cardHumidityEl.text(`Humidity: ${humidity}%`)
    cardUvEl.text(`Weather Description: ${wDesc}`) 

}

function update5Day(){
    
}

// updateCard("Atlanta", 74.01, 6.67, 46, .47);
populatePrevious();

// searchCity5Day('salt lake city');
// deleteButtons();

// $("div").remove(".btn");

