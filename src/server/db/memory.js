function getBookmarks(placenames) {
	return placenames.map(placename => placename.names.filter(name => name.spoken)).flat().sort((a, b) => a.spoken.start - b.spoken.start);
}

const db = ['island', 'part', 'map', 'region', 'zone', 'speaker', 'group', 'feature', 'iwi', 'placename', 'meaning', 'district'].reduce((db, collection) => { // , 'gazetteer'
	db[collection] = require('./json/' + collection + '.json');
	//db[collection] = JSON.parse(fs.readFileSync('apollo-server/db/json/' + collection + '.json'));
	return db;
}, {});

//db.place = db.placename.filter(placename => placename.places).map(placename => placename.places).flat();

/*

island: speakers
part: island, speakers
map: island, part, maplinks.map
region: island, map, part
zone: region, part, island, speakers, iwi, maplink.map
group: zone, feature
placename: zone
name: spoken.speaker, identical, similar, meaning
place: feature

*/

db.island.forEach((island, index) => {
	island.previous = db.island[index - 1];
	island.next = db.island[index + 1];
	island.parts = db.part.filter(part => part.island_id == island._id);
	island.maps = db.map.filter(map => map.island_id == map._id);
	island.regions = db.region.filter(region => region.island_id == island._id);
	island.speakers = db.speaker.filter(speaker => island.speaker_ids.includes(speaker._id));
	island.placenames = db.placename.filter(placename => placename.zone_id == island._id);
});

db.part.forEach((part, index) => {
	part.island = db.island.find(island => island._id == part.island_id);
	part.previous = db.part[index - 1];
	part.next = db.part[index + 1];
	part.maps = db.map.filter(map => map.part_id == part._id);
	part.regions = db.region.filter(region => region.part_id == part._id);
	part.speakers = db.speaker.filter(speaker => part.speaker_ids.includes(speaker._id));
	part.placenames = db.placename.filter(placename => placename.zone_id == part._id);
});

db.map.forEach((map, index) => {
	map.island = db.island.find(island => island._id == map.island_id);
	map.part = db.part.find(part => part._id == map.part_id);
	map.previous = db.map[index - 1];
	map.next = db.map[index + 1];
	map.maplinks.forEach(maplink => {
		maplink.map = db.map.find(thismap => thismap._id == maplink.map_id);
	});
});

db.region.forEach((region, index) => {
	region.part = db.part.find(part => part._id == region.part_id);
	region.map = db.map.find(map => map._id == region.map_id);
	region.previous = db.region[index - 1];
	region.next = db.region[index + 1];
	region.zones = db.zone.filter(zone => zone.region_id == region._id);
});

db.zone.forEach((zone, index) => {
	zone.region = db.region.find(region => region._id == zone.region_id);
	zone.placenames = db.placename.filter(placename => placename.zone_id == zone._id);
	if (zone.maplink && zone.maplink.map_id) zone.maplink.map = db.map.find(map => map._id == zone.maplink.map_id);
	if (zone.maplink && !zone.maplink.map) delete zone.maplink.map;
	if (zone.iwi_ids) zone.iwi = db.iwi.filter(iwi => zone.iwi_ids.includes(iwi._id));
	if (zone.iwi && !zone.iwi.length) delete zone.iwi;
	zone.previous = db.zone[index - 1];
	zone.next = db.zone[index + 1];
});

db.group.forEach((group, index) => {
	group.zone = db.zone.find(zone => zone._id == group.zone_id);
	group.feature = db.feature.find(feature => feature._id == group.feature_id);
	group.previous = db.group[index - 1];
	group.next = db.group[index + 1];
}); 

db.iwi.forEach((iwi, index) => {
	iwi.zones = db.zone.filter(zone => zone.iwi_ids && zone.iwi_ids.includes(iwi._id));
	if (iwi.zones && !iwi.zones.length) delete iwi.zone;
	iwi.previous = db.iwi[index - 1];
	iwi.next = db.iwi[index + 1];
});

db.speaker.forEach((speaker, index) => {
	speaker.zones = db.zone.filter(zone => zone.speaker_ids.includes(speaker._id));
	if (!speaker.zones.length) delete speaker.zones;
	speaker.parts = db.part.filter(part => part.speaker_ids.includes(speaker._id));
	if (!speaker.parts.length) delete speaker.parts;
	speaker.islands = db.island.filter(island => island.speaker_ids.includes(speaker._id));
	if (!speaker.islands.length) delete speaker.islands;
	speaker.previous = db.speaker[index - 1];
	speaker.next = db.speaker[index + 1];
});

db.island.forEach(island => {
	island.placenames.forEach((placename, index) => {
		placename.previous = island.placenames[index - 1];
		placename.next = island.placenames[index + 1];
	});
});

db.part.forEach(part => {
	part.placenames.forEach((placename, index) => {
		placename.previous = part.placenames[index - 1];
		placename.next = part.placenames[index + 1];
	});
});

db.name = db.placename.map(placename => placename.names).flat();
db.zone.forEach(zone => {
	zone.placenames.forEach((placename, index) => {
		placename.zone = db.zone.find(zone => zone._id == placename.zone_id);
		placename.previous = zone.placenames[index - 1];
		placename.next = zone.placenames[index + 1];
		if (placename.name) {
			placename.name.forEach(name => {
				name.placename = placename._id;
				if (name.spoken) name.spoken.speaker = db.speaker.find(speaker => speaker._id == name.spoken.speaker_id);
				if (name.identical_ids) name.identical = db.name.filter(thisname => name.identical_ids.includes(thisname._id));
				if (name.similar_ids) name.similar = db.name.filter(thisname => name.similar_ids.includes(thisname._id));
				name.meaning = db.meaning.find(meaning => meaning._id == name.meaning_id);
			});
		}
		if (placename.place) {
			placename.place.forEach(place => {
				place.placename = placename._id;
				place.feature = db.feature.find(feature => feature._id == place.feature_id);
			});
		}
	});
});
delete db.name;

module.exports = db;
