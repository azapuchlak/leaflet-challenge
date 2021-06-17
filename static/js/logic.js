// URL for earthquake data
var earthquakeSite = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Create layer groups for earthquake data
var earthquakes = new L.LayerGroup();

// Create Variables for different layers
var satelliteLayer = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    id: "mapbox.satellite",
    accessToken: API_KEY
});

var darkmapLayer = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/dark-v10",
  accessToken: API_KEY
});
 
var streetmapLayer = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
});

// Object to hold Layer container
var LayerContainer = {
    "Satellite": satelliteLayer,
    "Dark Map": darkmapLayer,
    "Street Map": streetmapLayer
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

    // This adds the legend

 // Add in the colors to be selected in the legend
 function getColor(d) {
    return d > 5 ? '#581845' :
           d > 4 ? '#900C3F' :
           d > 3 ? '#C70039' :
           d > 2 ? '#FF5733' :
           d > 1 ? '#FFC300' :
                   '#DAF7A6';
  }

  // Add legend to the map
  var legend = L.control({position: 'bottomright'});
  
  legend.onAdd = function (map) {
  
      var div = L.DomUtil.create('div', 'info legend'),
          magnitude = [0, 1, 2, 3, 4, 5],
          labels = [];

          div.innerHTML += "<h3>Magnitude</h3>"
  
      // 
      for (var i = 0; i < magnitude.length; i++) {
          div.innerHTML +=
              '<i style="background:' + getColor(magnitude[i] + 1) + '"></i> ' +
              magnitude[i] + (magnitude[i + 1] ? '&ndash;' + magnitude[i + 1] + '<br>' : '+');
      }
  
      return div;
  };
  
  legend.addTo(myMap);
});