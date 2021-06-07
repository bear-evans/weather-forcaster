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
        let apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + loc + "&appid=157647bc87fa3aa322f07fdde14674c8";

        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    // An error occurred
                    return false;
                }

                return response.json();
            })
            .then(data => {
                console.log(data);
            })
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

    // Handles the search button clicks
    function srchClick(event) {
        event.preventDefault();

        console.log("Clicky clicky");
        let srch = $("#search-bar").val();

        saveSearch(srch);
        weatherApp.getWeather(srch);
    }
    // Function to load searches to memory

    // Function to store searches in an array
    function saveSearch (loc) {
        let history = [];
        console.log($(".past-search"));
        $(".past-search").each(function(i) {
            history[i] = $(this).text();
            console.log("history[" + i +"] = " + history[i]);
        });
        history.push(loc);
        if (history.length > 10) {
            history.shift();
        };

        localStorage.setItem("history", JSON.stringify(history));
        populateHistory();
    }
    // Function to clean searches and submit to the core app

    // Function to create and populate list of searches
    function populateHistory() {
        let history = JSON.parse(localStorage.getItem("history"));
        
        // Grab the container and clear it before populating it with fresh buttons
        let hContainer = $("#search-history");
        hContainer.empty();
        for (var i = 0; i < history.length; i++) {
            let j = $("<button class='past-search btn-success col-12'>" + history[i] + "</button>");
            console.log(j);
            hContainer.prepend(j);
        }
    }

    return {
        historyClick: historyClick,
        srchClick: srchClick,
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

console.log("Begins!");

locSearch.populateHistory();