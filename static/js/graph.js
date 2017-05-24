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
        .margins({top: 20, left: 45, right: 10, bottom: 40})
        .xUnits(d3.time.months)
        .yAxisLabel("Distance(mi)")
        .xAxisLabel("Month")
        .elasticY(true)
        .brushOn(false);




    totalDistanceRow
        .width(400)
        .height(200)
        .margins({top: 20, left: 10, right: 10, bottom: 33})
        .dimension(ridertotalDim)
        .group(riderTotalGroup)
        .gap(2);

    totalElevRow
        .width(400)
        .height(200)
        .margins({top: 20, left: 10, right: 10, bottom: 33})
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
        .margins({top: 20, left: 45, right: 10, bottom: 40})
        .xUnits(d3.time.months)
        .x(d3.time.scale().domain([minDate, maxDate]))
        .yAxisLabel("Elevation(ft)")
        .xAxisLabel("Month")
        .elasticY(true)
        .brushOn(false);

    dc.renderAll();

function AddXAxis(totalDistanceRow, displayText)
{
    totalDistanceRow.svg()
                .append("text")
                .attr("class", "x-axis-label")
                .attr("text-anchor", "middle")
                .attr("x", totalDistanceRow.width()/2)
                .attr("y", totalDistanceRow.height()-3.5)
                .text(displayText);
}
AddXAxis(totalDistanceRow, "miles");

function AddXAxis(totalElevRow, displayText)
{
    totalElevRow.svg()
                .append("text")
                .attr("class", "x-axis-label")
                .attr("text-anchor", "middle")
                .attr("x", totalDistanceRow.width()/2)
                .attr("y", totalDistanceRow.height()-3.5)
                .text(displayText);
}
AddXAxis(totalElevRow, "ft");

}
$( document ).ready(function () {
    if(window.innerHeight > window.innerWidth){
        alert("Please rotate your device, this page is best viewed in landscape!");
    }
});




