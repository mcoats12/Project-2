// Create a map object
var myMap = L.map("map-id", {
  center: [37.09, -95.71],
  zoom: 5
});

L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets-basic",
  accessToken: API_KEY
}).addTo(myMap);



// Loop through the cities array and create one marker for each city object
for (var i = 0; i < myData.length; i++) {

  var mkr=L.circle(myData[i].location, {
    fillOpacity: 0.75,
    color: "white",
    fillColor: "blue",
    radius: 120000
  }).bindPopup("<h1> Type of labour for " 
  + myData[i].name + "</h1>" + '<div id = container width="200" height="200">' + "</div>" ).addTo(myMap);
  mkr.myData=myData[i];
  mkr.on("popupopen",popchart)
}

function popchart(event){
  var chartData=event.target.myData;
                      // set the data
                    var data = [
                        {x: "Agriculture", value: chartData.typeOfLabourAgriculture},
                        {x: "Aquafarming", value: chartData.typeOfLabourAquafarming},
                        {x: "Begging", value: chartData.typeOfLabourBegging},
                        {x: "Construction", value: chartData.typeOfLabourConstruction},
                        {x: "Domestic Work", value: chartData.typeOfLabourDomesticWork},
                        {x: "Hospitality", value: chartData.typeOfLabourHospitality},
                        {x: "Illicit Activities", value: chartData.typeOfLabourIllicitActivities},
                        {x: "Manufacturing", value: chartData.typeOfLabourManufacturing},
                        {x: "Mining Or Drilling", value: chartData.typeOfLabourMiningOrDrilling},
                        {x: "Peddling", value: chartData.typeOfLabourPeddling},
                        {x: "Transportation", value: chartData.typeOfLabourTransportation},
                        {x: "Other", value: chartData.typeOfLabourOther},
                        {x: "Not Specified", value: chartData.typeOfLabourNotSpecified},
                        {x: "Prostitution", value: chartData.typeOfSexProstitution},
                        {x: "Pornography", value: chartData.typeOfSexPornography},
                        {x: "Remote Interactive Services", value: chartData.typeOfSexRemoteInteractiveServices},
                        {x: "Sexual Services", value: chartData.typeOfSexPrivateSexualServices}
                    ];
                  
                    // create the chart
                    var chart = anychart.pie();
                 
                    // set the chart title
//                    chart.title("Population by Race for the United States: 2010 Census");
                   
                    // add the data
//                     chart.data(data);
                  
                    // display the chart in the container
                    window.setTimeout(() => {
                      chart.data(data);
                      chart.container('container');
                      chart.draw();
                    }, 200)
                    
}