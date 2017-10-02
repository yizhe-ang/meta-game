(function(m) {
// Module that receives the data and initializes the app

    // function that calculates the median of each event
    function calculateMedian(event) {
        var pickBanRates = event.values.map(function(d) { return d.pick_ban_rate; })
                                        .filter(function(d) { return d!== null; })
                                        .sort(function(a, b) { return a - b; });
        var middle = Math.floor((pickBanRates.length-1) / 2);
        if (m.length%2) return pickBanRates[middle];
        else return (pickBanRates[middle] + pickBanRates[middle+1]) / 2.0;
    }

    // data processing function
    function processData(data) {
        // Nest data according to event
        var nestedData = d3.nest()
                            // sort values according to attribute, and then by name
                            .sortValues(function(a, b) {
                                if (a.attribute==b.attribute) {
                                    return a.hero<b.hero ? -1 : a.hero>b.hero ? 1 : 0;
                                }
                                else {
                                    return a.attribute<b.attribute ? -1 : 1;
                                }
                            })
                            .key(function(d) { return d.event; })
                            .entries(data);

        // Make additional data calculations for each event
        nestedData.forEach(function(event) {

            var total = 113; // total number of heroes
            var count = 113; // total number of picked/banned heroes
            var rate = 0; // var for summing up total pick/ban rates

            event.values.forEach(function(d) {
                // Calculate total number of valid heroes
                if (d.pick_ban_rate===null) {
                    total -= 1;
                    count -= 1;
                }
                if (d.pick_ban_rate === 0) count -= 1;
                // Caculate average hero pick/ban rate
                if (d.pick_ban_rate!==null) rate += d.pick_ban_rate;
            });




            // Set the values in the dataset
            event.total_heroes = total;
            event.picked_banned_heroes = count;
            event.ave_pick_ban_rate = rate/total;
            event.total_games = Math.round(event.values[0].no_picks_bans/event.values[0].pick_ban_rate*100);
            // calculate the median pick ban rates
            event.median = calculateMedian(event);
        });


        // sort objects in the array according to event date
        var sortedData = nestedData.sort(function(a, b) {
            return m.EVENTS.indexOf(a.key) - m.EVENTS.indexOf(b.key);
        });

        return sortedData;
    }

    // data row conversion function
    function row(d) {
        return {
            ban_rate: d.ban_rate === '' ? null : parseFloat(d.ban_rate),
            event: d.event,
            hero: d.hero,
            pick_rate: d.pick_rate === '' ? null : parseFloat(d.pick_rate),
            pick_ban_rate: d.pick_ban_rate === '' ? null : parseFloat(d.pick_ban_rate),
            no_bans: +d.no_bans,
            no_picks: +d.no_picks,
            no_picks_bans: +d.no_picks_bans,
            win_rate: parseFloat(d.win_rate),
            attribute: d.attribute
        };
    }

    m.load = function() {
        d3.csv('data/valve_events_draft_final.csv', row, function(error,data) {
            ready(data);
        });
    };


    function ready(data) {
        // Store the processed data
        m.data = processData(data);
        // console.log(m.data);
        // Initialize UI Elements
        m.initUi();
        // Initialize Infobox
        m.initInfobox();
        // Initialize chart
        m.initChart();
        // Trigger data update
        m.onEventChange();


        m.initChartOveralltrend();
        m.initChartMedian();

        var percentageValues = m.data.map(function(d) {
            var data = d.values.map(function(d) { return d.pick_ban_rate; })
                                .filter(function(d) { return d!==null; });
            var bData = histogram(data);

            var percentage = bData[0].length/data.length;
            return percentage;
            // return data.reduce(function(a,b) { return Math.max(a,b); });
        });
        // console.log('percentageValues');
        // console.log(percentageValues);
        // console.log(percentageValues.reduce(function(a,b) { return a+b; })/percentageValues.length);
    }

    var bins = [0, 2.5, 5, 7.5, 10, 12.5, 15, 17.5, 20, 22.5, 25, 27.5, 30, 32.5, 35, 37.5, 40, 42.5, 45, 47.5, 50, 52.5, 55,
                57.5, 60, 62.5, 65, 67.5, 70, 72.5, 75, 77.5, 80, 82.5, 85, 87.5, 90, 92.5, 95, 97.5];
    var histogram = d3.histogram()
                        .domain([0.0, 100.0])
                        .thresholds(bins);





}(window.m = window.m || {}));
