//const utils = require('./utils');

function getDB() {
	const db = ['islands', 'parts', 'maps', 'regions', 'sectors', 'districts', 'zones', 'speakers', 'groups', 'features', 'iwi', 'placenames', 'meanings'].reduce((db, collection) => { // , 'gazetteer'
		db[collection] = require('./json/' + collection + '.json');
		//db[collection] = JSON.parse(fs.readFileSync('apollo-server/db/json/' + collection + '.json'));
		db[collection].sort((a, b) => {
			a = a.id.split("_").pop().split("-");
			b = b.id.split("_").pop().split("-");
			for (let i = 0; i < a.length; i++) {
				if (a[i] !== b[i]) return a[i] - b[i];
			}
		});
		db[collection].forEach((record, index) => {
			record.index = index;
		});
		return db;
	}, {});
	return db;
}

function connect(db) {
	db.islands.forEach((island, index) => {
		island.previous = db.islands[index - 1];
		if (!island.previous) delete island.previous;
		island.next = db.islands[index + 1];
		if (!island.next) delete island.next;
		island.parts = db.parts.filter(part => part.island_id === island.id);
		island.maps = db.maps.filter(map => map.island_id === island.id);
		if (!island.maps.length) delete island.maps;
		island.regions = db.regions.filter(region => region.island_id === island.id);
		island.sectors = db.sectors.filter(sector => sector.island_id === island.id);
		if (island.speaker_ids) island.speakers = db.speakers.filter(speaker => island.speaker_ids.includes(speaker.id));
		island.placenames = db.placenames.filter(placename => placename.island_id === island.id);
		island.placenames.forEach((placename, index) => {
			placename.island = island;
			placename.previous = island.placenames[index - 1];
			if (!placename.previous) delete placename.previous;
			placename.next = island.placenames[index + 1];
			if (!placename.next) delete placename.next;
			placename.names.forEach(name => {
				name.placename = placename;
				if (name.spoken) name.spoken.speaker = db.speakers.find(speaker => speaker.id === name.spoken.speaker_id);
			});
			if (placename.places) {
				placename.places.forEach(place => {
					place.placename = placename;
				});
			}
		});
	});

	db.parts.forEach((part, index) => {
		part.island = db.islands.find(island => island.id === part.island_id);
		part.previous = db.parts[index - 1];
		if (!part.previous) delete part.previous;
		part.next = db.parts[index + 1];
		if (!part.next) delete part.next;
		part.maps = db.maps.filter(map => map.part_id === part.id);
		part.regions = db.regions.filter(region => region.part_id === part.id);
		part.sectors = db.sectors.filter(sector => sector.part_id === part.id);
		part.speakers = db.speakers.filter(speaker => part.speaker_ids.includes(speaker.id));
		part.placenames = db.placenames.filter(placename => placename.part_id === part.id);
		part.placenames.forEach((placename, index) => {
			placename.part = part;
			placename.previous = part.placenames[index - 1];
			if (!placename.previous) delete placename.previous;
			placename.next = part.placenames[index + 1];
			if (!placename.next) delete placename.next;
			placename.names.forEach(name => {
				name.placename = placename;
				if (name.spoken) name.spoken.speaker = db.speakers.find(speaker => speaker.id === name.spoken.speaker_id);
			});
			if (placename.places) {
				placename.places.forEach(place => {
					place.placename = placename;
				});
			}
		});
	});

	db.maps.forEach((map, index) => {
		map.island = db.islands.find(island => island.id === map.island_id);
		map.part = db.parts.find(part => part.id === map.part_id);
		map.previous = db.maps[index - 1];
		if (!map.previous) delete map.previous;
		map.next = db.maps[index + 1];
		if (!map.next) delete map.next;
		map.regions = db.regions.filter(region => region.map_id === map.id);
		map.sectors = db.sectors.filter(sector => sector.map_id === map.id);
		map.zones = db.zones.filter(zone => zone.maplink && zone.maplink.map_id === map.id);
		map.maplinks.forEach(maplink => {
			maplink.map = db.maps.find(thismap => thismap.id === maplink.map_id);
		});
	});

	db.regions.forEach((region, index) => {
		region.island = db.islands.find(island => island.id === region.island_id);
		region.part = db.parts.find(part => part.id === region.part_id);
		region.map = db.maps.find(map => map.id === region.map_id);
		region.previous = db.regions[index - 1];
		if (!region.previous) delete region.previous;
		region.next = db.regions[index + 1];
		if (!region.next) delete region.next;
		region.districts = db.districts.filter(district => district.region_id === region.id);
		if (!region.districts.length) delete region.districts;
	});

	db.sectors.forEach((sector, index) => {
		sector.island = db.islands.find(island => island.id === sector.island_id);
		sector.part = db.parts.find(part => part.id === sector.part_id);
		sector.map = db.maps.find(map => map.id === sector.map_id);
		sector.previous = db.sectors[index - 1];
		if (!sector.previous) delete sector.previous;
		sector.next = db.sectors[index + 1];
		if (!sector.next) delete sector.next;
		sector.zones = db.zones.filter(zone => zone.sector_id === sector.id);
	});

	db.place = db.placenames.filter(placename => placename.places).map(placename => placename.places).flat();
	db.groups.forEach((group, index) => {
		group.zone = db.zones.find(zone => zone.id === group.zone_id);
		if (!group.zone) delete group.zone;
		group.feature = db.features.find(feature => feature.id === group.feature_id);
		group.places = db.places.filter(place => place.groups && place.groups.map(group => group.group_id).includes(group.id));
		group.previous = db.groups[index - 1];
		if (!group.previous) delete group.previous;
		group.next = db.groups[index + 1];
		if (!group.next) delete group.next;
	});

	db.features.forEach((feature, index) => {
		feature.places = db.places.filter(place => place.feature_id === feature.id);
		feature.groups = db.groups.filter(group => group.feature_id === feature.id);
		feature.previous = db.features[index - 1];
		if (!feature.previous) delete feature.previous;
		feature.next = db.features[index + 1];
		if (!feature.next) delete feature.next;
	});
	//delete db.places;

	db.tribes.forEach((tribe, index) => {
		tribe.zones = db.zones.filter(zone => zone.tribe_ids && zone.tribe_ids.includes(tribe.id));
		tribe.previous = db.tribes[index - 1];
		if (!tribe.previous) delete tribe.previous;
		tribe.next = db.tribes[index + 1];
		if (!tribe.next) delete tribe.next;
	});

	db.districts.forEach((district, index) => {
		district.region = db.regions.find(region => region.id === district.region_id);
		district.previous = db.districts[index - 1];
		if (!district.previous) delete district.previous;
		district.next = db.districts[index + 1];
		if (!district.next) delete district.next;
		district.zones = db.zones.filter(zone => zone.district_id === district.id);
		if (!district.zones.length) delete district.zones;
	});

	db.speakers.forEach((speaker, index) => {
		speaker.islands = db.islands.filter(island => island.speaker_ids && island.speaker_ids.includes(speaker.id));
		if (!speaker.islands.length) delete speaker.islands;
		speaker.parts = db.parts.filter(part => part.speaker_ids.includes(speaker.id));
		if (!speaker.parts.length) delete speaker.parts;
		speaker.zones = db.zones.filter(zone => zone.speaker_ids.includes(speaker.id));
		if (!speaker.zones.length) delete speaker.zones;
		speaker.previous = db.speakers[index - 1];
		if (!speaker.previous) delete speaker.previous;
		speaker.next = db.speakers[index + 1];
		if (!speaker.next) delete speaker.next;
		speaker.placenames = db.placenames.filter(placename => placename.names.speaker_id === speaker.id);
	});

	db.names = db.placenames.map(placename => placename.names).flat();
	db.zones.forEach((zone, index) => {
		zone.sector = db.sectors.find(sector => sector.id === zone.sector_id);
		zone.district = db.districts.find(district => district.id === zone.district_id);
		zone.previous = db.zones[index - 1];
		if (!zone.previous) delete zone.previous;
		zone.next = db.zones[index + 1];
		if (!zone.next) delete zone.next;
		zone.speakers = db.speakers.filter(speaker => zone.speaker_ids.includes(speaker.id));
		zone.placenames = db.placenames.filter(placename => placename.zone_id === zone.id);
		zone.groups = db.groups.filter(group => group.zone_id === zone.id);
		zone.addenda = db.placenames.filter(placename => placename.addendum_ids && placename.addendum_ids.includes(zone.id));
		if (!zone.addenda.length) delete zone.addenda;
		zone.featured = zone.placenames.filter(placename => placename.featured);
		if (zone.maplink && zone.maplink.map_id) zone.maplink.map = db.maps.find(map => map.id === zone.maplink.map_id);
		if (zone.tribe_ids) zone.tribes = db.tribes.filter(tribe => zone.tribe_ids.includes(tribe.id));
		zone.placenames.forEach((placename, index) => {
			placename.zone = zone;
			if (placename.addendum_ids) placename.addendum_zones = db.zones.filter(zone => placename.addendum_ids.includes(zone.id));
			if (placename.see) {
				placename.see.forEach(see => {
					see.placename = db.placenames.find(thisplacename => thisplacename.id === see.placename_id);
				});
			}
			placename.previous = zone.placenames[index - 1];
			if (!placename.previous) delete placename.previous;
			placename.next = zone.placenames[index + 1];
			if (!placename.next) delete placename.next;
			placename.names.forEach(name => {
				name.placename = placename;
				if (name.spoken) name.spoken.speaker = db.speakers.find(speaker => speaker.id === name.spoken.speaker_id);
				if (name.identical_ids) name.identical = db.names.filter(thisname => name.identical_ids.includes(thisname.id));
				if (name.similar_ids) name.similar = db.names.filter(thisname => name.similar_ids.includes(thisname.id));
				if (name.meaning_id) name.meaning = db.meanings.find(meaning => meaning.id === name.meaning_id);
			});
			if (placename.places) {
				placename.places.forEach(place => {
					place.placename = placename;
					place.feature = db.features.find(feature => feature.id === place.feature_id);
					if (place.membership) {
						place.membership.forEach(membership => {
							membership.group = db.groups.find(group => group.id === membership.group_id);
						});
					}
				});
			}
		});
	});
	//delete db.names;
}

function getPlaceNames(placenameList) {
	const placenames = {en: {}, mi: {}};
	placenameList.forEach((placename) => {
		if (placename.zone) {
			if (placename.names) {
				placename.names.forEach(name => {
					for (let locale of Object.values(name.locale)) {
						const zonepartisland = (placename.zone || placename.part || placename.island);
						placenames.en[locale] = {
							//text: title + " - " + (placename.zone ? placename.zone.title.en || placename.zone.title.mi : (placename.island ? placename.island.title.en || placename.island.title.mi : placename.part.title.en || placename.part.title.mi)) + " (placename)",
							text: locale + " - " + (zonepartisland.name.locale.en || zonepartisland.name.locale.mi) + " (placename)",
							value: "/" + ["placename", zonepartisland.slug.en, placename.slug.en].join("/"),
						};
						placenames.mi[locale] = {
							text: locale + " - " + (zonepartisland.name.locale.mi || zonepartisland.name.locale.en) + " (" + mi.placename + ")",
							value: "/mi/" + [mi.placename, zonepartisland.slug.mi, placename.slug.mi].join("/"),
						};
					}
				});
			}
			if (placename.places) {
				placename.places.forEach(place => {
					for (let locale of Object.values(place.name.locale)) {
						const zonepartisland = (placename.zone || placename.part || placename.island);
						placenames.en[locale] = {
							//text: title + " - " + (placename.zone ? placename.zone.title.en || placename.zone.title.mi : (placename.island ? placename.island.title.en || placename.island.title.mi : placename.part.title.en || placename.part.title.mi)) + " (placename)",
							text: locale + " - " + (zonepartisland.name.locale.en || zonepartisland.name.locale.mi) + " (placename)",
							value: "/" + ["placename", zonepartisland.slug.en, placename.slug.en].join("/"),
						};
						placenames.mi[locale] = {
							text: locale + " - " + (zonepartisland.name.locale.mi || zonepartisland.name.locale.en) + " (" + mi.placename + ")",
							value: "/mi/" + [mi.placename, zonepartisland.slug.mi, placename.slug.mi].join("/"),
						};
					}
				});
			}
		}
	});
	return placenames;
}

function searchTerms(db) {

	const mi = require('../../client/locales/mi.json');
	const search = {en: [], mi: []};

	["islands", "parts", "maps", "regions", "zones", "features", "iwi", "speakers"].forEach(collection => { // Group has zone
		db[collection].forEach(item => {
			//console.log(item);
			for (const locale of Object.values(item.name.locale)) {
				search.en.push({
					text: locale + " (" + collection + ")",
					value: "/" + [collection, item.slug.en].join("/"),
				});
				search.mi.push({
					text: locale + " (" + mi[collection] + ")",
					value: "/mi/" + [mi[collection], item.slug.mi].join("/"),
				});
			}
		});
	});

	db.groups.forEach(item => {
		for (const locale of Object.values(item.name.locale)) {
			search.en.push({
				text: locale + (item.zone ? " - " + (item.zone.name.locale.en || item.zone.name.locale.mi) : "") + " (group)",
				value: "/" + ["group", (item.zone ? item.zone.slug.en : null), item.slug.en].join("/"),
			});
			search.mi.push({
				text: locale + (item.zone ? " - " + (item.zone.name.locale.mi || item.zone.name.locale.en) : "") + " (" + mi.group + ")",
				value: "/mi/" + [mi.group, (item.zone ? item.zone.slug.mi : null), item.slug.mi].join("/"),
			});
		}
	});

	const placenames = getPlaceNames(db.placenames);
	search.en = search.en.concat(Object.values(placenames.en));
	search.mi = search.mi.concat(Object.values(placenames.mi));
	return search;
}

function totals(db) {
	const totals = {};
	['islands', 'parts', 'maps', 'regions', 'sectors', 'districts', 'zones', 'speakers', 'groups', 'features', 'iwi', 'placenames', 'places', 'names'].forEach(collection => {
		//db[collection] = db[collection].sort((a, b) => a.id - b.id);
		totals[collection] = db[collection].length;
	});
}

function connectIDs(record) {
	for (const field of Object.keys(record)) {
		if (field.endsWith('_id')) {
			const collection = field.replace('_id', '');
			record[collection] = db[collection].find((item) => item.id === record[field]);
			delete record[field];
		} else if (field.endsWith('_ids')) {
			const collection = field.replace('_ids', '');
			record[collection] = db[collection].filter((item) => record[field].includes(item.id));
			delete record[field];
		}
	}
}

const db = getDB();

for (const collection of Object.keys(db)) {
	for (const record of db[collection]) {
		connectIDs(record);
	}
}

// connect(db);
// db.search = getSearch(db);
// db.total = totals(db);

module.exports = db;
