// Creating map object
var myMap = L.map("map", {
    center: [51.5074, 0.1278],
    zoom: 3
});
  
// Adding tile layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
}).addTo(myMap);

//   Logic for geojson data

// scale
scaleWeight = d3.scaleLinear()
                .domain([0, d3.max(flight_data.features, feature => feature.properties.Count)])
                .range([1, 7])

L.geoJSON(flight_data, {
    onEachFeature: (feature, layer) => {
      options = {
        weight: scaleWeight(feature.properties.Count),
        vertices: 200
      }
      var line = L.Polyline.Arc(...feature.geometry.coordinates, options)
                                .bindPopup(`Count: ${feature.properties.Count}<br>` +
                                    `From: ${feature.properties.citizenshipFullCountry}<br>` +
                                    `To: ${feature.properties.CountryOfExploitationFullCountry}<br>`
                                );
      line.addTo(myMap);
    }
})