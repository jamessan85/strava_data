queue()
    .defer(d3.json, "/data")
    .await(makeGraphs);

var distancelineChart = dc.barChart("#chart-line-distance");
var hitspieChart = dc.pieChart(".chart-ring-year");
var quarterpieChart = dc.pieChart(".chart-ring-quarter");
selectField = dc.selectMenu("#rider-select");
var numberDisplay1 = dc.numberDisplay("#totals");
var numberDisplay2 = dc.numberDisplay("#likes");
var elevationChart = dc.barChart("#elevation-chart");
var totalDistanceRow = dc.rowChart("#rowchart");
var totalElevRow = dc.rowChart("#rowchartelev");

function makeGraphs(error, projectsJson) {

    var svgWidth = 800,
        svgHeight = 300;
    var spacing = 0.5;

    var margin = {top: 50, right: 0, bottom: 50, left: 50};
    //applies margin to canvas width and height
    var canvasWidth = svgWidth + margin.right + margin.left;
    var canvasHeight = svgHeight + margin.top + margin.bottom;

    //Clean projectsJson data
    var StravaData = projectsJson;

    var ndx = crossfilter(StravaData);

    var parseDate = d3.time.format("%Y-%m-%d").parse;
    StravaData.forEach(function (d) {
        d.date = parseDate(d["Start Date"]);
        d.distance = +d["Distance(Mi)"];
        d.Year = d.date.getFullYear();
        d.month = d3.time.month(d.date);
        d.Name = d["Athlete Name"];
        d.Kudos = +d["Kudos"];
        d.maxspeed = +d["Max Speed"];
        d.avg = +d["Average Speed(Mph)"];
        d.elv = +d["Elevation (Ft)"];
    });

    //define dimensions

    var dateDim = ndx.dimension(function (d) {
        return d.month
    });

    var riderDim = ndx.dimension(function (d) {
        return d.Name;
    });

    var yearDim = ndx.dimension(function (d) {
        return +d.Year;
    });


     var ridertotalDim = ndx.dimension(function (d) {
        return d.Name;
     });

     var biggestClimbersDim = ndx.dimension(function (d) {
         return d.Name
     });

    var quarter = ndx.dimension(function (d) {
        var month = d.date.getMonth();
        if (month <= 2) {
            return 'Q1';
        } else if (month > 2 && month <= 5) {
            return 'Q2';
        } else if (month > 5 && month <= 8) {
            return 'Q3';
        } else {
            return 'Q4';
        }
    });

    //groups

    var quarterGroup = quarter.group().reduceSum(function (d) {
        return d.month;
    });


   /*     if (rider == "Alex White") {
            return 'Alex';
        } else if (rider == "James Sanderson") {
            return 'James';
        } else if (rider == "David Scott") {
            return 'Scotty';
        } else if (rider == "Glen Kissack") {
            return 'Glen';
        } else if (rider == "John Prosser") {
            return 'John';
        }
         else if (rider == "Tom White") {
            return 'Tom';
        }*/



    var biggestclimberGroup = biggestClimbersDim.group().reduceSum(function (d) {
        return d.elv
    });

    var riderTotalGroup = ridertotalDim.group().reduceSum(function (d) {
        return d.distance
    });

    var riderGroup = riderDim.group();

    var distance = dateDim.group().reduceSum(function (d) {
        return d.distance;
    });

    var totalDistance = ndx.groupAll().reduceSum(function (d) {
        return d.distance;
    });

    var totalLikes = ndx.groupAll().reduceSum(function (d) {
        return d.Kudos;
    });

    var elevation = dateDim.group().reduceSum(function (d) {
        return d["Elevation (Ft)"];
    });

    var minDate = dateDim.bottom(1)[0].date;
    var maxDate = dateDim.top(1)[0].date;

    var year_total = yearDim.group();

    //DC Charts

    distancelineChart
        .width(500).height(300)
        .dimension(dateDim)
        .group(distance)
        .x(d3.time.scale().domain([minDate, maxDate]))
        .xUnits(d3.time.months)
        .yAxisLabel("Distance")
        .xAxisLabel("Month")
        .elasticY(true)
        .brushOn(false);

    totalDistanceRow
        .width(400)
        .height(200)
        .margins({top: 20, left: 10, right: 10, bottom: 20})
        .dimension(ridertotalDim)
        .group(riderTotalGroup)
        .gap(2);

    totalElevRow
        .width(400)
        .height(200)
        .margins({top: 20, left: 10, right: 10, bottom: 20})
        .dimension(biggestClimbersDim)
        .group(biggestclimberGroup)
        .gap(2);

    numberDisplay1
        .formatNumber(d3.format("d"))
        .valueAccessor(function (d) {
            return d;
        })
        .group(totalDistance)
        .formatNumber(d3.format("Miles"));

    numberDisplay2
        .formatNumber(d3.format("d"))
        .valueAccessor(function (d) {
            return d;
        })
        .group(totalLikes)
        .formatNumber(d3.format("Miles"));

    hitspieChart
        .width(180)
        .height(180)
        .slicesCap(6)
        .radius(80)
        .innerRadius(40)
        .dimension(yearDim)
        .group(year_total);

    quarterpieChart
        .width(180)
        .height(180)
        .slicesCap(6)
        .radius(80)
        .innerRadius(40)
        .dimension(quarter)
        .group(quarterGroup);

    selectField
        .dimension(riderDim)
        .group(riderGroup);

    elevationChart
        .width(500).height(300)
        .dimension(dateDim)
        .group(elevation)
        .margins({top: 20, left: 45, right: 10, bottom: 35})
        .xUnits(d3.time.months)
        .x(d3.time.scale().domain([minDate, maxDate]))
        .yAxisLabel("Elevation")
        .xAxisLabel("Month")
        .elasticY(true)
        .brushOn(false);

    //SVG Chart

    var maxData = d3.max(StravaData, function (d) {
        return d.maxspeed;
    });

    var colorScale = d3.scale.linear()
        .domain([0, d3.max(StravaData, function (d) {
            return d.maxspeed
        })])
        .range(["blue", "red"]);

    var heightScale = d3.scale.linear()
        .domain([0, maxData])
        .range([0, svgHeight]);

    //creates a scale for the y axis
    var yAxisScale = d3.scale.linear()
        .domain([0, maxData])
        .range([svgHeight, 0]);
    //creates a scale for the x axis
    var xAxisScale = d3.scale.ordinal()
        .domain(StravaData.map(function (d) {
            return d.Year;
        }))
        .rangeBands([0, svgWidth]);

    var yAxis = d3.svg.axis()
        .scale(yAxisScale)
        .orient("left")
        .ticks(10);

    var xAxis = d3.svg.axis()
        .scale(xAxisScale)
        .orient("bottom")
        .ticks(StravaData.length);

    var canvas = d3.select("#test")
        .append("svg")
        .attr("width", canvasWidth)
        .attr("height", canvasHeight);
    // background colour if required .attr("style", "background-color:#ddd");

    //appends y axis to the canvas
    canvas.append("g")
        .attr("class", "verticalAxis")  // style axis via CSS
        .attr("transform", "translate(" + (margin.left - 5) + "," + margin.bottom + ")")
        .call(yAxis);
    //appends x axis to the canvas
    canvas.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + margin.left + "," + (canvasHeight - (margin.bottom - 2)) + ")")
        .call(xAxis);
    //creates title
    canvas.append("g")
        .append("text") //append text onto chart
        .text("Bar Chart")//add the title
        .attr("x", canvasWidth / 2) //divide by 2 centers it
        .attr("y", 30) // height of y
        .attr("class", "title"); //what it is

    canvas.append("g")
        .append("title")     /*code for default tooltip */
        .text(function (d) {
            return d
        });

    /*canvas.append("g")
     .attr("width", svgWidth)
     .attr("height", svgHeight)
     .attr("style", "background-color:#ddd");
     /!* added some style*!/*/

    var svg = canvas.append('g')
        .attr("transform", "translate(" + margin.left + "," + margin.bottom + ")");


    //creates the chart
    svg.selectAll("rect")
        .data(StravaData)
        .enter()
        .append("rect")
        .attr("x", function (d, i) {
            return i * (svgWidth / StravaData.length);
        })
        .attr("y", function (d) {
            return svgHeight - heightScale(d.maxspeed);
        })
        .attr("width", (svgWidth / StravaData.length) - spacing)
        .attr("height", function (d) {
            return heightScale(d.maxspeed)
        })
        .attr("fill", function (d) {
            return (colorScale(d.maxspeed));
        });

    //add y axis text
    svg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("y", 6)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text("Max Speed");

    //add x axis text
    svg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", svgWidth / 2)
        .attr("y", svgHeight - 10)
        // .attr("transform", "rotate(90)")
        .text("Years");

    dc.renderAll();

}



