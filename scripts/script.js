var buttonDivEl = $('#previousButtons');


// Elements for the main city info card
var cardCityEl = $('#cardCity');
var cardTempEl = $('#temp');
var cardWindEl = $('#wind');
var cardHumidityEl = $('#humidity');
var cardUvEl = $('#uv');

// API Key for openweather
var apiKey = '4d63ba9d93efddcbcaf8047f7d2ec8b0';

// Previous searches initialized as empty array
var previousSearchArray = [];

// Current Search terms
var currentSearch;

// If a person has previous searches saved in local storage it sets previousSearchArray to those values
if (JSON.parse(localStorage.getItem("previousSearch")) !== null) {
    previousSearchArray = JSON.parse(localStorage.getItem("previousSearch"));
}




// Calls Weather api and calls card creation function
async function searchCity(city) {

// Replaces search whitespace with '+'.
    requestUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city.split(' ').join('+')},US&appid=${apiKey}&units=imperial`;

    await fetch(requestUrl)
        .then(function (response) {

            // If city is not found in api it creates an alert to notify user
            if (response.status === 404) {

                console.log("City not found");
                var alertEl = $('#leftSide');
                var alert = $('<div>')
                alert.attr('class', 'alert alert-danger');
                alert.attr('role', 'alert');
                alert.attr('id', 'test');
                alert.text(`You didn't type a valid city. Try again`);
                alertEl.append(alert);

                //Causes alert to decrease opacity. Removes it when less than .1
                setInterval(function () {
                    if (alert.css('opacity') < 0.1) {
                        alert.remove();
                        clearInterval();

                    }
                    else {
                        alert.css('opacity', `${alert.css('opacity') - .1}`);
                    }
                }, 150);

            
            }
            return response.json();
        })
        // Updates main Card
        .then(function (data) {
            console.log(data);
            updateCard(data.name, data.main.temp, data.wind.speed, data.main.humidity, data.weather[0].description);
            // Calls uv function which calls uv api
            uv(data.coord.lat, data.coord.lon);
            // Calls 5-day forecast api
            searchCity5Day(data.name)
        });
}

// 5-day Weather api call
async function searchCity5Day(city) {


    requestUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city.split(' ').join('+')},US&appid=${apiKey}&units=imperial`;

    await fetch(requestUrl)
        .then(function (response) {
            if (response.status === 404) {

                console.log("City not found");
            }
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            // Calls card creator for the next 5 days of weather. Index is used to find the right card element. Uses info from noon each day
            for (let i = 0; i < 5; i++) {
                if (i === 0) {
                    update5Day(i, data.list[4].dt_txt.split(' ')[0], data.list[4].main.temp, data.list[4].wind.speed, data.list[4].main.humidity);
                } else if (i === 1) {
                    update5Day(i, data.list[12].dt_txt.split(' ')[0], data.list[12].main.temp, data.list[12].wind.speed, data.list[12].main.humidity);
                } else if (i === 2) {
                    update5Day(i, data.list[20].dt_txt.split(' ')[0], data.list[20].main.temp, data.list[20].wind.speed, data.list[20].main.humidity);
                } else if (i === 3) {
                    update5Day(i, data.list[28].dt_txt.split(' ')[0], data.list[28].main.temp, data.list[28].wind.speed, data.list[28].main.humidity);
                } else if (i === 4) {
                    update5Day(i, data.list[36].dt_txt.split(' ')[0], data.list[36].main.temp, data.list[36].wind.speed, data.list[36].main.humidity);
                }


            }

        });
}
// uv api
async function uv(lat, lon) {
    var requestUrl = `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${apiKey}`

    await fetch(requestUrl)
        .then(function (response) {
            if (response.status === 404) {

                console.log("City not found");
            }
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            // Updates uv info.
            cardUvEl.text(`Uv Index: ${data.value}`)

        });
}



// Provides a search after pressing enter when focused on text entry
$('#searchText').on("keyup", function (e) {
    if (e.keyCode == 13) {
        searchRequest();
    }
});

// Calls first weather api, calls the function to update previous searches, and calls function to populate the recent searches
function searchRequest() {
    currentSearch = $('#searchText').val();
    searchCity(currentSearch);
    updatePreviousSearchArray();
    populatePrevious();


}
// Updates search array
function updatePreviousSearchArray() {
    var saveSearch = true;
    // Checks if current search is already saved
    previousSearchArray.forEach(search => {

        if (search === currentSearch) {
            saveSearch = false;
        }

    });

    // If search is new, puts it at the beginning of array
    if (saveSearch === true) {
        previousSearchArray.unshift(currentSearch);
    }
    // Only allows there to be 10 saved searches
    if (previousSearchArray.length > 10) {
        previousSearchArray.pop();
    }

    // Updates local storage with new array
    localStorage.setItem("previousSearch", JSON.stringify(previousSearchArray));
}

// Deletes all saved search buttons
function deleteButtons() {
    buttonDivEl.empty();
}

// Populates previous search buttons.
function populatePrevious() {
    deleteButtons();

    for (let i = 0; i < previousSearchArray.length; i++) {

        var newButton = $('<button>');
        newButton.attr('class', 'btn btn-secondary m-1');
        newButton.attr('type', 'button');
        newButton.text(previousSearchArray[i]);

        newButton.attr('onclick', `searchCity("${previousSearchArray[i]}")`);

        buttonDivEl.append(newButton);

    }
}

// Updates main card
function updateCard(city, temp, wind, humidity) {

    cardCityEl.text(`${city}`);
    cardTempEl.text(`Temp: ${temp}°F`)
    cardWindEl.text(`Wind: ${wind} MPH`)
    cardHumidityEl.text(`Humidity: ${humidity}%`)


}

// Updates 5 day card
function update5Day(index, date, temp, wind, humidity) {
    var fiveDayDateEl = $(`#dayDate${index}`);
    var fiveDayTempEl = $(`#dayTemp${index}`);
    var fiveDayWindEl = $(`#dayWind${index}`);
    var fiveDayHumidityEl = $(`#dayHumidity${index}`);

    fiveDayDateEl.text(`${date}`);
    fiveDayTempEl.text(`Temp: ${temp}°F`);
    fiveDayWindEl.text(`Wind: ${wind}MPH`);
    fiveDayHumidityEl.text(`Humidity: ${humidity}%`);

}



// Loads previous searches and startup
populatePrevious();
// Makes default search Salt Lake City
searchCity("salt lake city");



