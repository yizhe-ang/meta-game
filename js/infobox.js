(function(m) {
// Module that updates the data in the infoboxes

    // // FUNCTION THAT CALCULATES THE OVERALL HERO PICK/BAN %
    // function calPickBanRate(data) {
    //     var total = 113;
    //     var count = 113;
    //     data.forEach(function(d) {
    //         if (isNaN(d.pick_ban_rate)) {
    //             total -= 1;
    //             count -= 1;
    //         }
    //         if (d.pick_ban_rate === 0) count -= 1;
    //     });
    //     return ((count/total)*100).toFixed(1) + '%';
    // }

    // Scale for Heroes Picked/Banned & Bar
    var barScale = d3.scaleLinear()
                        .domain([0, 100])
                        .range([0, 940]);

    // color scale for text elements (rates)
    var textColor = ['#9E9E9E','#64FFDA'];
    // var textColor = ['#e5f5f9', '#2ca25f'];
    var stat1ColorScale = d3.scaleLinear()
                            .range(textColor);
    var stat2ColorScale = d3.scaleLinear()
                            .range(textColor);
    var stat3ColorScale = d3.scaleLinear()
                            .range(textColor);
    var stat4ColorScale = d3.scaleLinear()
                            .domain([70, 100])
                            .range(['#000000','#64FFDA']);



    // Setting up the variables for the LINE CHART
    var chartHolder = d3.select('#hero-chart');
    var margin = {top:10, right:6, bottom:5, left:50};

    var boundingRect = chartHolder.node().getBoundingClientRect();
    var width = boundingRect.width - margin.left - margin.right,
        height = boundingRect.height - margin.top - margin.bottom;

    var chart = chartHolder.append('svg')
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
                .append('g').classed('chart', true)
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
    // scales
    var xScale = d3.scalePoint()
                    .domain(m.VALVE_EVENTS.map(function(d) { return d.event; })) // list of all the valve events
                    .range([0, width]);
    var yScale = d3.scaleLinear()
                    .domain([0, 100])
                    .range([height, 0]);
    // axes
    var yAxis = d3.axisLeft()
                    .scale(yScale)
                    .tickSize(-width)
                    .ticks(3)
                    .tickFormat(function(d) { return d+'%'; });
    chart.append('g').attr('id', 'yAxisG').attr('class', 'axis').call(yAxis);
    var xAxis = d3.axisBottom()
                    .scale(xScale)
                    .tickSize(0);
    chart.append('g').attr('transform', 'translate(0,' + height + ')')
                    .attr('id', 'xAxisG').attr('class', 'axis').call(xAxis);
    // event line
    var eventLine = chart.append('line');
    // line chart
    var path = chart.append('path');


    // line generator
    var line = d3.line()
                    // account for the NaN values
                    .defined(function(d) { return d.pick_ban_rate !== null; })
                    .x(function(d) { return xScale(d.event); })
                    .y(function(d) { return yScale(d.pick_ban_rate); });

    // function that determines the color of the circle in the line chart
    function circleColor(value) {
        return value===null||value===0 ? 'none' : 'white';
        // return value===null ? 'none' : value===0 ? 'white' : 'white';
        // highlight the event that is selected

    }









    // FUNCTION FOR INITIALIZING THE INFOBOX
    m.initInfobox = function() {
        // Initial values will be based on the hero Anti-Mage, and event TI3
        // Update text color scales domain
        // stat1ColorScale.domain(d3.extent(m.data[0].values, function(d) { return d.pick_ban_rate; }));
        // stat2ColorScale.domain(d3.extent(m.data[0].values, function(d) { return d.pick_rate; }));
        // stat3ColorScale.domain(d3.extent(m.data[0].values, function(d) { return d.ban_rate; }));
        // Initalize Hero Stats
        var d = m.data[0].values[0]; // the first data object
        d3.select('#hero-name').text(d.hero);
        d3.select('#stat-1').text(d.pick_ban_rate === null ? 'NA' : d.pick_ban_rate.toFixed(1) + '%');
                                // .style('color', stat1ColorScale(d.pick_ban_rate));
        d3.select('#stat-2').text(d.pick_ban_rate === null ? 'NA' : d.pick_rate.toFixed(1) + '%');
                                // .style('color', stat2ColorScale(d.pick_rate));
        d3.select('#stat-3').text(d.pick_ban_rate === null ? 'NA' : d.ban_rate.toFixed(1) + '%');
                                // .style('color', stat3ColorScale(d.ban_rate));
        d3.select('#stat-5 span:first-child').text(d.no_picks_bans);
        d3.select('#stat-5 span:nth-child(2)').text(m.data[0].total_games);
        // Initialize event bar
        d3.select('div#event-bar').style('width', barScale(((m.data[0].picked_banned_heroes/m.data[0].total_heroes)*100))+'px');
        // initialize event stat
        d3.select('#stat-4 em').text( ((m.data[0].picked_banned_heroes/m.data[0].total_heroes)*100).toFixed(1)+'%');
                            // .style('color', stat4ColorScale(((m.data[0].picked_banned_heroes/m.data[0].total_heroes)*100)));
        // Initialize line chart
        // create data object
        var data = m.data.map(function(event) { // array of hero objects for each event
            return event.values.filter(function(e) { return e.hero == d.hero; })[0];
        });


        // append a circle for each data point
        chart.selectAll('circle')
                .data(data)
                .enter()
                .append('circle');
        chart.selectAll('circle')
                .style('stroke-width', 1)
                .attr('r', 4)
                .attr('cx', function(d) { return xScale(d.event); })
                .attr('cy', function(d) { return yScale(d.pick_ban_rate === null ? 0 : d.pick_ban_rate); })
                .style('fill', function(d) { return circleColor(d.pick_ban_rate); });
                // .style('opacity', function(d) {
                //     return d.pick_ban_rate===null ? 0 : d.pick_ban_rate===0 ? 0.5 : 1.0;
                // });
        // horizontal line to indicate selected event
        eventLine
            .attr('x1', xScale(m.selectedEvent))
            .attr('x2', xScale(m.selectedEvent))
            .attr('y1', 0)
            .attr('y2', height)
            .style('stroke', '#212121')
            .style('stroke-width', 10);
        // draw the line chart
        path
                .attr('d', line(data))
                .attr('fill', 'none')
                .attr('stroke', 'white')
                .style('opacity', 0.5)
                .attr('stroke-width', 2);
        // customize text on line chart
        d3.selectAll('#yAxisG text')
            .attr('dx', '-7');




    };








    // UPDATE FUNCTION FOR LINE CHART
    m.updateLinechart = function(d) {
        // create data object
        var data = m.data.map(function(event) { // array of hero objects for each event
            return event.values.filter(function(e) { return e.hero == d.hero; })[0];
        });
        // console.log(data);

        // draw the line chart
        path
        // .transition()
                .attr('d', line(data));
        // update circles for each data point
        chart.selectAll('circle')
                .data(data)
                // .transition()
                .attr('cx', function(d) { return xScale(d.event); })
                .attr('cy', function(d) { return yScale(d.pick_ban_rate === null ? 0 : d.pick_ban_rate); })
                .style('fill', function(d) { return circleColor(d.pick_ban_rate); });
                // .style('opacity', function(d) {
                //     return d.pick_ban_rate===null ? 0 : d.pick_ban_rate===0 ? 0.5 : 1.0;
                // });

    };








    // UPDATE FUNCTION FOR HERO INFOBOX ELEMENTS
    m.updateHeroInfo = function(d) {
        // Update Overall Heroes Pick Ban Rate
        // d3.select('#value-one')
        //     .text( ((data.picked_banned_heroes/data.total_heroes)*100).toFixed(1)+'%');
        // d3.select('#value-two')
        //     .text(data.ave_pick_ban_rate.toFixed(1)+'%');

        // var PBData = ((data.picked_banned_heroes/data.total_heroes)*100).toFixed(1);

        // UPDATE HERO STATS
        // d3.select('#hero-name').text(d.hero);
        // d3.select('#stat-1 em').text(d.pick_ban_rate === null ? 'NA' : d.pick_ban_rate.toFixed(1) + '%');
        // d3.select('#stat-2 em').text(d.pick_ban_rate === null ? 'NA' : d.pick_rate.toFixed(1) + '%');
        // d3.select('#stat-3 em').text(d.pick_ban_rate === null ? 'NA' : d.ban_rate.toFixed(1) + '%');

        d3.select('#hero-name').text(d.hero);
        d3.select('#stat-1').text(d.pick_ban_rate === null ? 'NA' : d.pick_ban_rate.toFixed(1) + '%');
                                // .style('color', stat1ColorScale(d.pick_ban_rate));
        d3.select('#stat-2').text(d.pick_ban_rate === null ? 'NA' : d.pick_rate.toFixed(1) + '%');
                                // .style('color', stat2ColorScale(d.pick_rate));
        d3.select('#stat-3').text(d.pick_ban_rate === null ? 'NA' : d.ban_rate.toFixed(1) + '%');
                                // .style('color', stat3ColorScale(d.ban_rate));
        d3.select('#stat-5 span:first-child').text(d.no_picks_bans);




        // UPDATE THE LINE CHART
        m.updateLinechart(d);
    };






    // UPDATE FUNCTION FOR EVENT INFOBOX ELEMENTS
    m.updateEventInfo = function(data) {
        // horizontal line to indicate selected event
        eventLine
            .attr('x1', xScale(m.selectedEvent))
            .attr('x2', xScale(m.selectedEvent));

        // update domain of the text colors scale
        stat1ColorScale.domain(d3.extent(data.values, function(d) { return d.pick_ban_rate; }));
        stat2ColorScale.domain(d3.extent(data.values, function(d) { return d.pick_rate; }));
        stat3ColorScale.domain(d3.extent(data.values, function(d) { return d.ban_rate; }));

        // update event stat
        d3.select('#stat-4 em').text( ((data.picked_banned_heroes/data.total_heroes)*100).toFixed(1)+'%');
                            // .style('color', stat4ColorScale(((data.picked_banned_heroes/data.total_heroes)*100)));
        d3.select('#stat-5 span:nth-child(2)').text(data.total_games);
        // update event bar
        // console.log( ((data.picked_banned_heroes/data.total_heroes)*100) );
        d3.select('div#event-bar').transition()
            .style('width', barScale( ((data.picked_banned_heroes/data.total_heroes)*100) )+'px');
    };




}(window.m = window.m || {}));
