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
    // Function to perform API call

    function getWeather (loc) {
        let apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + "London" + "&appid=157647bc87fa3aa322f07fdde14674c8";

        let response = $.ajax({url: apiUrl});

        if (!response.status == 200) {
            // Error handling here
        } else {
            console.log(apiUrl);
            console.log(response);    
        }

    }
    // Function to draw current conditions to current forecast

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

    // Function to create event listeners
    function historyClick(event) {
        event.preventDefault();
    }

    function srchClick(event) {
        event.preventDefault();
    }
    // Function to load searches to memory

    // Function to store searches in an array

    // Function to clean searches and submit to the core app

    // Function to create and populate list of searches
    return {
        historyClick: historyClick,
        srchClick: srchClick
    }
})();

// =========================================
// Runtime Code
// -----------------------------------------
// Code that runs upon page load
// =========================================

$("#search-history").on('click', locSearch.historyClick);
$("#search-btn").on('click', locSearch.srchClick);

console.log("Fired!");
weatherApp.getWeather();