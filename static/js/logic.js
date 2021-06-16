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

// this adds layer control
L.control.layers(LayerContainer, overlayMap).addTo(myMap);

// Use D3 to retrieve earthquake info
d3.json(earthquakeSite, function(earthquakeData) {
    // This controls dot size and style
    function dotSize(magnitude) {
        if (magnitude === 0) {
            return 1;
        }
        return magnitude * 3;
    }
    function dotStyle(feature) {
        return {
            opacity: 1,
            fillOpacity: 1,
            fillColor: dotColor(feature.properties.mag),
            color: "#000000",
            radius: dotSize(feature.properties.mag),
            stroke: true,
            weight: 0.5
        };
    }
    // Sets dot colors
    function dotColor(magnitude) {
        switch (true) {
            case magnitude > 5:
                return "#581845";
            case magnitude > 4:
                return "#900C3F";
            case magnitude > 3:
                return "#C70039";
            case magnitude > 2:
                return "#FF5733";
            case magnitude > 1:
                return "#FFC300";
            default:
                return "#DAF7A6";
        }
    }

    // add GeoJSON layer to the map
    L.geoJSON(earthquakeData, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng);
        },
        style: dotStyle,
        
        //This adds the popups that provide additional information about the earthquake when a marker is clicked.
       
        onEachFeature: function(feature, layer) {
            layer.bindPopup("<h4>Location: " + feature.properties.place +
                "</h4><hr><p>Date & Time: " + new Date(feature.properties.time) +
                "</p><hr><p>Magnitude: " + feature.properties.mag + "</p>");
        }

    //adds the earthquake to the layer on map
    }).addTo(earthquakes);
    earthquakes.addTo(myMap);

});