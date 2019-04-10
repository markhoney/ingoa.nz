const {sortBy} = require('lodash'); // find, filter, 

function getBookmarks(placenames) {
	return placenames.map(placename => placename.names.filter(name => name.spoken)).flat().sort((a, b) => a.spoken.start - b.spoken.start);
}

function getSpeakers(speakers, placenames) {
	return speakers.filter(speaker => speaker.code != "hugh_young" && placenames.map(placename => placename.names).flat().filter(name => name.spoken).map(name => name.spoken.speaker_id).includes(speaker._id));
}

/*function getImages(type, code, images) {
	return images.reduce((obj, image) => {
		obj[image.split('.')[0]] = '/media/images/' + type + '/' + code + '-' + image;
		return obj;
	}, {});
}*/

module.exports = function(db) {

	return {
		island: {
			parts(island) {
				return db.part.filter(part => part.island_id == island._id);
			},
			maps(island) {
				return db.map.filter(map => map.island_id == island._id);
			},
			regions(island) {
				return db.region.filter(region => region.island_id == island._id);
			},
			zones(island) {
				return db.zone.filter(zone => zone.island_id == island._id);
			},
			placenames(island) {
				return db.placename.filter(placename => placename.island_id == island._id);
			},
			bookmarks(island) {
				return getBookmarks(db.placename.filter(placename => placename.island_id == island._id));
			},
			speakers(island) {
				return getSpeakers(db.speaker, db.placename.filter(placename => placename.island_id == island._id));
			},
			/*image(island) {
				return getImages('island', island.code, ['banner.png', 'landscape.png', 'portrait.png']);
			},*/
		},

		part: {
			previous(part) {
				return db.part.find(mypart => mypart._id == 'pa_' + (parseInt(part._id.split('_')[1]) - 1));
			},
			next(part) {
				return db.part.find(mypart => mypart._id == 'pa_' + (parseInt(part._id.split('_')[1]) + 1));
			},
			island(part) {
				return db.island.find(island => island._id == part.island_id);
			},
			maps(part) {
				return db.map.filter(map => map.part_id == part._id);
			},
			regions(part) {
				return db.region.filter(region => region.part_id == part._id);
			},
			zones(part) {
				return db.zone.filter(zone => zone.part_id == part._id);
			},
			placenames(part) {
				return db.placename.filter(placename => placename.part_id == part._id);
			},
			bookmarks(part) {
				return getBookmarks(db.placename.filter(placename => placename.part_id == part._id));
			},
			speakers(part) {
				return getSpeakers(db.speaker, db.placename.filter(placename => placename.part_id == part._id));
			},
			/*image(part) {
				return getImages('part', part.code, ['front.jpg']);
			},*/
		},

		maplink: {
			map(maplink) {
				return db.map.find(map => map._id == maplink.map_id);
			},
		},

		map: {
			island(map) {
				return db.island.find(island => island._id == map.island_id);
			},
			part(map) {
				return db.part.find(part => part._id == map.part_id);
			},
			regions(map) {
				return db.region.filter(region => region.map_id == map._id);
			},
			zones(map) {
				return db.zone.filter(zone => zone.maplink.map_id == map._id);
			},
			/*image(map) {
				return getImages('map', map.code, ['portrait.png']);
			},*/
		},

		/*maparea: {
			shape(maparea) {
				if (maparea.coords.length == 3) return 'circle';
				if (maparea.coords.length == 4) return 'rect';
				return 'poly';
			},
		},*/

		region: {
			previous(region) {
				return db.region.find(myregion => myregion._id == 're_' + (parseInt(region._id.split('_')[1]) - 1));
			},
			next(region) {
				return db.region.find(myregion => myregion._id == 're_' + (parseInt(region._id.split('_')[1]) + 1));
			},
			island(region) {
				return db.island.find(island => island._id == region.island_id);
			},
			part(region) {
				return db.part.find(part => part._id == region.part_id);
			},
			map(region) {
				return db.map.find(map => map._id == region.map_id);
			},
			zones(region) {
				return db.zone.filter(zone => zone.region_id == region._id);
			},
			/*image(region) {
				return getImages('region', region.code, ['banner.jpg', 'landscape.png']);
			},*/
		},

		zone: {
			previous(zone) {
				return db.zone.find(myzone => myzone._id == 'zo_' + (parseInt(zone._id.split('_')[1]) - 1));
			},
			next(zone) {
				return db.zone.find(myzone => myzone._id == 'zo_' + (parseInt(zone._id.split('_')[1]) + 1));
			},
			island(zone) {
				return db.island.find(island => island._id == zone.island_id);
			},
			part(zone) {
				return db.part.find(part => part._id == zone.part_id);
			},
			region(zone) {
				return db.region.find(region => region._id == zone.region_id);
			},
			placenames(zone) {
				return db.placename.filter(placename => placename.zone_id == zone._id);
			},
			bookmarks(zone) {
				return getBookmarks(db.placename.filter(placename => placename.zone_id == zone._id));
			},
			speakers(zone) {
				return getSpeakers(db.speaker, db.placename.filter(placename => placename.zone_id == zone._id));
			},
			featured(zone) {
				return db.placename.filter(placename => (placename.zone_id == zone._id) && placename.featured);
			},
			ngaiwi(zone) {
				return db.iwi.filter(iwi => zone.iwi_ids.includes(iwi._id));
			},
			/*image(zone) {
				return getImages('zone', zone.code, ['landscape.png']);
			},*/
		},

		placename: {
			zone(placename) {
				return db.zone.find(zone => zone._id == placename.zone_id);
			},
			part(placename) {
				return db.part.find(part => part._id == placename.part_id);
			},
			island(placename) {
				return db.island.find(island => island._id == placename.island_id);
			},
			zones(placename) {
				return db.zone.filter(zone => placename.zone_ids.containes(zone._id));
			},
		},

		name: {
			meaning(name) {
				return db.meaning.find(meaning => meaning.name.mi == name.name.mi);
			},
			identical(name) {
				return db.name.filter(myname => myname.name.mi == name.name.mi);
			},
			similar(name) {
				return db.name.filter(myname => myname.name.mi != name.name.mi).sort((a, b) => levenshtein(name.name.mi, a.name.mi) - levenshtein(name.name.mi, b.name.mi)).slice(0, 8);
			},
		},

		place: {
			feature(place) {
				return db.feature.find(feature => feature._id == place.feature_id);
			},
		},

		membership: {
			group(membership) {
				return db.group.find(group => group._id == membership.group_id);
			},
		},

		spoken: {
			speaker(spoken) {
				return db.speaker.find(speaker => speaker._id == spoken.speaker_id);
			},
		},

		group: {
			feature(group) {
				return db.feature.find(feature => feature._id == group.feature_id);
			},
			placenames(group) {
				return db.placename.filter(placename => placename.places.groups.group_id == group._id);
			},
		},

		see: {
			placename(see) {
				return db.placename.find(placename => placename._id == see.placename_id);
			},
		},

		speaker: {
			zones(speaker) {
				return db.zone.filter(zone => speaker.zone_ids.includes(zone._id));
			},
			placenames(speaker) {
				return db.placename.filter(placename => placename.names.speaker_id == speaker._id);
			},
		},

		iwi: {
			zones(iwi) {
				return db.zone.filter(zone => zone.iwi_id == iwi._id);
			},
		},

		feature: {
			placenames(feature) {
				return db.placename.filter(placename => placename.places.feature_id == feature._id);
			},
		},

		Query: {
			islands(obj, args) {
				return getRecords(db.island, args);
			},
			island(obj, args) {
				return getRecord(db.island, args);
			},
			parts(obj, args) {
				return getRecords(db.part, args);
			},
			part(obj, args) {
				return getRecord(db.part, args);
			},
			maps(obj, args) {
				return getRecords(db.map, args);
			},
			map(obj, args) {
				return getRecord(db.map, args);
			},
			regions(obj, args) {
				return getRecords(db.region, args);
			},
			region(obj, args) {
				return getRecord(db.region, args);
			},
			zones(obj, args) {
				return getRecords(db.zone, args);
			},
			zone(obj, args) {
				return getRecord(db.zone, args);
			},
			speakers(obj, args) {
				return getRecords(db.speaker, args);
			},
			speaker(obj, args) {
				return getRecord(db.speaker, args);
			},
			groups(obj, args) {
				return getRecords(db.group, args);
			},
			group(obj, args) {
				return getRecord(db.group, args);
			},
			features(obj, args) {
				return getRecords(db.feature, args);
			},
			feature(obj, args) {
				return getRecord(db.feature, args);
			},
			ngaiwi(obj, args) {
				return getRecords(db.iwi, args);
			},
			iwi(obj, args) {
				return getRecord(db.iwi, args);
			},
			placenames(obj, args) {
				return getRecords(db.placename, args);
			},
			placename(obj, args) {
				return getRecord(db.placename, args);
			},
		},
	};
};

function getRecord(collection, args) {
	if (args.filter) {
		if (args.filter._id) return collection.find(record => args.filter._id == record._id);
		if (args.filter.code) return collection.find(record => args.filter.code == record.code);
	}
	return [];
}

function getRecords(collection, args) {
	if (args.filter) collection = collection.filter(record => record[args.filter.field] == args.filter.value);
	if (args.sort && args.sort.field) {
		collection = sortBy(collection, args.sort.field || '_id');
		if ( args.sort.order == -1) collection.reverse();
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
