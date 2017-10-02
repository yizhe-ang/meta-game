(function(m) {
// Contains code that is to be shared between the modules
    'use strict';

    m.data = {}; // our main data object

    m.HERO_LIST = [
                    {'attribute': 'Strength',
                     'heroes':     ['Abaddon','Alchemist','Axe','Beastmaster','Brewmaster','Bristleback','Centaur Warrunner','Chaos Knight','Clockwerk','Doom','Dragon Knight','Earth Spirit','Earthshaker','Elder Titan','Huskar','Io','Kunkka','Legion Commander','Lifestealer','Lycan','Magnus','Night Stalker','Omniknight',
                                     'Phoenix','Pudge','Sand King','Slardar','Spirit Breaker','Sven','Tidehunter','Timbersaw','Tiny','Treant Protector','Tusk','Underlord','Undying','Wraith King'] },
                    {'attribute': 'Agility',
                     'heroes':      ['Anti-Mage','Arc Warden','Bloodseeker','Bounty Hunter','Broodmother','Clinkz','Drow Ranger','Ember Spirit','Faceless Void','Gyrocopter','Juggernaut','Lone Druid','Luna','Medusa','Meepo','Mirana','Monkey King','Morphling','Naga Siren','Nyx Assassin','Phantom Assassin','Phantom Lancer','Razor',
                                     'Riki','Shadow Fiend','Slark','Sniper','Spectre','Templar Assassin','Terrorblade','Troll Warlord','Ursa','Vengeful Spirit','Venomancer','Viper','Weaver'] },
                    {'attribute': 'Intelligence',
                     'heroes': ['Ancient Apparition','Bane','Batrider','Chen','Crystal Maiden','Dark Seer','Dazzle','Death Prophet','Disruptor','Enchantress','Enigma','Invoker','Jakiro','Keeper of the Light','Leshrac','Lich','Lina','Lion',"Natures Prophet",'Necrophos','Ogre Magi','Oracle',
                                     'Outworld Devourer','Puck','Pugna','Queen of Pain','Rubick','Shadow Demon','Shadow Shaman','Silencer','Skywrath Mage','Storm Spirit','Techies','Tinker','Visage','Warlock','Windranger','Winter Wyvern','Witch Doctor','Zeus'] }
                ];

    m.HERO_LIST.forEach(function(d) {
        // console.log(d.attribute +  ' ' + d.heroes.length);
    });

    m.VALVE_EVENTS = [
                        {event:'The International 2013', img:'the_international', date:'2013-08-02', patch:'6.78'},
                        {event:'The International 2014', img:'the_international', date:'2014-07-08', patch:'6.81b'},
                        {event:'The International 2015', img:'the_international', date:'2015-07-27', patch:'6.84c'},
                        {event:'The Frankfurt Major 2015', img:'fall_major', date:'2015-11-13', patch:'6.85b'},
                        {event:'The Shanghai Major 2016', img:'winter_major', date:'2016-02-25', patch:'6.86f'},
                        {event:'The Manila Major 2016', img:'spring_major', date:'2016-06-03', patch:'6.87d'},
                        {event:'The International 2016', img:'the_international', date:'2016-08-02', patch:'6.88b'},
                        {event:'The Boston Major 2016', img:'fall_major', date:'2016-12-03', patch:'6.88f'},
                        {event:'The Kiev Major 2017', img:'winter_major', date:'2017-04-27', patch:'7.05'},
                        {event:'The International 2017', img:'the_international', date:'2017-08-02', patch:'7.06e'},
                ];

    m.EVENTS = m.VALVE_EVENTS.map(function(d) { return d.event; });

    // takes note of the selected event filter
    m.selectedEvent = 'The International 2013';

    // sort status
    m.toggleSort = false;

    // view status
    m.toggleView = false;

    // updates selected hero
    m.selectedHero = 'Anti-Mage';



    // Hero Name String-formatting function
    m.formatString = function(name) {
        // turns string to lowercase and replaces ' ' with '_'
        var formattedName = name.toLowerCase().replace(/ /g,"_");
        return formattedName;
    };

    // Filters dataset by event name
    m.filterByEvent = function(data, eventName) {
        return data.filter(function(d) { return d.key == eventName; })[0];
    };



    // Scroll event for header
    d3.select(window).on('scroll', function(d) {
        var scrollPos = window.scrollY;
        if (scrollPos > 0) d3.select('#header').transition().style('opacity', 0);
        else d3.select('#header').transition().style('opacity', 1.0);
    });





    // MAIN DATA UPDATE FUNCTION
    m.onEventChange = function() {
        // filter data and pass it to subsequent functions
        var data = m.filterByEvent(m.data, m.selectedEvent);
        // console.log(data);
        // choosing which view to update
        if (m.toggleView) m.updateHistogram(data);
        else m.updateChart(data);

        // update event-based elements in infobox
        m.updateEventInfo(data);
        // update selected hero data too
        m.updateHeroInfo(d3.select('.'+m.formatString(m.selectedHero)).datum());

    };


}(window.m = window.m || {}));
