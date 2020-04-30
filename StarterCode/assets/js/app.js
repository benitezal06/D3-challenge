// Step 1: Set up our chart
function makeResponsive() {
// var svgWidth = 560;
// var svgHeight = 300;

var margin = 20;
var labelArea = 110;
var ButtonPadding = 40;
var leftPadding = 40;

var width = parseInt(d3.select("#scatter").style("width"))
var height = width - (width/3.9);
//   var width = svgWidth - margin.left - margin.right;
//   var height = svgHeight - margin.top - margin.bottom;

// Step 2: Create an SVG wrapper,
  var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

var chartGroup = svg.append("g")
//   .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Step 3:
// Import data from the donuts.csv file
// Format the data and convert to numerical and date values
// Create a function to parse date and time

d3.csv("assets/data/data.csv").then(function(trendsData) {
    //console.log(trendsData);
    trendsData.forEach(function(data) {
        data.age = +data.age;
        //console.log(data.age)
        data.smokes = +data.smokes;
        //console.log(data.smokes)
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;
        data.abbr = data.abbr;
        data.income = +data.income;
        // console.log(data.income)
    })
    console.log(d3.extent(trendsData, d => d.poverty))
    var xTimeScale = d3.scaleLinear()
    .domain([9.2 * .90, 21.5 * 1.10])
    .range([margin + labelArea, width - margin]);
    // console.log(xTimeScale(10));


    var yTimeScale = d3.scaleLinear()
    .domain([d3.min(trendsData, d => d.healthcare) * .90, d3.max(trendsData, d => d.healthcare) * 1.10])
    .range([height - margin - labelArea,margin]);
    // console.log(yTimeScale(10))

    // create axes
    var xAxis = d3.axisBottom(xTimeScale).ticks(10)
    var yAxis = d3.axisLeft(yTimeScale).ticks(10);

    // append axes
    chartGroup.append("g")
    .attr("transform", "translate(0," + (height- margin- labelArea + ")"))
    .call(xAxis).attr("class","xAxis")
    console.log(height)

    chartGroup.append("g")
        .attr("transform", "translate(" + (margin + labelArea) + ",0)")
        .call(yAxis).attr("class","yAxis")

    var circlesGroup = chartGroup.selectAll("g circle")
    .data(trendsData)
    .enter()
    .append("circle")
    .attr("cx", d => xTimeScale(d.poverty))
    .attr("cy", d => yTimeScale(d.healthcare))
    .attr("r", "9")
    .attr("fill", "rgb(0,255,255)")
    .attr("opacity", ".6")
    .attr("stroke-width", "1")
    .attr("stroke", "black");

    chartGroup.select("g")
    .selectAll("circle")
    .data(trendsData)
    .enter()
    .append("text")
    .text(d => d.abbr)
    .attr("x", d => xTimeScale(d.poverty))
    .attr("y", d => yTimeScale(d.healthcare))
    .attr("dy",-480)
    .attr("text-anchor", "middle")
    .attr("font-size", "11px")
    .attr("fill", "black");

    //Initialize tool tip
    var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.state}<br> <strong> Poverty:${d.poverty}%<br> Healthcare: ${d.healthcare}%</strong>`);
    });

    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);


    circlesGroup.on("mouseover", function(data) {
        toolTip.show(data, this);
        toolTip.style("display", "block"); 
      })
        // onmouseout event
        .on("mouseout", function(data, index) {
          toolTip.hide(data);
        });
    

    chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", - -100 - margin.left + 40)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Lacks Healthcare (%)");
    

    chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, 530)`)
    .attr("class", "axisText")
    .text("In Poverty (%)");


    });



}
makeResponsive()
// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);
