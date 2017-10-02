(function(m) {
// Module that contains all the code for the essay portion charts etc.

    // Essay toggle button
    d3.select('#essay-button').on('change', function() {
        // console.log('essay buttonzzz');
        var button = d3.select(this);
        var buttonz = d3.select('#essay-button + label div');
        var checked = button.property('checked');
        var essay = d3.select('#container-essay');
        // toggle essay window
        if (checked) {
            essay.transition().duration(500)
                .style('left', '0px');
            buttonz
                .text('<');
        }
        else {
            essay.transition().duration(500)
                .style('left', '-450px');
            buttonz
                .text('>');
        }
    });

    m.initChartOveralltrend = function() {
        var data = m.data.map(function(d) {
            // return Math.round(((d.picked_banned_heroes/d.total_heroes)*100)*10) / 10;
            return ((d.picked_banned_heroes/d.total_heroes)*100).toFixed(1);
        });
        // console.log(data);
        var chartHolder = d3.select('#chart-overalltrend')
                                .style('height', '400px')
                                .style('width', '450px');
                                // .style('background-color', 'white');
        var margin = {top:70, right:30, bottom:30, left:50};

        var boundingRect = chartHolder.node().getBoundingClientRect();
        var width = boundingRect.width - margin.left - margin.right,
            height = boundingRect.height - margin.top - margin.bottom;

        var chart = chartHolder.append('svg')
                        .attr('width', width + margin.left + margin.right)
                        .attr('height', height + margin.top + margin.bottom)
                        .append('g')
                        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
        // scales
        var xScale = d3.scaleBand()
                        .padding(0.4)
                        .domain(d3.range(10))
                        .range([0, width]);
        var yScale = d3.scaleLinear()
                        .domain([0, 100])
                        .range([height, 0]);
        // axes
        function customYAxis(g) {
            g.call(yAxis);
            g.select('.domain').remove();
            g.selectAll('line').style('stroke', '#424242');
            g.selectAll('text').style('fill', '#9E9E9E')
                                .style('font-family', "'Roboto Mono', monospace")
                                .attr('dx', -4);

        }
        var yAxis = d3.axisLeft()
                        .scale(yScale)
                        .tickSize(-width)
                        .tickValues([0, 75, 100])
                        .tickFormat(function(d) { return d+'%'; });
        chart.append('g').call(customYAxis);
        function customXAxis(g) {
            g.call(xAxis);
            g.select('.domain').remove();
            g.selectAll('text').remove();
        }
        var xAxis = d3.axisBottom()
                        .scale(xScale)
                        .tickSize(0);
        chart.append('g').attr('transform', 'translate(0,' + height + ')')
                        .call(customXAxis);
        // render the chart
        chart.selectAll('rect.whole')
                .data(data)
                .enter()
                .append('rect').classed('whole', true)
                .attr('width', xScale.bandwidth)
                .attr('height', height-1)
                .attr('x', function(d, i) { return xScale(i); })
                .attr('y', 1)
                .style('fill', '#212121')
                .style('stroke-width', 0);
        chart.selectAll('rect.portion')
                .data(data)
                .enter()
                .append('rect').classed('portion', true)
                .attr('width', xScale.bandwidth)
                .attr('height', function(d) { return yScale(100 - d); })
                .attr('x', function(d, i) { return xScale(i); })
                .attr('y', function(d) { return height - yScale(100-d); })
                .style('fill', function(d, i) {
                    return i==9 ? '#64FFDA' : '#00695C';
                })
                .style('stroke-width', 0);
        // chart title
        chart.append('text').classed('chart-title', true)
                .text('% of Heroes Picked/Banned in Valve Events')
                .attr('x', 0)
                .attr('y', -50);
        // labels
        function labelStyling(g) {
            g.style('font-family', "'Roboto Mono', monospace")
            .style('font-size', '13px')
            .style('font-weight', 700)
            .style('fill', '#9E9E9E')
            .attr('y', height+20);
        }
        chart.append('text').text('ti3')
                .call(labelStyling)
                .attr('x', xScale(0));
        chart.append('text').text('ti4')
                .call(labelStyling)
                .attr('x', xScale(1));
        chart.append('text').text('ti5')
                .call(labelStyling)
                .attr('x', xScale(2));

        chart.append('text').text('ti6')
                .call(labelStyling)
                .attr('x', xScale(6));

        chart.append('text').text('Kiev')
                .call(labelStyling)
                .attr('x', xScale(8)-5);
        chart.append('text').text('ti7')
                .call(labelStyling)
                .attr('x', xScale(9));
        chart.append('text').text(data[9]+'%')
                .call(labelStyling)
                .style('fill', '#64FFDA')
                .style('font-weight', 400)
                .attr('x', xScale(9)-4)
                .attr('y', -10);
        chart.append('text').text(data[3]+'%')
                .call(labelStyling)
                .style('fill', '#00695C')
                .attr('x', xScale(3)-4)
                .attr('y', -10);
    };


    m.initChartMedian = function() {
        var data = m.data.map(function(d) {
            return d.median.toFixed(1);
        });
        // console.log(data);
        var chartHolder = d3.select('#chart-median')
                                .style('height', '250px')
                                .style('width', '450px');
                                // .style('background-color', 'white');
        var margin = {top:70, right:30, bottom:30, left:50};

        var boundingRect = chartHolder.node().getBoundingClientRect();
        var width = boundingRect.width - margin.left - margin.right,
            height = boundingRect.height - margin.top - margin.bottom;

        var chart = chartHolder.append('svg')
                        .attr('width', width + margin.left + margin.right)
                        .attr('height', height + margin.top + margin.bottom)
                        .append('g')
                        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
        // scales
        var xScale = d3.scalePoint()
                        .domain(d3.range(10))
                        .range([0, width])
                        .padding(0.1);
        var yScale = d3.scaleLinear()
                        .domain([4, 12])
                        .range([height, 0]);
        // axes
        function customYAxis(g) {
            g.call(yAxis);
            g.select('.domain').remove();
            g.selectAll('line').style('stroke', '#424242');
            g.selectAll('text').style('fill', '#9E9E9E')
                                .style('font-family', "'Roboto Mono', monospace")
                                .attr('dx', -4);
        }
        var yAxis = d3.axisLeft()
                        .scale(yScale)
                        .tickSize(-width)
                        .ticks(3)
                        .tickFormat(function(d) { return d+'%'; });
        chart.append('g').call(customYAxis);
        function customXAxis(g) {
            g.call(xAxis);
            g.select('.domain').remove();
            g.selectAll('text').remove();
        }
        var xAxis = d3.axisBottom()
                        .scale(xScale)
                        .tickSize(0);
        chart.append('g').attr('transform', 'translate(0,' + height + ')')
                        .call(customXAxis);

        // render the chart
        chart.selectAll('circle')
                .data(data)
                .enter()
                .append('circle')
                .attr('cx', function(d, i) { return xScale(i); })
                .attr('cy', function(d) { return yScale(d); })
                .attr('r', 5)
                .style('fill', function(d,i) {
                    return i==9 ? '#64FFDA' : '#00695C';
                });
        // chart title
        chart.append('text').classed('chart-title', true)
                .text('Change in Median Value of Pick/Ban Rates')
                .attr('x', 0)
                .attr('y', -50);
        // labels
        function labelStyling(g) {
            g.style('font-family', "'Roboto Mono', monospace")
            .style('font-size', '13px')
            .style('font-weight', 700)
            .style('fill', '#9E9E9E')
            .attr('y', height+20);
        }
        chart.append('text').text(data[9]+'%')
                .call(labelStyling)
                .style('fill', '#64FFDA')
                .attr('x', xScale(9)-50)
                .attr('y', -15);
        chart.append('text').text('ti7')
                .call(labelStyling)
                .attr('x', xScale(9)-20);
    };


}(window.m = window.m || {}));
