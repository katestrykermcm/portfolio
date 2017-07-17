var freq_progressive = null;
var freq_radical = null;

// grab frequency data stored in files (output from frequency.js)
d3.json("data/progressive/frequency_progressive.json", function (error, json) {
	freq_progressive = json;
});
d3.json("data/radical/frequency_radical.json", function (error, json) {
    freq_radical = json;
});


$(document).ready(function() {
    console.log('kate!');
    //d3.select("#paintingArtist").style("color", "black");
    //RunAll();
    // $(".checkboxes").click(function(){
    // });
    drawGraph(freq_radical, freq_progressive);

});


function drawGraph(data1, data2) {
    // copied from: https://bl.ocks.org/d3noob/402dd382a51a4f6eea487f9a35566de0
    // set the dimensions and margins of the graph
    var margin = {top: 20, right: 20, bottom: 30, left: 50},
        width = 1100 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    // set the ranges
    var x = d3.scaleLinear().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    // define the line
    var line = d3.line()
        .x(function(d) { 
            return x(d.year); })
        .y(function(d) { return y(d.results); });

    // append the svg obgect to the body of the page
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    var svg = d3.select("#topdiv").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

    // set scale for both axes based on data max
    // extent returns min/max value in the given array using natural order
    // x.domain(d3.extent(data1, function(d) { return d.year; }));
    // y.domain([0, d3.max(data1, function(d) { return d.results; })]);
    x.domain([1851, 2017]);
    y.domain([0, 4]);

    // add line
    svg.append("path")
        .data([data1])
        .attr("class", "line")
        .attr('stroke', "#30BFC6")
        .attr('stroke-width', 2)
        .attr('fill', 'none')
        .attr("d", line);

    // add line
    svg.append("path")
        .data([data2])
        .attr("class", "line")
        .attr('stroke', "#5D439B")
        .attr('stroke-width', 2)
        .attr('fill', 'none')
        .attr("d", line);

    // add x axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x)
            .tickFormat(d3.format("d")));

    // add y axis
    svg.append("g")
        .call(d3.axisLeft(y));
}






