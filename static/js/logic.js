// Store our API endpoint inside query URL
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

//Perform a GET request to the query URL
d3.json(queryUrl).then(function(data){}





//Create our initial map object
//((Set Longitude, Latitude, and the starting zoom level))
//This gets inserted into the div with an id of "map"

var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 2,
    layers: [satelliteLayer, earthquakes]
});

