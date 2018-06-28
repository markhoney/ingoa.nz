const db = require('../db/loki.js');

function removeMacrons(name) {
	if (name) {
		return name.replace(/ʰ/g, 'h').replace(/ā/g, 'a').replace(/ē/g, 'e').replace(/ī/g, 'i').replace(/ō/g, 'o').replace(/ū/g, 'u');
	}
}


db(function(db) {

	function matchPlaces() {
		var matches = 0;
		var places = db.tables.Place.find();
		for (var place in places) {
			if (places[place].name !== "Intro" && !['a', 'b', 'c'].includes(places[place].zone)) {
				try {
					var districts = db.tables.Region.find({id: db.tables.Zone.find({id: places[place].zone})[0].region})[0].location.gazetteer;
				} catch (err) {}
				for (var name in places[place].placenames) {
					var found = false;
					for (var district in districts) {
						[name, {'$regex': name}, removeMacrons(name), {'$regex': removeMacrons(name)}].forEach(function(term) {
							var gazetteer = db.tables.Gazetteer.find({name: term, district: districts[district]});
							//if (!found && gazetteer.length) {
							if (!found && gazetteer.length === 1) {
								places[place].location = gazetteer[0].location;
								db.tables.Place.update(places[place]);
								matches++;
								found = true;
							}
						});
					}
				}
			}
		}
		console.log(matches);
	}
	function matchMeanings() {

	}

	function speakerZones() {

	}

	function placeKinds() {
		var kinds = [];
		db.tables.Place.find().forEach(function(place) {
			if ('kinds' in place) {
				for (var kind in place.kinds) {
					kinds.push(kind);
				}
			}
		});
		return kinds.filter(arrayUnique).sort();
	}

	function importAll() {
		speakerZones();
		placeKinds();
		matchMeanings();
		matchPlaces();
		db.conn.close();
	}

	importAll();
});
