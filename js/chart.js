(function(m) {
// MODULE THAT RENDERS THE SYMBOL CHART

    // Dimensions of chart
    var HEIGHT = 500;
    var WIDTH = 900;
    // Determines size of hero icon
    function heroSize(rate) {
        return (rate === 0) ? 1.0 : heroSizeScale(rate);
    }

    // scale that varies the size of the hero icon with regards to the pick/ban rate
    var heroSizeScale = d3.scaleLinear()
                            .domain([0.0, 100.0])
                            .range([0.7, 2.5]);

    // scale for brightness of the hero icon, with regards to ???
    var heroBrightnessScale = d3.scaleLinear()
                                    .domain([0.0, 100.0])
                                    .range([50, 170]);

    // Determines opacity of hero icon
    function heroOpacity(rate) {
        return rate === null ? 0 : 1.0;
    }

    // Key function for hero data
    function key(d) {
        return d.hero;
    }

    // Sort dataset by Pick Ban Rate
    function sortByPBRate(data) {
        var nData = data.sort(function(a, b) {
            // Decide based on 1. Attribute, then 2. Pick Ban Rate (NaN goes to the bottom)
            if (a.attribute==b.attribute) { // if attribute is the same, sort by pick ban rate
                if (a.pick_ban_rate===null || b.pick_ban_rate===null) return a.pick_ban_rate===null ? 1 : -1; // account whether a or b are NaN values first
                else return a.pick_ban_rate>b.pick_ban_rate ? -1 : a.pick_ban_rate<b.pick_ban_rate ? 1 : 0;
            }
            else { // else sort based on attribute
                return a.attribute<b.attribute ? -1 : 1;
            }
        });
        return nData;
    }

    // Sort dataset by Hero Name
    function sortByHeroName(data) {
        var nData = data.sort(function(a, b) {
            if (a.attribute==b.attribute) {
                return a.hero<b.hero ? -1 : a.hero>b.hero ? 1 : 0;
            }
            else {
                return a.attribute<b.attribute ? -1 : 1;
            }
        });
        return nData;
    }

    // Determines position of hero icon
    // this object contains the left margin and number of icons for each attribute container
    var ATTR = {
        'Agility': { 'margin': 10, 'i': 0 },
        'Intelligence': { 'margin': 330, 'i': 36 },
        'Strength': { 'margin': 650, 'i': 76 }
    };
    var HERO_MARGIN = 17;
    var HERO_SIZE = 32;

    // 6 columns for each attribute
    function heroTop(d, i) {
        var attr = d.attribute;
        var top = HERO_MARGIN + (Math.floor( (i-ATTR[attr].i) /6)) * (HERO_MARGIN+HERO_SIZE);
        return top + 'px';
    }
    function heroLeft(d, i) {
        var attr = d.attribute;
        var left = ATTR[attr].margin + ( (i-ATTR[attr].i) %6) * (HERO_MARGIN+HERO_SIZE);
        return left + 'px';
    }


    // FUNCTION THAT INITIALIZES CHART INDEPENDENT OF DATA
    m.initChart = function() {
        d3.select('#chart').select('#container-histogram').remove();
        d3.selectAll('.axis-label').remove();
        d3.select('#median-line').remove();
        d3.select('#median-text').remove();
        // Render attribute boxes
        d3.select('#chart').selectAll('div.container-heroes')
                                    .data(d3.keys(ATTR))
                                    .enter()
                                    .append('div')
                                    .attr('class', function(d) { return m.formatString(d); })
                                    .classed('container-heroes', true)
                                    // fade them in
                                    .style('opacity', 0)
                                    .transition()
                                    .style('opacity', 1.0);
        // Filter dataset by one event
        var nData = m.filterByEvent(m.data, m.selectedEvent);
                        // sort by attribute then by name
                        // .sort(function(a, b) {
                        //     if (a.attribute==b.attribute) {
                        //         return a.hero<b.hero ? -1 : a.hero>b.hero ? 1 : 0;
                        //     }
                        //     else {
                        //         return a.attribute<b.attribute ? -1 : 1;
                        //     }
                        // });
        // console.log(nData);
        // Render hero icon with its default positons
        d3.select('#chart').selectAll('a.hero-icon')
                        .data(nData.values, key)
                        .enter()
                        .append('a')
                        .attr('class', function(d) { return m.formatString(d.hero); })
                        .classed('hero-icon', true)
                        .style('top', heroTop)
                        .style('left', heroLeft)
                        ;
    };


    // FUNCTION THAT UPDATES CHART WHENEVER DATA CHANGES
    m.updateChart = function(data) {
        // console.log(m.selectedEvent);
        // filters data by event first

                        // .sort(function(a, b) {
                        //     if (a.attribute==b.attribute) {
                        //         if (isNaN(a.pick_ban_rate)) return 1;
                        //         return a.pick_ban_rate>b.pick_ban_rate ? -1 : a.pick_ban_rate<b.pick_ban_rate ? 1 : 0;
                        //     }
                        //     else {
                        //         return a.attribute<b.attribute ? -1 : 1;
                        //     }
                        // });
        // then nests data by attribute
        // var nestedData = d3.nest()
        //             // sort by hero name
        //             .sortValues(function(a, b) { return a.hero<b.hero ? -1 : a.hero>b.hero ? 1 : 0; })
        //             .key(function(d) { return d.attribute; })
        //             .entries(nData);
        var nData;
        // Sort data first if sort button is toggled i.e. sort by attribute and then by pick_ban_rate
        // console.log(m.toggleSort);
        if (m.toggleSort) nData = sortByPBRate(data.values);
        else nData = sortByHeroName(data.values);
        // console.log(nData);

        // Update Hero Icons - Size, Opacity, Brightness etc.
        var heroIcons = d3.selectAll('a.hero-icon')
                            .data(nData, key);

        heroIcons
                    // .classed('grayscale', function(d) { return d.pick_ban_rate === 0; })
                    // render size with regards to pick/ban rate
                    // .style('top', heroTop)
                    // .style('left', heroLeft)
                    .style('transform', function(d) { return 'scale(' + heroSize(d.pick_ban_rate) + ')'; })
                    // render brightness
                    // .style('filter', function(d) { return 'brightness(' + heroBrightnessScale(d.pick_ban_rate) + '%)'; });
                    .style('opacity', function(d) { return heroOpacity(d.pick_ban_rate); })
                    .classed('darken', function(d) { return d.pick_ban_rate === 0; })
                    .classed('darkish', false)
                    // render positions
                    .style('top', heroTop)
                    .style('left', heroLeft)
                    // on hover, update the infobox for information on each hero
                    // .on('mouseover', function(d) {
                    //     console.log('hero hovered!');
                    //     m.selectedHero = d.hero;
                    //     // update the infobox
                    //     m.updateHeroInfo(d);
                    // });
                    .on('click', function(d) {
                        // console.log('hero clicked!');
                        m.selectedHero = d.hero;
                        // update the infobox
                        m.updateHeroInfo(d);
                    });


    };



    // Scale for the x axis of the histogram
    var xScale = d3.scaleLinear()
                    .domain([0, 40]) // number of bins - 1
                    .range([WIDTH, 0]);
    var yScale = d3.scaleLinear()
                    .domain([0, 27]) // number of icons per column
                    .range([0, HEIGHT]);
    // Scale for the y axis of the histogram
    // var yScale = d3.scaleLinear
    //                 .domain()
    var axisScale = d3.scaleLinear()
                        .domain([0, 100])
                        .range([WIDTH+10, 0]);
    var axisLabels = [0, 25, 50, 75, 100];


    // INITIALIZE THE HISTOGRAM
    m.initHistogram = function() {
        // Fade out the hero containers
        d3.select('#chart').selectAll('div.container-heroes')
            .transition()
            .style('opacity', 0)
            .remove();

        // append background
        d3.select('#chart').append('div').attr('id', 'container-histogram');
        // append axis labels
        axisLabels.forEach(function(label) {
            d3.select('#chart').append('p').attr('class', 'axis-label')
                                .text(label+'%')
                                .style('top', HEIGHT+30+'px')
                                .style('left', axisScale(label)+'px');
            // append grid lines
            // d3.select('#chart').append('div').attr('class', 'grid-line')
            //                     .style('left', axisScale(label)+'px');


        });
        // append median indicator
        d3.select('#chart').append('div').attr('id', 'median-line');
        // append median text
        d3.select('#chart').append('p').attr('id', 'median-text')
                            .text('Median ')
                            .append('em');
    };



    var bins = [0, 0.1, 2.5, 5, 7.5, 10, 12.5, 15, 17.5, 20, 22.5, 25, 27.5, 30, 32.5, 35, 37.5, 40, 42.5, 45, 47.5, 50, 52.5, 55,
                57.5, 60, 62.5, 65, 67.5, 70, 72.5, 75, 77.5, 80, 82.5, 85, 87.5, 90, 92.5, 95, 97.5];
    // FUNCTION THAT UPDATES THE HISTOGRAM
    m.updateHistogram = function(data) { // receives event data
        // nest the data, create 'groups' for each bin, then render the elements for each bin
        // Bins the data by Pick/Ban Rate
        var histogram = d3.histogram()
                            .domain([0.0, 100.0])
                            .thresholds(bins)
                            .value(function(d) { return d.pick_ban_rate; });
        // console.log(d3.range(0, 100, 2.5));

        var bData = histogram(data.values);
        // sort the binned data by pick ban rate
        // what to do with null values? put to the last
        bData.forEach(function(bin) {
            bin.sort(function(a, b) {
                if (a.pick_ban_rate===null || b.pick_ban_rate===null) return a.pick_ban_rate===null ? 1 : -1; // account whether a or b are NaN values first
                else return a.pick_ban_rate>b.pick_ban_rate ? -1 : a.pick_ban_rate<b.pick_ban_rate ? 1 : 0;
            });
        });
        // separate the excess hero icons into a different bin
        // bData.splice(0, 0, bData[0].slice(27));
        // bData[1] = bData[1].slice(0, 27);
        // console.log('bData!');
        // console.log(bData);


        // Uses the binned-formatted dataset to build the histogram
        // Revert icons back to default state and minimize them
        d3.selectAll('.hero-icon')
            .style('transform', function(d) { return 'scale(0.7)'; })
            .classed('darken', false);


        bData.forEach(function(bin, i) {
            d3.selectAll('a.hero-icon') // also bind the data to the hero icons
                .data(bin, key);

            bin.forEach(function(d, j) {
                var hero = '.' + m.formatString(d.hero);

                d3.select('#chart').select(hero)
                    .style('top', (HEIGHT - yScale(j)) + 'px')
                    .style('left', xScale(i) + 'px')
                    .style('opacity', function(d) { return heroOpacity(d.pick_ban_rate); })
                    .classed('darkish', function(d) { return d.pick_ban_rate === 0; });
            });
        });

        // update median line indicator
        d3.select('#median-line').transition()
            .style('left', axisScale(data.median)+'px');
        //update median text
        d3.select('#median-text em')
            .text(data.median.toFixed(1)+'%');
        d3.select('#median-text').transition()
            .style('left', axisScale(data.median)-110+'px')
            .style('top', '100px');
    };

}(window.m = window.m || {}));
