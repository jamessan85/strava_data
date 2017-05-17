/**
 * Created by Administrator on 16/05/2017.
 */
var maxData = d3.max(StravaData, function (d) {
        return d.maxspeed;
    });

    var colorScale = d3.scale.linear()
                   .domain([0,d3.max(StravaData, function(d) {return d.maxspeed})])
                   .range(["blue","red"]);

    var heightScale = d3.scale.linear()
        .domain([0, StravaData])
        .range([0, svgHeight]);

    //creates a scale for the y axis
    var yAxisScale = d3.scale.linear()
        .domain([0, maxData])
        .range([svgHeight, 0]);
    //creates a scale for the x axis
    var xAxisScale = d3.scale.ordinal()
        .domain(StravaData.map(function (d) {
            return d.date;
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
        .append("text")
        .text("Bar Chart")
        .attr("x", canvasWidth / 2)
        .attr("y", 30)
        .attr("class", "title");

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
