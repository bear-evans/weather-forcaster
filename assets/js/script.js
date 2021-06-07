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

    // Performs the API calls and sends the data where needed
    function getWeather (loc) {
        let apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + loc + "&units=imperial&appid=157647bc87fa3aa322f07fdde14674c8";
        let isError = false;
        let currentWeather = {};
        let fiveDayWeather = {};

        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    isError = true; // mark if there's a problem
                }
                return response.json();
            })
            .then(data => {
                currentWeather = data;
            });        
        // Stop if an error occurred
        if (isError) {
            return; 
        }

        locSearch.saveSearch(loc);

        // Second API Call for the 5 day forecast
        apiUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + loc + "&cnt=5&units=imperial&appid=157647bc87fa3aa322f07fdde14674c8";

        fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                // We assume things are okay if the last call worked (big mistake?)
            }
            return response.json();
        })
        .then(data => {
            fiveDayWeather = data;
        });


    }

    function drawCurrent (weather) {
        // current weather drawing here
        let card = $("#current-forecast");
        let h = $("<h2>Current Conditions in " + weather.name + "</h2>");
        let t = $("<")
    }

    function drawFiveDay (weather) {
        // Five day forecast drawing goes here
    }

    // Function to call and draw future conditions
    return {
        getWeather: getWeather
    }
})();

// =========================================
// Search Handler
// -----------------------------------------
// The Handles the search boxes and history
// =========================================
var locSearch = (function() {

    // Handles the 
    function historyClick(event) {
        event.preventDefault();
        console.log(event.target.type);
        if (event.target.type != "submit") {return;} // Stop if we didn't click a button
        let srch = event.target.textContent;
        weatherApp.getWeather(srch);
    }

    // Handles the search button clicks
    function srchClick(event) {
        event.preventDefault();        
        let srch = $("#search-bar").val();
        console.log(srch);
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
            let j = $("<button class='past-search btn btn-success col-12'>" + history[i] + "</button>");
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