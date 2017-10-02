(function(m) {
// MODULE FOR BACKGROUND UI ELEMENTS



    // INITIALIZE ELEMENTS INDEPENDENT OF DATA FIRST (i.e. Header and Event icons)
    m.initUi = function() {
        // FONT HEADER GENERATOR
        // 'Share Tech Mono','Squada One','Monoton',
        // font_list = ['Press Start 2P'];
        // var HTML_H1 = "<span>the</span> METAGAME";
        //
        // d3.select('#header').selectAll('h1')
        //     .data(font_list)
        //     .enter()
        //     .append('h1').html(HTML_H1)
        //     .style('font-family', function(d) { return "'" + d + "', cursive";});

        // GENERATE EVENT ICONS
        // set the default event title
        var eventTitle = d3.select('#event-title')
                            .text('~ '+ m.selectedEvent +' ~');
        // creating containers for the radio buttons
        d3.select('#container-events').selectAll('span.event-icon')
                            .data(m.VALVE_EVENTS)
                            .enter()
                            .append('span').classed('event-icon', true)
                            // generate the contents of the radio buttons
                            .each(function(d, i) {
                                var eventIcon = d3.select(this);

                                eventIcon.append('input')
                                            .attr('type', 'radio')
                                            .attr('id', m.formatString(d.event))
                                            .attr('name', 'event-button')
                                            // default check the first radio button
                                            .attr('checked', function() { if (i===0) return 'checked'; })
                                            // on change event, update the event title
                                            .on('change', function(d) {
                                                eventTitle.text('~ '+d.event+' ~');
                                                // update event filter tracker
                                                m.selectedEvent = d.event;
                                                // trigger data change
                                                m.onEventChange();
                                            });
                                eventIcon.append('label')
                                            .attr('for', m.formatString(d.event))
                                            .append('img')
                                            .attr('src', "img/" + d.img + ".png")
                                            // hide it first for transition magicxz
                                            .style('opacity', 0)
                                            // also position it slightly to the left
                                            .style('left', '-10px');
                                eventIcon.select('label img').transition().delay(i*100)
                                            .style('left', '0px')
                                            .style('opacity', 1.0);

                            });

    };

    // SORT BUTTON
    d3.select('#sort-button')
        .on('change', function() {
            console.log('sort activate!');
            var sortButton = d3.select(this);
            var checked = sortButton.property('checked');
            // update sort status
            m.toggleSort = checked;
            // update chart
            m.onEventChange();
        });

    // VIEW BUTTON
    d3.select('#view-button')
        .on('change', function() {
            console.log('view activate');
            var viewButton = d3.select(this);
            var checked = viewButton.property('checked');
            // update view status
            m.toggleView = checked;
            // init charts
            if (m.toggleView) m.initHistogram();
            else m.initChart();
            // update chart
            m.onEventChange();
        });

    // INFOBOX BUTTON
    d3.select('#infobox-button')
        .on('change', function() {
            var infoboxButton = d3.select(this);
            var checked = infoboxButton.property('checked');
            // show/hide infobox
            if (checked) {
                d3.select('#chart').transition()
                    .style('top', '135px');
                d3.select('#infobox-stats').transition().delay(250)
                    .style('opacity', 1.0);
                d3.select('#infobox-event').transition().delay(250)
                    .style('opacity', 1.0);
            }
            else {
                d3.select('#infobox-stats').transition()
                    .style('opacity', 0);
                d3.select('#infobox-event').transition()
                    .style('opacity', 0);
                d3.select('#chart').transition().delay(250)
                    .style('top', '0px');
            }
        });


}(window.m = window.m || {}));
