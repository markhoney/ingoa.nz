const {get, sortBy} = require('lodash'); // find, filter,

module.exports = function(db) {

	return {
		island: {
			previous: (island) => db.island[island.index - 1],
			next: (island) => db.island[island.index + 1],
			parts: (island) => db.part.filter(part => part.island_id === island._id),
			maps: (island) => db.map.filter(map => map.island_id === island._id),
			regions: (island) => db.region.filter(region => region.island_id === island._id),
			sectors: (island) => db.sector.filter(sector => sector.island_id === island._id),
			speakers: (island) => db.speaker.filter(speaker => island.speaker_ids && island.speaker_ids.includes(speaker._id)),
			placenames: (island) => db.placename.filter(placename => placename.island_id === island._id),
		},

		part: {
			island: (part) => db.island.find(island => island._id === part.island_id),
			previous: (part) => db.part[part.index - 1],
			next: (part) => db.part[part.index + 1],
			maps: (part) => db.map.filter(map => map.part_id === part._id),
			regions: (part) => db.region.filter(region => region.part_id === part._id),
			sectors: (part) => db.sector.filter(sector => sector.part_id === part._id),
			speakers: (part) => db.speaker.filter(speaker => part.speaker_ids && part.speaker_ids.includes(speaker._id)),
			placenames: (part) => db.placename.filter(placename => placename.part_id === part._id),
		},

		map: {
			island: (map) => db.island.find(island => island._id === map.island_id),
			part: (map) => db.part.find(part => part._id === map.part_id),
			previous: (map) => db.map[map.index - 1],
			next: (map) => db.map[map.index + 1],
			regions: (map) => db.region.filter(region => region.map_id === map._id),
			sectors: (map) => db.sector.filter(sector => sector.map_id === map._id),
			zones: (map) => db.zone.filter(zone => zone.maplink && zone.maplink.map_id === map._id),
		},

		maplink: {
			map: (maplink) => db.map.find(map => map._id === maplink.map_id),
		},

		region: {
			island: (region) => db.island.find(island => island._id === region.island_id),
			part: (region) => db.part.find(part => part._id === region.part_id),
			map: (region) => db.map.find(map => map._id === region.map_id),
			previous: (region) => db.region[region.index - 1],
			next: (region) => db.region[region.index + 1],
			districts: (region) => db.district.filter(district => district.region_id === region._id),
		},

		sector: {
			island: (sector) => db.island.find(island => island._id === sector.island_id),
			part: (sector) => db.part.find(part => part._id === sector.part_id),
			map: (sector) => db.map.find(map => map._id === sector.map_id),
			previous: (sector) => db.sector[sector.index - 1],
			next: (sector) => db.sector[sector.index + 1],
			zones: (sector) => db.zone.filter(zone => zone.sector_id === sector._id),
		},

		group: {
			zone: (group) => db.zone.find(zone => zone._id === group.zone_id),
			feature: (group) => db.feature.find(feature => feature._id === group.feature_id),
			places: (group) => db.place.filter(place => place.groups && place.groups.map(group => group.group_id).includes(group._id)),
			previous: (group) => db.group[group.index - 1],
			next: (group) => db.group[group.index + 1],
		},

		feature: {
			places: (feature) => db.place.filter(place => place.feature_id === feature._id),
			groups: (feature) => db.group.filter(group => group.feature_id === feature._id),
			previous: (feature) => db.feature[feature.index - 1],
			next: (feature) => db.feature[feature.index + 1],
		},

		tribe: {
			zones: (tribe) => db.zone.filter(zone => zone.tribe_ids && zone.tribe_ids.includes(tribe._id)),
			previous: (tribe) => db.tribe[tribe.index - 1],
			next: (tribe) => db.tribe[tribe.index + 1],
		},

		district: {
			region: (district) => db.region.find(region => region._id === district.region_id),
			previous: (district) => db.district[index - 1],
			next: (district) => db.district[index + 1],
			zones: (district) => db.zone.filter(zone => zone.district_id === district._id),
		},

		speaker: {
			islands: (speaker) => db.island.filter(island => island.speaker_ids && island.speaker_ids.includes(speaker._id)),
			parts: (speaker) => db.part.filter(part => part.speaker_ids && part.speaker_ids.includes(speaker._id)),
			zones: (speaker) => db.zone.filter(zone => zone.speaker_ids && zone.speaker_ids.includes(speaker._id)),
			previous: (speaker) => db.speaker[speaker.index - 1],
			next: (speaker) => db.speaker[speaker.index + 1],
			placenames: (speaker) => db.placename.filter(placename => placename.names.speaker_id === speaker._id),
		},

		zone: {
			sector: (zone) => db.sector.find(sector => sector._id === zone.sector_id),
			district: (zone) => db.district.find(district => district._id === zone.district_id),
			previous: (zone) => db.zone[zone.index - 1],
			next: (zone) => db.zone[zone.index + 1],
			speakers: (zone) => db.speaker.filter(speaker => zone.speaker_ids && zone.speaker_ids.includes(speaker._id)),
			placenames: (zone) => db.placename.filter(placename => placename.zone_id === zone._id),
			groups: (zone) => db.group.filter(group => group.zone_id === zone._id),
			addenda: (zone) => db.placename.filter(placename => placename.addendum_ids && placename.addendum_ids.includes(zone._id)),
			featured: (zone) => zone.placenames.filter(placename => placename.featured),
			tribes: (zone) => db.tribe.filter(tribe => zone.tribe_ids && zone.tribe_ids.includes(tribe._id)),
		},

		placename: {
			island: (placename) => db.island.find(island => island._id === placename.island_id),
			part: (placename) => db.part.find(part => part._id === placename.part_id),
			zone: (placename) => db.zone.find(zone => zone._id === placename.zone_id),
			addendum_zones: (placename) => db.zone.filter(zone => placename.addendum_ids && placename.addendum_ids.includes(zone._id)),
			previous: (placename) => {
				if (placename.island_id) {
					return db.island.find(island => island._id === placename.island_id).placenames[placename.index - 1];
				} else if (placename.part_id) {
					return db.part.find(part => part._id === placename.part_id).placenames[placename.index - 1];
				} else {
					return db.zone.find(zone => zone._id === placename.zone_id).placenames[placename.index - 1];
				}
			},
			next: (placename) => {
				if (placename.island_id) {
					return db.island.find(island => island._id === placename.island_id).placenames[placename.index + 1];
				} else if (placename.part_id) {
					return db.part.find(part => part._id === placename.part_id).placenames[placename.index + 1];
				} else {
					return db.zone.find(zone => zone._id === placename.zone_id).placenames[placename.index + 1];
				}
			},
		},

		see: {
			placename: (see) => db.placename.find(placename => placename._id === see.placename_id),
		},

		place: {
			placename: (place) => db.placename.find(placename => placename._id === place.placename_id),
			feature: (place) => db.feature.find(feature => feature._id === place.feature_id),
		},

		membership: {
			group: (membership) => db.group.find(group => group._id === membership.group_id),
		},

		names: {
			placename: (name) => db.placename.find(placename => placename._id === name.placename_id),
			identical: (name) => db.name.filter(thisname => name.identical_ids && name.identical_ids.includes(thisname._id)),
			similar: (name) => db.name.filter(thisname => name.similar_ids && name.similar_ids.includes(thisname._id)),
			meaning: (name) => db.meaning.find(meaning => meaning._id === name.meaning_id),
		},

		spoken: {
			speaker: (spoken) => db.speaker.find(speaker => speaker._id === spoken.speaker_id),
		},

		total: {
			island: () => db.island.length,
			part: () => db.part.length,
			map: () => db.map.length,
			region: () => db.region.length,
			sector: () => db.sector.length,
			district: () => db.district.length,
			zone: () => db.zone.length,
			speaker: () => db.speaker.length,
			group: () => db.group.length,
			feature: () => db.feature.length,
			tribe: () => db.tribe.length,
			placename: () => db.placename.length,
			place: () => db.place.length,
			name: () => db.name.length,
		},

		Query: {
			islands: (parent, args) => getRecords(db.island, args),
			island: (parent, args) => getRecord(db.island, args),
			parts: (parent, args) => getRecords(db.part, args),
			part: (parent, args) => getRecord(db.part, args),
			maps: (parent, args) => getRecords(db.map, args),
			map: (parent, args) => getRecord(db.map, args),
			regions: (parent, args) => getRecords(db.region, args),
			region: (parent, args) => getRecord(db.region, args),
			sectors: (parent, args) => getRecords(db.sector, args),
			sector: (parent, args) => getRecord(db.sector, args),
			districts: (parent, args) => getRecords(db.district, args),
			district: (parent, args) => getRecord(db.district, args),
			zones: (parent, args) => getRecords(db.zone, args),
			zone: (parent, args) => getRecord(db.zone, args),
			speakers: (parent, args) => getRecords(db.speaker, args),
			speaker: (parent, args) => getRecord(db.speaker, args),
			groups: (parent, args) => getRecords(db.group, args),
			group: (parent, args) => getRecord(db.group, args),
			features: (parent, args) => getRecords(db.feature, args),
			feature: (parent, args) => getRecord(db.feature, args),
			tribes: (parent, args) => getRecords(db.tribe, args),
			tribe: (parent, args) => getRecord(db.tribe, args),
			placenames: (parent, args) => getRecords(db.placename, args),
			placename: (parent, args) => getRecord(db.placename, args),
			places: (parent, args) => getRecords(db.place, args),
			place: (parent, args) => getRecord(db.place, args),
			names: (parent, args) => getRecords(db.name, args),
			name: (parent, args) => getRecord(db.name, args),
			search: (parent, args) => getSearch(db.search, args),
			autocomplete: (parent, args) => getAutocomplete(db.search, args),
			total: () => db.total,
		},
	};
};

function getSearch(collection, search) {
	if (search) {
		let count = 0;
		return collection.filter(record => {
			if (count >= 10) return false;
			for (const term of search.split(" ")) {
				if (!record.text.includes(term)) return false;
			}
			count++;
			return true;
		});
	}
	return [];
}

function getAutocomplete(collection, search) {
	if (search && search.lang && search.term && search.term.length >= 3) return collection[search.lang].filter(record => record.text && record.text.includes(search.term));
	return [];
}

function filter(record, filters) {
	for (let filter of filters) {
		if (filter.field && filter.value) {
			if (filter.field.endsWith("slug") || filter.field.endsWith("title")) {
				if (get(record, filter.field + ".en") !== filter.value && get(record, filter.field + ".mi") !== filter.value) return false;
			} else {
				if (get(record, filter.field) !== filter.value) return false;
			}
		}
	}
	return true;
}

function getRecord(collection, args) {
	if (args.filter && args.filter.length) {
		return collection.find(record => filter(record, args.filter));
	}
	return [];
}

function getRecords(collection, args) {
	if (args.filter && args.filter.length) {
		collection = collection.filter(record => filter(record, args.filter));
	}
	if (args.sort && args.sort.field) {
		collection = sortBy(collection, [args.sort.field, '_id']);
		if ( args.sort.order === -1) collection.reverse();
	}
	if (args.pagination) {
		const pagination = [];
		if (args.pagination.start) {
			pagination.push(args.pagination.start);
			if (args.pagination.size) pagination.push(pagination[0] + args.pagination.size);
		} else if (args.pagination.page && args.pagination.size) {
				pagination.push(args.pagination2.size * args.pagination.page);
				pagination.push(pagination[0] + args.pagination.size);
		} else {
			pagination.push(0);
			pagination.push(args.pagination.size);
		}
		collection = collection.slice(...pagination);
	}
	return collection;
}
