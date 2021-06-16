// URL for earthquake data
var earthquakeSite = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Create layer groups for earthquake data
var earthquakes = new L.LayerGroup();

// Create Variables for different layers
var satelliteLayer = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    id: "mapbox.satellite",
    accessToken: API_KEY
});

var grayscaleLayer = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    id: "mapbox.light",
    accessToken: API_KEY
});

var outdoorLayer = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    id: "mapbox.outdoors",
    accessToken: API_KEY
});

// Object to hold Layer container
var LayerContainer = {
    "Satellite": satelliteLayer,
    "Grayscale": grayscaleLayer,
    "Outdoors": outdoorLayer
};

// holds the overlay layers
var overlayMap = {
    "Earthquakes": earthquakes,
};

//Create our initial map object
//((Set Longitude, Latitude, and the starting zoom level))
//This gets inserted into the div with an id of "map"
var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 2,
    layers: [satelliteLayer, earthquakes]
});

