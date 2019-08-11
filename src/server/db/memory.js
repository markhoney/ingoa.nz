//const utils = require('./utils');

const db = ['island', 'part', 'map', 'region', 'sector', 'district', 'zone', 'speaker', 'group', 'feature', 'tribe', 'placename', 'meaning'].reduce((db, collection) => { // , 'gazetteer'
	db[collection] = require('./json/' + collection + '.json');
	//db[collection] = JSON.parse(fs.readFileSync('apollo-server/db/json/' + collection + '.json'));
	return db;
}, {});

db.island.forEach((island, index) => {
	island.previous = db.island[index - 1];
	if (!island.previous) delete island.previous;
	island.next = db.island[index + 1];
	if (!island.next) delete island.next;
	island.parts = db.part.filter(part => part.island_id == island._id);
	island.maps = db.map.filter(map => map.island_id == island._id);
	if (!island.maps.length) delete island.maps;
	island.regions = db.region.filter(region => region.island_id == island._id);
	island.sectors = db.sector.filter(sector => sector.island_id == island._id);
	if (island.speaker_ids) island.speakers = db.speaker.filter(speaker => island.speaker_ids.includes(speaker._id));
	island.placenames = db.placename.filter(placename => placename.island_id == island._id);
	island.placenames.forEach((placename, index) => {
		placename.island = island;
		placename.previous = island.placenames[index - 1];
		if (!placename.previous) delete placename.previous;
		placename.next = island.placenames[index + 1];
		if (!placename.next) delete placename.next;
		placename.names.forEach(name => {
			name.placename = placename;
		});
		if (placename.places) {
			placename.places.forEach(place => {
				place.placename = placename;
			});
		}
	});
});

db.part.forEach((part, index) => {
	part.island = db.island.find(island => island._id == part.island_id);
	part.previous = db.part[index - 1];
	if (!part.previous) delete part.previous;
	part.next = db.part[index + 1];
	if (!part.next) delete part.next;
	part.maps = db.map.filter(map => map.part_id == part._id);
	part.regions = db.region.filter(region => region.part_id == part._id);
	part.sectors = db.sector.filter(sector => sector.part_id == part._id);
	part.speakers = db.speaker.filter(speaker => part.speaker_ids.includes(speaker._id));
	part.placenames = db.placename.filter(placename => placename.part_id == part._id);
	part.placenames.forEach((placename, index) => {
		placename.part = part;
		placename.previous = part.placenames[index - 1];
		if (!placename.previous) delete placename.previous;
		placename.next = part.placenames[index + 1];
		if (!placename.next) delete placename.next;
		placename.names.forEach(name => {
			name.placename = placename;
		});
		if (placename.places) {
			placename.places.forEach(place => {
				place.placename = placename;
			});
		}
	});
});

db.map.forEach((map, index) => {
	map.island = db.island.find(island => island._id == map.island_id);
	map.part = db.part.find(part => part._id == map.part_id);
	map.previous = db.map[index - 1];
	if (!map.previous) delete map.previous;
	map.next = db.map[index + 1];
	if (!map.next) delete map.next;
	map.regions = db.region.filter(region => region.map_id == map._id);
	map.sectors = db.sector.filter(sector => sector.map_id == map._id);
	map.zones = db.zone.filter(zone => zone.maplink && zone.maplink.map_id == map._id);
	map.maplinks.forEach(maplink => {
		maplink.map = db.map.find(thismap => thismap._id == maplink.map_id);
	});
});

db.region.forEach((region, index) => {
	region.island = db.island.find(island => island._id == region.island_id);
	region.part = db.part.find(part => part._id == region.part_id);
	region.map = db.map.find(map => map._id == region.map_id);
	region.previous = db.region[index - 1];
	if (!region.previous) delete region.previous;
	region.next = db.region[index + 1];
	if (!region.next) delete region.next;
	region.districts = db.district.filter(district => district.region_id == region._id);
	if (!region.districts.length) delete region.districts;
});

db.sector.forEach((sector, index) => {
	sector.island = db.island.find(island => island._id == sector.island_id);
	sector.part = db.part.find(part => part._id == sector.part_id);
	sector.map = db.map.find(map => map._id == sector.map_id);
	sector.previous = db.sector[index - 1];
	if (!sector.previous) delete sector.previous;
	sector.next = db.sector[index + 1];
	if (!sector.next) delete sector.next;
	sector.zones = db.zone.filter(zone => zone.sector_id == sector._id);
});

db.place = db.placename.filter(placename => placename.places).map(placename => placename.places).flat();
db.group.forEach((group, index) => {
	group.zone = db.zone.find(zone => zone._id == group.zone_id);
	if (!group.zone) delete group.zone;
	group.feature = db.feature.find(feature => feature._id == group.feature_id);
	group.places = db.place.filter(place => place.groups && place.groups.map(group => group.group_id).includes(group._id));
	group.previous = db.group[index - 1];
	if (!group.previous) delete group.previous;
	group.next = db.group[index + 1];
	if (!group.next) delete group.next;
});

db.feature.forEach((feature, index) => {
	feature.places = db.place.filter(place => place.feature_id == feature._id);
	feature.groups = db.group.filter(group => group.feature_id == feature._id);
	feature.previous = db.feature[index - 1];
	if (!feature.previous) delete feature.previous;
	feature.next = db.feature[index + 1];
	if (!feature.next) delete feature.next;
});
//delete db.place;

db.tribe.forEach((tribe, index) => {
	tribe.zones = db.zone.filter(zone => zone.tribe_ids && zone.tribe_ids.includes(tribe._id));
	tribe.previous = db.tribe[index - 1];
	if (!tribe.previous) delete tribe.previous;
	tribe.next = db.tribe[index + 1];
	if (!tribe.next) delete tribe.next;
});

db.district.forEach((district, index) => {
	district.region = db.region.find(region => region._id == district.region_id);
	district.previous = db.district[index - 1];
	if (!district.previous) delete district.previous;
	district.next = db.district[index + 1];
	if (!district.next) delete district.next;
	district.zones = db.zone.filter(zone => zone.district_id == district._id);
	if (!district.zones.length) delete district.zones;
});

db.speaker.forEach((speaker, index) => {
	speaker.islands = db.island.filter(island => island.speaker_ids && island.speaker_ids.includes(speaker._id));
	if (!speaker.islands.length) delete speaker.islands;
	speaker.parts = db.part.filter(part => part.speaker_ids.includes(speaker._id));
	if (!speaker.parts.length) delete speaker.parts;
	speaker.zones = db.zone.filter(zone => zone.speaker_ids.includes(speaker._id));
	if (!speaker.zones.length) delete speaker.zones;
	speaker.previous = db.speaker[index - 1];
	if (!speaker.previous) delete speaker.previous;
	speaker.next = db.speaker[index + 1];
	if (!speaker.next) delete speaker.next;
	speaker.placenames = db.placename.filter(placename => placename.names.speaker_id == speaker._id);
});

db.name = db.placename.map(placename => placename.names).flat();
db.zone.forEach((zone, index) => {
	zone.sector = db.sector.find(sector => sector._id == zone.sector_id);
	zone.district = db.district.find(district => district._id == zone.district_id);
	zone.previous = db.zone[index - 1];
	if (!zone.previous) delete zone.previous;
	zone.next = db.zone[index + 1];
	if (!zone.next) delete zone.next;
	zone.speakers = db.speaker.filter(speaker => zone.speaker_ids.includes(speaker._id));
	zone.placenames = db.placename.filter(placename => placename.zone_id == zone._id);
	zone.groups = db.group.filter(group => group.zone_id == zone._id);
	zone.addenda = db.placename.filter(placename => placename.addendum_ids && placename.addendum_ids.includes(zone._id));
	if (!zone.addenda.length) delete zone.addenda;
	zone.featured = zone.placenames.filter(placename => placename.featured);
	if (zone.maplink && zone.maplink.map_id) zone.maplink.map = db.map.find(map => map._id == zone.maplink.map_id);
	if (zone.tribe_ids) zone.tribes = db.tribe.filter(tribe => zone.tribe_ids.includes(tribe._id));
	zone.placenames.forEach((placename, index) => {
		placename.zone = zone;
		if (placename.addendum_ids) placename.addendum_zones = db.zone.filter(zone => placename.addendum_ids.includes(zone._id));
		if (placename.see) {
			placename.see.forEach(see => {
				see.placename = db.placename.find(thisplacename => thisplacename._id == see.placename_id);
			});
		}
		placename.previous = zone.placenames[index - 1];
		if (!placename.previous) delete placename.previous;
		placename.next = zone.placenames[index + 1];
		if (!placename.next) delete placename.next;
		placename.names.forEach(name => {
			name.placename = placename;
			if (name.spoken) name.spoken.speaker = db.speaker.find(speaker => speaker._id == name.spoken.speaker_id);
			if (name.identical_ids) name.identical = db.name.filter(thisname => name.identical_ids.includes(thisname._id));
			if (name.similar_ids) name.similar = db.name.filter(thisname => name.similar_ids.includes(thisname._id));
			if (name.meaning_id) name.meaning = db.meaning.find(meaning => meaning._id == name.meaning_id);
		});
		if (placename.places) {
			placename.places.forEach(place => {
				place.placename = placename;
				place.feature = db.feature.find(feature => feature._id == place.feature_id);
				if (place.membership) {
					place.membership.forEach(membership => {
						membership.group = db.group.find(group => group._id == membership.group_id);
					});
				}
			});
		}
	});
});
//delete db.name;

const mi = require('../../client/locales/mi.json');
db.search = {en: [], mi: []};

["island", "part", "map", "region", "zone", "feature", "tribe", "speaker"].forEach(collection => { // Group has zone
	db[collection].forEach(item => {
		//console.log(item);
		for (const locale of Object.values(item.title.locale)) {
			db.search.en.push({
				text: locale + " (" + collection + ")",
				value: "/" + [collection, item.slug.en].join("/"),
			});
			db.search.mi.push({
				text: locale + " (" + mi[collection] + ")",
				value: "/mi/" + [mi[collection], item.slug.mi].join("/"),
			});
		}
	});
});

db.group.forEach(item => {
	for (const locale of Object.values(item.title.locale)) {
		db.search.en.push({
			text: locale + (item.zone ? " - " + (item.zone.title.locale.en || item.zone.title.locale.mi) : "") + " (group)",
			value: "/" + ["group", (item.zone ? item.zone.slug.en : null), item.slug.en].join("/"),
		});
		db.search.mi.push({
			text: locale + (item.zone ? " - " + (item.zone.title.locale.mi || item.zone.title.locale.en) : "") + " (" + mi.group + ")",
			value: "/mi/" + [mi.group, (item.zone ? item.zone.slug.mi : null), item.slug.mi].join("/"),
		});
	}
});

const placenames = {en: {}, mi: {}};
db.placename.forEach(placename => {
	if (placename.zone) {
		["names", "places"].forEach(nametype => {
			if (placename[nametype]) {
				placename[nametype].forEach(item => {
					for (let locale of Object.values(item.title.locale)) {
						const zonepartisland = (placename.zone || placename.part || placename.island);
						placenames.en[locale] = {
							//text: title + " - " + (placename.zone ? placename.zone.title.en || placename.zone.title.mi : (placename.island ? placename.island.title.en || placename.island.title.mi : placename.part.title.en || placename.part.title.mi)) + " (placename)",
							text: locale + " - " + (zonepartisland.title.locale.en || zonepartisland.title.locale.mi) + " (placename)",
							value: "/" + ["placename", zonepartisland.slug.en, placename.slug.en].join("/"),
						};
						placenames.mi[locale] = {
							text: locale + " - " + (zonepartisland.title.locale.mi || zonepartisland.title.locale.en) + " (" + mi.placename + ")",
							value: "/mi/" + [mi.placename, zonepartisland.slug.mi, placename.slug.mi].join("/"),
						};
					}
				});
			}
		});
	}
});

db.search.en = db.search.en.concat(Object.values(placenames.en));
db.search.mi = db.search.mi.concat(Object.values(placenames.mi));

db.total = {};
['island', 'part', 'map', 'region', 'sector', 'district', 'zone', 'speaker', 'group', 'feature', 'tribe', 'placename', 'place', 'name'].forEach(collection => {
	//db[collection] = db[collection].sort((a, b) => a._id - b._id);
	db.total[collection] = db[collection].length;
});

module.exports = db;
