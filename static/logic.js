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

/*
function fetchJSON(url) {
  return fetch(url)
    .then(function(response) {
      return response.json();
    });
}

var data = fetchJSON('resources/map2.geojson')
            .then(function(data) { return data });
*/
			
var data = meansdata ;

var geojson;

// Grab data with d3
//d3.json(APILink, function(data) {
function getColor(d) {
    return d > 1000 ? '#800026' :
           d > 500  ? '#BD0026' :
           d > 200  ? '#E31A1C' :
           d > 100  ? '#FC4E2A' :
           d > 50   ? '#FD8D3C' :
           d > 20   ? '#FEB24C' :
           d > 10   ? '#FED976' :
                      '#FFEDA0';
}

function style(feature) {
    return {
        fillColor: getColor(feature.properties.meansofcontrol_total),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

  // Create a new choropleth layer
  geojson = L.choropleth(data, {

    // Define what  property in the features to use
    valueProperty: "meansofcontrol_total",

    // Set color scale
    scale: ["#ffffb2", "#b10026"],

    // Number of breaks in step range
    steps: 10,



    // q for quartile, e for equidistant, k for k-means
    mode: "q",
	
    style: {
      // Border color
      color: "#fff",
      weight: 1,
      fillOpacity: 0.8
    }
	
	,

    // Binding a pop-up to each layer
    onEachFeature: function(feature, layer) {
      //layer.bindPopup(feature.properties.name + '\n' +  'Means of Control Data Available: ' + feature.properties.meansofcontrol_total );
	    var div = $('<div class="popupGraph" style="width: 300; height:200;"><svg/></div>')[0];
        var popup = L.popup().setContent(div);

            layer.bindPopup(popup);
			var values = feature.properties;
            var data = [
                {name:"Restricts Movement",value:values["RestrictsMovement_cnt"]},
                {name:"False promises",value:values["FalsePromises_cnt"]},
                {name:"TakesEarnings",value:values["TakesEarnings_cnt"]},
                {name:"PsychologicalAbuse",value:values["PsychologicalAbuse_cnt"]},
                {name:"SexualAbuse",value:values["SexualAbuse_cnt"]},
                {name:"PsychoactiveSubstances",value:values["PsychoactiveSubstances_cnt"]},
				{name:"WithholdsDocuments",value:values["WithholdsDocuments_cnt"]},
                {name:"Others",value:values["Other_cnt"]},
                {name:"WithholdsNecessities",value:values["WithholdsNecessities_cnt"]},
                {name:"PhysicalAbuse",value:values["PhysicalAbuse_cnt"]},
                {name:"Threats",value:values["Threats_cnt"]},
                {name:"LawEnforcementThreat",value:values["ThreatOfLawEnforcement_cnt"]}
            ];
            var margin = {top: 20, right: 0, bottom: 40, left: 0},
                width = 300 ,
                height = 200 ,
                barHeight = height / data.length;
      
            var x = d3.scaleLinear()
                .domain([0, d3.max(data, control_method => control_method.value )])
                .range([0, width]);
            var xAxis = d3.axisBottom(x);

			var svg = d3.select(div).select("svg")
			    .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
              .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                .classed("chart", true);
            //var svg = d3.select(div).select("svg").attr("width", 200).attr("height", 200);
            //svg.append("rect").attr("width", 150).attr("height", 150).style("fill", "lightBlue");
			svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);
           
            var bar = svg.selectAll("g.bar")
                .data(data)
                .enter()
              .append("g")
                .attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });
            
            bar.append("rect")
                .attr("width", function(d){return x(d.value);})
                .attr("height", barHeight - 1);
            
            bar.append("text")
                .attr("x", function(d) { return x(d.value) - 3; })
                .attr("y", barHeight / 2)
                .attr("dy", ".35em")
                .text(function(d) { return d.name; });
    }
  }).addTo(myMap);

  // Set up the legend
  var legend = L.control({ position: "bottomleft" });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var limits = geojson.options.limits;
    var colors = geojson.options.colors;
    var labels = [];

    // Add min & max
	var legendInfo = "<h3>Means of Control used in Exploited Countries</h3>"
	div.innerHTML = legendInfo;
	
	/*
    var legendInfo = "<h1>Means of Control Data Availability</h1>" +
      "<div class=\"labels\">" +
        "<div class=\"min\">" + limits[0] + "</div>" +
        "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
      "</div>";
	 

    div.innerHTML = legendInfo;

    limits.forEach(function(limit, index) {
      labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
    });

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
	*/
    return div;
  };

  // Adding legend to the map
  legend.addTo(myMap);

//})
;
