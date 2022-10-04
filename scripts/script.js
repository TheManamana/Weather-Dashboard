var body = $('#body');


var apiKey = '4d63ba9d93efddcbcaf8047f7d2ec8b0';

var city = 'salt lake city';

var test ='';



async function searchCity(city) {
    

    requestUrl = `http://api.openweathermap.org/data/2.5/forecast?q=${city.split(' ').join('+')},US&appid=${apiKey}`;

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

// searchCity(city);
// searchCity("los angeles");
// searchCity('sacramento');
// searchCity('salem');


var butt = $('#button-addon2')



function getText(){
    searchCity($('#searchText').val());

}