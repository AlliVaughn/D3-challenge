// D3 Scatter plot

// When the browser window is resized, responsify() is called.

d3.select(window).on('resize', makeResponsive);

// When the browser loads, makeResponsive() is called.
makeResponsive();


// The code for the chart is wrapped inside a function that automatically resizes the chart
async function makeResponsive() {
    var svgArea = d3.select('body').select('svg');
        if (!svgArea.empty()) {
            svgArea.remove();
        }

        // SVG wrapper dimensions are determined by the current width and height of the browser window.
        var svgWidth = window.innerWidth;
        var svgHeight = window.innerHeight;

        var margin = { top: 20, right: 150, bottom: 100, left: 130 };

        var width = svgWidth - margin.left - margin.right;
        var height = svgHeight - margin.top - margin.bottom;

        
        var svg = d3
            .select('.chart')
            .append('svg')
            .attr('height', svgHeight)
            .attr('width', svgWidth)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // Append an SVG group
        var chart = svg.append("g");

        // Append a div to the body to create tooltips, assign it a class
        d3.select(".chart").append("div").attr("class", "tooltip").style("opacity", 0);

        // Retrieve data from the CSV file and execute everything below
        d3.csv("static/data/data.csv", function( my_data) {
        // if (err) throw err;
        // Columns: state,abbr,poverty,povertyMoe,age,ageMoe,income,incomeMoe,
        // healthcare,healthcareLow,healthcareHigh,obesity,obesityLow,obesityHigh,smokes,smokesLow,smokesHigh
        my_data.forEach(function(data) {
            data.age = +data.age;
            data.income = +data.income;
            data.obesity = +data.obesity;
            data.healthcare = +data.healthcare;
            data.poverty = +data.poverty;
            data.smoke = +data.smokes;
            // console.log(data.abbr, data.obesity, data.healthcare); 
        });

        // Create scale functions
        var yLinearScale = d3.scaleLinear().range([height, 0]);
        var xLinearScale = d3.scaleLinear().range([0, width]);

        // Create axis functions
        var bottomAxis = d3.axisBottom(xLinearScale);
        var leftAxis = d3.axisLeft(yLinearScale);

        // These variables store the minimum and maximum values in a column in data.csv
        var xMin;
        var xMax;
        var yMin;
        var yMax;

        // This function identifies the minimum and maximum values in a column in data.csv
        // and assign them to xMin, xMax, yMin, yMax variables, which will define the axis domain
        function calcMinMax(dataColumnX, dataColumnY) {
            xMin = d3.min(my_data, function(data) {
            return +data[dataColumnX] * 0.8;
            });

            xMax = d3.max(my_data, function(data) {
            return +data[dataColumnX] * 1.1;
            });

            yMin = d3.min(my_data, function(data) {
            return +data[dataColumnY] * 0.8;
            });

            yMax = d3.max(my_data, function(data) {
            return +data[dataColumnY] * 1.1;
            });
        }

        
        var newestBourgeoisieX = "income";
        var newestProliteriatY = "age";
        
        calcMinMax(newestBourgeoisieX, newestProliteriatY);

        xLinearScale.domain([xMin, xMax]);
        yLinearScale.domain([yMin, yMax]);

        //Init Tooltip
        var toolTip = d3
            .tip()
            .attr("class", "d3-tip")
            //position
            .offset([0, 0])
            .html(function(data) {
            var states = data.abbr;
            var valueX = +data[newestBourgeoisieX];
            var valueY = +data[newestProliteriatY];
            var stringX;
            var stringY;
            
            // set tool tips for each axis that's clicked
            if (newestBourgeoisieX === "income") {
                stringX = "Avg Income: ";
                stringY = "Avg Age: ";
            }
            else if (newestBourgeoisieX === "obesity") {
                stringX = "% Obese: ";
                stringY = "% Uninsured: ";
            }
            else {
                stringX = "% in Poverty: "
                stringY = "% Smokers: ";
            }
            return states +
                "<br>" +
                stringX +
                valueX +
                "<br>" +
                stringY +
                valueY;
            });
            
        // Create tooltip
        chart.call(toolTip);
        
        // circle
        chart
            .selectAll("circle")
            .data(my_data)
            .enter()
            .append("circle")
            .attr("cx", function(data, index) {
            return xLinearScale(+data[newestBourgeoisieX]);
            })
            .attr("cy", function(data, index) {
            return yLinearScale(+data[newestProliteriatY]);
            })
            .attr("r", "18")
            .attr("fill", "#20BDC3")
            .attr("class", "circle")
            // display tooltip by d3-Tip
            .on('mouseover', toolTip.show)
            .on('mouseout', toolTip.hide);
        
        // use the state abbreviation inside the circle
        chart
            .selectAll("text")
            .data(my_data)
            .enter()
            .append("text")
            .attr("x", function(data, index) {
            return xLinearScale(+data[newestBourgeoisieX]);
            })
            .attr("y", function(data, index) {
            return yLinearScale(+data[newestProliteriatY]);
            })
            .attr("dx", "-0.65em")
            .attr("dy", "0.4em")
            .style("font-size", "13px")
            // initial
            .style("fill", "obesity")
            .attr("class", "abbr")
            .text(function(data, index) {
            return data.abbr;
            });

        // X axis group, then display 
        chart
            .append("g")
            .attr("transform", "translate(0," + height + ")")
            // transitions
            .attr("class", "x-axis")
            .call(bottomAxis);

        // yaxis group
        chart
            .append("g")
            .attr("class", "y-axis")
            .call(leftAxis);

        // 1 y-axis label
        chart
            .append("text")
            .attr("transform", "rotate(-90)")
            //adjust position to prevent overlap
            .attr("y", 0 - margin.left + 80)
            .attr("x", 0 - height / 2)
            .attr("dy", "1em")
            .attr("class", "axis-text change")
            .attr("jeanValjean", "age")
            .attr("id", "age")
            .text("Age (Yrs)");
        //2 y-axis label
        chart
            .append("text")
            .attr("transform", "rotate(-90)")
            //adjust position to prevent overlap
            .attr("y", 0 - margin.left + 55)
            .attr("x", 0 - height / 2)
            .attr("dy", "1em")
            .attr("class", "axis-text unchange")
            .attr("jeanValjean", "healthcare")
            .attr("id", "healthcare")
            .text("Health Insurance - Uninsured(%)");
        // 3 y-axis label 
        chart 
            .append("text")
            .attr("transform", "rotate(-90)")
            //adjust position to prevent overlap
            .attr("y", 0 - margin.left + 30)
            .attr("x", 0 - height / 2)
            .attr("dy", "1em")
            .attr("class", "axis-text unchange")
            .attr("jeanValjean", "smoke")
            .attr("id", "smoke")
            .text("Smokers(%)");

        // 1 x-axis label
        chart
            .append("text")
            //adjust position to prevent overlap
            .attr(
            "transform",
            "translate(" + width / 2 + " ," + (height + margin.top + 20) + ")"
            )
            // active to begin
            .attr("class", "axis-text active")
            .attr("jeanValjean", "income")
            .text("Income level: Income in 10,000's");
        // 2 x-axis label
        chart
            .append("text")
            //adjust position to prevent overlap
            .attr(
            "transform",
            "translate(" + width / 2 + " ," + (height + margin.top + 45) + ")"
            )
            // inactive to begin
            .attr("class", "axis-text inactive")
            .attr("jeanValjean", "obesity")
            .text("Obesity: Percent Obese ");
        // 3 x-axis label
        chart
            .append("text")
            //adjust position to prevent overlap
            .attr(
            "transform",
            "translate(" + width / 2 + " ," + (height + margin.top + 70) + ")"
            )
            // inactive to begin
            .attr("class", "axis-text inactive")
            .attr("jeanValjean", "poverty")
            .text("Population:  Poverty(%)");

        // on click,  reverse axis polarity  
        function labelChange(mayorOfX, otherAxis) {
            d3
            .selectAll(".axis-text")
            // used in place of .attr
            .filter(".active")
            .classed("active", false)
            .classed("inactive", true);

            d3
            .selectAll(".axis-text")
            .filter(".change")
            .classed("change", false)
            .classed("unchange", true);

            mayorOfX.classed("inactive", false).classed("active", true);
            otherAxis.classed("unchange", false).classed("change", true);
        }

            d3.selectAll(".axis-text").on("click", function() {
                //my selction is a variable
                var mySelection = d3.select(this);
                // boolean for status
                var isMySelectionInactive = mySelection.classed("inactive");
                
                console.log("inactive: ", isMySelectionInactive)

                // Who am I?  Prisoner 24601:   AKA "Mayor"
                var mayorOfX = mySelection.attr("jeanValjean");
                
                // change of other Axis when This (x-axis) is active
                var otherAxis;

                if (mayorOfX === "income") {
                    otherAxis = d3.select("#age");
                }
                else if (mayorOfX === "obesity") {
                    otherAxis = d3.select("#healthcare");
                }
                else {
                    otherAxis = d3.select("#smoke");
                }

                
                if (isMySelectionInactive) {
                    newestBourgeoisieX
                    newestBourgeoisieX = mayorOfX;
                    newestProliteriatY = otherAxis.attr("jeanValjean");
                //define the min and max domain values.
                calcMinMax(newestBourgeoisieX,newestProliteriatY);
                // Set the x-axis
                xLinearScale.domain([xMin, xMax]);
                yLinearScale.domain([yMin, yMax]);

                // transitions x-axis
                svg
                    .select(".x-axis")
                    .transition()
                    .duration(1000)
                    .call(bottomAxis);

                // transitions x-axis
                svg
                    .select(".y-axis")
                    .transition()
                    .duration(1000)
                    .call(leftAxis);

                // select and return the circles
                d3.selectAll("circle").each(function() {
                    d3
                    .select(this)
                    .transition()
                    .attr("cx", function(data) {
                        return xLinearScale(+data[newestBourgeoisieX]);
                    })
                    .attr("cy", function(data, index) {
                        return yLinearScale(+data[newestProliteriatY]);
                    })
                    .duration(1800);
                });

                // select and return the State Abbreviations 
                d3.selectAll(".abbr").each(function() {
                    d3
                    .select(this)
                    .transition()
                    .attr("x", function(data) {
                        return xLinearScale(+data[newestBourgeoisieX]);
                    })
                    .attr("y", function(data, index) {
                        return yLinearScale(+data[newestProliteriatY]);
                    })
                    .duration(1800);
                });
                // label change 
                labelChange(mySelection, otherAxis);
                }
            });
    });
}



