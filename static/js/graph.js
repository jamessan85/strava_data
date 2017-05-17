queue()
    .defer(d3.json, "/data")
    .await(makeGraphs);

var distancelineChart = dc.barChart("#chart-line-distance");
var avgLineChart = dc.barChart("#chart-line-avg");
var hitspieChart = dc.pieChart("#chart-ring-year");
selectField = dc.selectMenu("#rider-select");
var numberDisplay1 = dc.numberDisplay("#totals");
var numberDisplay2 = dc.numberDisplay("#likes")
var elevationChart = dc.barChart("#elevation-chart");

function makeGraphs(error, projectsJson) {

    var svgWidth = 3000,
        svgHeight = 500;
    var spacing = 2;

    var margin = {top: 50, right: 0, bottom: 50, left: 50};
    //applies margin to canvas width and height
    var canvasWidth = svgWidth + margin.right + margin.left;
    var canvasHeight = svgHeight + margin.top + margin.bottom;

    //Clean projectsJson data
    var StravaData = projectsJson;
    var parseDate = d3.time.format("%Y-%m-%d").parse;
    StravaData.forEach(function (d) {
        d.date = parseDate(d["Start Date"]);
        d.distance = +d["Distance(Mi)"];
        d.Year = d.date.getFullYear();
        d.Name = d["Athlete Name"];
        d.Kudos = +d["Kudos"];
        d.maxspeed = +d["Max Speed"];
    });

    var maxData = d3.max(StravaData, function (d) {
        return d.maxspeed;
    });

    var colorScale = d3.scale.linear()
                   .domain([0,d3.max(StravaData, function(d) {return d.maxspeed})])
                   .range(["blue","red"]);

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
        .ticks(5);

    var xAxis = d3.svg.axis()
        .scale(xAxisScale)
        .orient("bottom")
        .ticks(StravaData.length);

    var canvas = d3.select("#test")
        .append("svg")
        .attr("width", canvasWidth)
        .attr("height", canvasHeight)
        .attr("style", "background-color:#ddd");
    /* added some style*/

    //appends y axis to the canvas
    canvas.append("g")
        .attr("class", "verticalAxis")  // style axis via CSS
        .attr("transform", "translate(" + (margin.left - 2) + "," + margin.bottom + ")")
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
        .attr("width", svgWidth)
        .attr("height", svgHeight)
        .attr("style", "background-color:#ddd");
    /* added some style*/

    var svg = canvas.append('g')
        .attr("transform", "translate(" + margin.left + "," + margin.bottom + ")");

    //creates the chart
    svg.selectAll("rect")
        .data(StravaData)
        .enter()
        .append("rect")
        .attr("x", function(d, i) {return i * (svgWidth / StravaData.length);})
        .attr("y", function(d){return svgHeight - heightScale(d.maxspeed);})
        .attr("width", (svgWidth / StravaData.length) - spacing)
        .attr("height", function(d){return heightScale(d.maxspeed)})
        .attr("fill", function(d){return(colorScale(d.maxspeed));});


    //create crossfiler
    var ndx = crossfilter(StravaData);

    //define dimensions
    var distanceDim = ndx.dimension(function (d) {
        return d["Distance(Mi)"];
    });
    var dateDim = ndx.dimension(function (d) {
        return d.date;
    });
    var riderDim = ndx.dimension(function (d) {
        return d["Athlete Name"];
    });
    var elevDim = ndx.dimension(function (d) {
        return d["Elevation (Ft)"];
    });
     var yearDim = ndx.dimension(function (d) {
        return +d.Year;
    });
     var maxDim = ndx.dimension(function (d) {
         return d.maxspeed;
     });

    //groups

    var riderGroup = riderDim.group();

    var totalDistance = ndx.groupAll().reduceSum(function (d) {
        return d["Distance(Mi)"];
    });

    var totalLikes = ndx.groupAll().reduceSum(function (d) {
        return d.Kudos;
    });

    var distance = dateDim.group().reduceSum(function (d) {
        return d.distance;
    });

    /*var avgspeed = dateDim.group().reduceSum(function (d) {
        return d["Average Speed(Mph)"];
    });*/

    var maxSpeed = dateDim.group().reduceSum(function (d) {
        return d.maxspeed;
    });

    var elevation = dateDim.group().reduceSum(function (d) {
        return d["Elevation (Ft)"];
    });

    var minDate = dateDim.bottom(1)[0].date;
    var maxDate = dateDim.top(1)[0].date;

    var minDist = distanceDim.bottom(1)[0]["Distance(Mi)"];
    var maxDist = distanceDim.top(1)[0]["Distance(Mi)"];


    var year_total = yearDim.group().reduceSum(function (d) {
        return d.distance;
    });

    distancelineChart
        .width(900).height(300)
        .dimension(dateDim)
        .group(distance)
        .x(d3.time.scale().domain([minDate, maxDate]))
        .xUnits(d3.time.days)
        .yAxisLabel("Distance")
        .xAxisLabel("Month")
        .elasticY(true);

    avgLineChart
        .width(900).height(300)
        .dimension(dateDim)
        .group(maxSpeed)
        .x(d3.time.scale().domain([minDate, maxDate]))
        .xUnits(d3.time.days)
        .yAxisLabel("Max Speed(Mph)")
        .xAxisLabel("Month")
        .elasticY(true);

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
        .width(190)
        .height(190)
        .slicesCap(6)
        .innerRadius(50)
        .dimension(yearDim)
        .group(year_total);

    selectField
        .dimension(riderDim)
        .group(riderGroup);

    elevationChart
        .width(900).height(300)
        .dimension(dateDim)
        .group(elevation)
        .x(d3.time.scale().domain([minDate, maxDate]))
        .yAxisLabel("Elevation")
        .xAxisLabel("Month")
        .elasticY(true);

   dc.renderAll();}


$(document).ready(function () {
    /*setTimeout(function () {
        var getnumbers = $('.number-display').text();
        console.log(getnumbers);
        numbers = Number(getnumbers);
        if (numbers > 10000){
            $('.fact').text("That's more than going from London to Sydney three times");
        }
        else if (numbers > 5000) {
            $('.fact').text("That's more than going from London to Sydney twice");
        }

    }, 2000);

    $("#chart-ring-year").click(function () {
        setTimeout(function () {
            var getnumbers = $('.number-display').text();
            console.log(getnumbers);
            numbers = Number(getnumbers);
            if (numbers > 10000) {
                $('.fact').text("That's more than going from London to Sydney three times");
            }
            else if (numbers > 5500) {
                $('.fact').text("That's the same as London to LA");
            }
            else if (numbers > 1000) {
                $('.fact').text("That's the same as London to Naples");
            }
        }, 1000);
        });*/
    $(".hider1").click(function () {
        $("#chart-line-distance").slideToggle();
    });
    $(".hider2").click(function () {
        $("#chart-line-avg").slideToggle();
    });
    $(".hider3").click(function () {
        $("#elevation-chart").slideToggle();
    });
});