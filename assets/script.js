

var width = 500,
  height = 600;

  let centered;

// Field refernce to csv column to add color
var field = "Total_Votes";

var valueFormat = d3.format(",");

// const tooltip = d3.select("body").append("div")
// 	.attr("class", "tooltip")
// 	.style("opacity", 0);

// Logic to handle hover event when its firedup
var hoveron = function (d) {
  // console.log('d', d, 'event', event);
  var div = document.getElementById('tooltip');
  // div.style.left = event.pageX + 'px';
  // div.style.top = event.pageY + 'px';

 

  //Fill yellow to highlight
  d3.select(this).transition()
    .duration(200)
    .style("opacity", 1)
    .style("stroke", "black")
    .style("fill", "white");

  //Show the tooltip
  d3.select("#tooltip")
    .style("opacity", 1);

  //Populate name in tooltip
  d3.select("#tooltip .name")
    .text(d.properties.dist);

  //Populate value in tooltip
  d3.select("#tooltip .value")
    .style("left", (d3.event.pageX + 15) + "px")
    .style("top", (d3.event.pageY - 28) + "px")
    .transition().duration(400)
    .style("opacity", 1)
    .text(valueFormat(d.properties.field) + " Votes");
}

var hoverout = function (d) {

  //Restore original choropleth fill
  d3.select(this)
    .transition()
    .duration(200)
    .style("fill", function (d) {
      var value = d.properties.field;
      if (value) {
        return color(value);
      } else {
        return "#ccc";
      }
    });

  //Hide the tooltip
  d3.select("#tooltip").transition().duration(300)
    .style("opacity", 0);

}


// Create a SVG element in the map container and give it some
// dimensions.
var svg = d3.select('#ug_map')
  // 	.append('svg')
  //   // .attr("class", "legend")
  //   .attr('width', width)
  //   .attr('height', height)
  ;


// Define a geographical projection and scale the map 
var projection = d3.geoMercator()
  .scale(1)

// Prepare a path object and apply the projection to it.
var path = d3.geoPath()
  .projection(projection);

// We prepare an object to later have easier access to the data.
var dataById = d3.map();

var color = d3.scaleQuantize()
  //.range(d3.range(9),map(function(i) { return 'q' + i + '-9';}));
  .range([
    "#a50026",
    "#d73027",
    "#f46d43",
    "#fdae61",
    "#fee08b",
    "#ffffbf",
    "#d9ef8b",
    "#a6d96a",
    "#66bd63",
    "#1a9850",
    "#006837"]);

// Load in coverage score data
d3.csv("./data/UgElections1.csv", function (data) {

  // var elements = Object.keys(data[0])
  //   .filter(function (d) {
  //     return ((d != "DISTRICT") & (d != "DISTRICT_ID") & (d != "RegVoters") & (d != "Valid_Votes") & (d != "Invalid_votes") & (d != "Total_Votes") & (d != "Received_Stations") & (d != "Total_Stations")
  //     );
  //   });

  color.domain([
    d3.min(data, function (d) { return +d[field]; }),
    d3.max(data, function (d) { return +d[field]; })

  ]);

  dataById = d3.nest()
    .key(function (d) { return +d.DISTRICT_ID; })
    .rollup(function (d) { return d[0]; })
    .map(data)
    ;

  d3.json('./data/ug_districts3.geojson', function (error, json) {


    // Get the scale and center parameters from the features.
    var scaleCenter = calculateScaleCenter(json);

    // Apply scale, center and translate parameters.
    projection.scale(scaleCenter.scale)
      .center(scaleCenter.center)
      .translate([width / 2, height / 2]);

    for (var i = 0; i < data.length; i++) {

      // Grab district name
      var dataDistrict = data[i].DISTRICT;

      //Grab data value, and convert from string to float
      var dataValue = +data[i][field];


      //Find the corresponding district inside GeoJSON
      for (var j = 0; j < json.features.length; j++) {

        // Check the district reference in json
        var jsonDistrict = json.features[j].properties.dist;

        if (dataDistrict == jsonDistrict) {

          //Copy the data value into the GeoJSON
          json.features[j].properties.field = dataValue;

          //Stop looking through JSON
          break;
        }
      }
    }
    

    svg.append('g') // add a <g> element to the SVG element and give it a class to style later
      .attr('class', 'features')
    svg.selectAll('path')
      .data(json.features)
      .enter()
      .append('path')
      .attr('d', path)
      .style("cursor", "pointer")
      .style("stroke", "transparent")
      .style("fill", function (d) {

        // Get data value

        var value = d.properties.field;

        if (value) {
          // If value exists ...
          return color(value);
        } else {
          // If value is undefined ...
          return "#ccc";
        }

      })
      
      .on("mouseover", hoveron)
      .on("mouseout", hoverout)
      .on("click", click)
      ;

  });

});

// Zoom functionality
function click(d) {
	var x, y, k;

	if (d && centered !== d) {
		var centroid = path.centroid(d);
		x = -(centroid[0] * 6);
		y = (centroid[1] * 6);
		k = 3;
		centered = d;
	} else {
		x = 0;
		y = 0;
		k = 1;
		centered = null;
	}

	svg.selectAll("path")
		.classed("active", centered && function (d) { return d === centered; });

	svg.transition()
		.duration(750)
		.attr("transform", "translate(" + x + "," + y + ") scale(" + k + ")");

}

function calculateScaleCenter(features) {
  // Get the bounding box of the paths (in pixels!) and calculate a
  // scale factor based on the size of the bounding box and the map
  // size.
  var bbox_path = path.bounds(features),
    scale = 0.95 / Math.max(
      (bbox_path[1][0] - bbox_path[0][0]) / width,
      (bbox_path[1][1] - bbox_path[0][1]) / height
    );

  // Get the bounding box of the features (in map units!) and use it
  // to calculate the center of the features.
  var bbox_feature = d3.geoBounds(features),
    center = [
      (bbox_feature[1][0] + bbox_feature[0][0]) / 2,
      (bbox_feature[1][1] + bbox_feature[0][1]) / 2];

  return {
    'scale': scale,
    'center': center
  };
}

