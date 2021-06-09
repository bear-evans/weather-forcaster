// =========================================
// Global Variables
// -----------------------------------------
// Variables and other declarations of
// Global scope
// =========================================



// =========================================
// Weather App
// -----------------------------------------
// The core weather app
// =========================================
var weatherApp = (function() {

    // Grabs the coordinates from another API call because Onecall does not handle city names
    async function getCoords(loc) {
        let apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + loc + "&appid=157647bc87fa3aa322f07fdde14674c8";
        var coords = await fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Something went wrong fetching the location data");
                }
                return response.json();
            })
            .then(data => {
                coords = [data.coord.lat, data.coord.lon];
                return coords;
            })
            .catch (error => {
                console.error(error);
            });

            return coords;
    }

    // Performs the API calls and sends the data where needed
    async function getWeather (loc) {
        let coords = await getCoords(loc);
        locSearch.saveSearch(loc);

        // Calls openweather onecall and grabs the data
        apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + coords[0] + "&lon=" + coords[1] + "&units=imperial&appid=157647bc87fa3aa322f07fdde14674c8";
        fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error("Something went wrong fetching the weather data");
            }
            return response.json();
        })
        .then(data => {
            drawCurrent(loc, data);
            drawFiveDay(data);
        })
        .catch (error => {
            console.error(error);
        });
    }

    // Draws the current weather conditions from the JSON response
    function drawCurrent (location, weather) {
        let card = $("#current-forecast");
        let date = moment().format("MM[/]DD[/]YYYY");
        console.log(weather);

        card.empty();
        card.append($("<img src='http://openweathermap.org/img/wn/" + weather.current.weather[0].icon + "@2x.png' style='float: right;'>"));
        card.append($("<h2>Current Conditions in " + location + " (" + date + ")</h2>"));
        card.append($("<p><span class='data-field'>Temperature:</span> " + weather.current.temp + "°F</p>"));
        card.append($("<p><span class='data-field'>Wind:</span> " + weather.current.wind_speed + " MPH</p>"));
        card.append($("<p><span class='data-field'>Humidity:</span> " + weather.current.humidity + "%</p>"));
        if (weather.current.uvi > 6) {
            card.append($("<p><span class='data-field'>UV Index:</span> <span class='uv-high'>" + weather.current.uvi + "</span></p>"));
        } else if (weather.current.uvi > 3) {
            card.append($("<p><span class='data-field'>UV Index:</span> <span class='uv-med'>" + weather.current.uvi + "</span></p>"));
        } else {
            card.append($("<p><span class='data-field'>UV Index:</span> <span class='uv-low'>" + weather.current.uvi + "</span></p>"));
        }
    }

    // Cycles through the forecast panels, drawing weather data to them
    function drawFiveDay (weather) {
        $(".forecast-panel").each(
            function(i) {
                let date = moment().add(i, 'days').format("MM[/]DD[/]YYYY");
                $(this).empty();
                $(this).append(date);
                $(this).append($("<img src='http://openweathermap.org/img/wn/" + weather.daily[i].weather[0].icon + "@2x.png' style='float: right;'>"));
                $(this).append($("<p><span class='data-field'>Temperature:</span> " + weather.daily[i].temp.day + "°F</p>"));
                $(this).append($("<p><span class='data-field'>Wind:</span> " + weather.daily[i].wind_speed + " MPH</p>"));
                $(this).append($("<p><span class='data-field'>Humidity:</span> " + weather.daily[i].humidity + "%</p>"));
        
            }
        )
    }

    // Function to call and draw future conditions
    return {
        getWeather: getWeather
    }
})();

// =========================================
// Search Handler
// -----------------------------------------
// Handles the search boxes and history
// =========================================
var locSearch = (function() {

    // Handles the history field clicks
    function historyClick(event) {
        event.preventDefault();
        if (event.target.type != "submit") {return;} // Stop if we didn't click a button
        let srch = event.target.textContent;
        weatherApp.getWeather(srch);
    }

    // Handles the search button clicks
    function srchClick(event) {
        event.preventDefault();        
        let srch = $("#search-bar").val();
        if (srch == "") {return;} // Stop if the field is blank
        weatherApp.getWeather(srch);
    }

    // Stores successful searches to the history
    function saveSearch (loc) {
        let history = [];
        $(".past-search").each(function(i) {
            history[i] = $(this).text();
        });
        history.push(loc);
        if (history.length > 10) {
            history.shift();
        };

        // Save the array and reload the history
        localStorage.setItem("history", JSON.stringify(history));
        populateHistory();
    }

    // Function to create and populate list of previous searches
    function populateHistory() {
        let history = JSON.parse(localStorage.getItem("history"));
        
        // Grab the container and clear it before populating it with fresh buttons
        let hContainer = $("#search-history");
        hContainer.empty();
        for (var i = 0; i < history.length; i++) {
            let j = $("<button class='past-search btn btn-success btn-block'>" + history[i] + "</button>");
            hContainer.prepend(j);
        }
    }

    return {
        historyClick: historyClick,
        srchClick: srchClick,
        saveSearch: saveSearch,
        populateHistory: populateHistory
    }
})();

// =========================================
// Runtime Code
// -----------------------------------------
// Code that runs upon page load
// =========================================

$("#search-history").on('click', locSearch.historyClick);
$("#search-btn").on('click', locSearch.srchClick);
locSearch.populateHistory();