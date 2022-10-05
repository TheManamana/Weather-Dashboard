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

if (JSON.parse(localStorage.getItem("previousSearch")) !== null) {
    previousSearchArray = JSON.parse(localStorage.getItem("previousSearch"));
}

// previousSearchArray = ['Los Angeles', 'San Diego', 'Salt Lake City'];



async function searchCity(city) {


    requestUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city.split(' ').join('+')},US&appid=${apiKey}&units=imperial`;

    await fetch(requestUrl)
        .then(function (response) {
            if (response.status === 404) {

                console.log("City not found");
                var alertEl = $('#leftSide');
                var alert = $('<div>')
                alert.attr('class', 'alert alert-danger');
                alert.attr('role', 'alert');
                alert.attr('id', 'test');
                alert.text(`You didn't type a valid city. Try again`);
                alertEl.append(alert);

                setInterval(function () {
                    if (alert.css('opacity') < 0.1) {
                        alert.remove();
                        clearInterval();

                    }
                    else {
                        alert.css('opacity', `${alert.css('opacity') - .1}`);
                    }
                }, 150);

                // setTimeout(function () {

                // }, 1250);

                // alertEl.alert('dispose');
                // var testEl = $('#test');
                // testEl.alert('dispose');
                // $('.alert').alert('close');
            }
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            updateCard(data.name, data.main.temp, data.wind.speed, data.main.humidity, data.weather[0].description);
            uv(data.coord.lat, data.coord.lon);
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


// (city, temp, wind, humidity, uv)


// searchCity(city);
// searchCity("los angeles");
// searchCity('sacramento');
// searchCity('salem');





$('#searchText').on("keyup", function (e) {
    if (e.keyCode == 13) {
        searchRequest();
    }
});

function searchRequest() {
    currentSearch = $('#searchText').val();
    searchCity(currentSearch);
    updatePreviousSearchArray();
    populatePrevious();


}

function updatePreviousSearchArray() {
    var saveSearch = true;

    previousSearchArray.forEach(search => {

        if (search === currentSearch) {
            saveSearch = false;
        }

    });

    if (saveSearch === true) {
        previousSearchArray.unshift(currentSearch);
    }

    if (previousSearchArray.length > 10) {
        previousSearchArray.pop();
    }


    localStorage.setItem("previousSearch", JSON.stringify(previousSearchArray));
}

function deleteButtons() {
    buttonDivEl.empty();
}

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

function updateCard(city, temp, wind, humidity, wDesc) {

    cardCityEl.text(`${city}`);
    cardTempEl.text(`Temp: ${temp}°F`)
    cardWindEl.text(`Wind: ${wind} MPH`)
    cardHumidityEl.text(`Humidity: ${humidity}%`)


}

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
            cardUvEl.text(`Uv Index: ${data.value}`)

        });
}

// updateCard("Atlanta", 74.01, 6.67, 46, .47);
populatePrevious();
searchCity("salt lake city");

// searchCity5Day('salt lake city');
// deleteButtons();

// $("div").remove(".btn");

