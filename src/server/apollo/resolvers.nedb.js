//const utils = require('./db/utils');

module.exports = function(db) {
	return {
		island: {
			parts(island) {
				return db.parts.asyncFind({island_id: island._id});
			},
			maps(island) {
				return db.maps.asyncFind({island_id: island._id});
			},
			regions(island) {
				return db.regions.asyncFind({island_id: island._id});
			},
			zones(island) {
				return db.zones.asyncFind({island_id: island._id});
			},
			placenames(island) {
				return db.placenames.asyncFind({island_id: island._id});
			},
			speakers(island) {
				return db.placenames.asyncFind({island_id: island._id,}).then(placenames => {
					return db.speakers.asyncFind({_id: {$in: placenames.map(placename => placename.names).flat().filter(name => name.spoken).map(name => name.spoken.speaker_id)}});
				});
			},
			/*code(island) {
				return utils.createCode(island.title.en || island.title.mi);
			},
			slug(island) {
				return {
					en: utils.createCode(island.title.en === island.title.mi ? null : island.title.en),
					mi: utils.createCode(island.title.mi),
				}
			},*/
		},

		part: {
			previous(part) {
				return db.part.asyncFindOne({_id: 'pa_' + (parseInt(part._id.split('_')[1]) - 1)});
			},
			next(part) {
				return db.part.asyncFindOne({_id: 'pa_' + (parseInt(part._id.split('_')[1]) + 1)});
			},
			island(part) {
				return db.islands.asyncFindOne({_id: part.island_id});
			},
			maps(part) {
				return db.maps.asyncFind({part_id: part._id});
			},
			regions(part) {
				return db.regions.asyncFind({part_id: part._id});
			},
			zones(part) {
				return db.zones.asyncFind({part_id: part._id});
			},
			placenames(part) {
				return db.placenames.asyncFind({part_id: part._id});
			},
			speakers(part) {
				return db.placenames
					.asyncFind({part_id: part._id,
					})
					.then(placenames => {
						return db.speakers.asyncFind({_id: {$in: placenames.map(placename => placename.names).flat().filter(name => name.audio).map(name => name.spoken.speaker_id)}});
					});
			},
			/*image(obj) {
				return {
					portrait: /img/part/ + obj.code + -front.png
				}
			},*/
		},

		/*mapareas: {
			map(mapareas) {
				return db.maps.asyncFindOne({_id: mapareas.map._id});
			},
		},*/

		maplink: {
			map(map) {
				return db.maps.asyncFindOne({_id: map.map_id});
			},
		},

		map: {
			island(map) {
				return db.islands.asyncFindOne({_id: map.island_id});
			},
			part(map) {
				return db.parts.asyncFindOne({_id: map.part_id});
			},
			regions(map) {
				return db.regions.asyncFind({map_id: map._id});
			},
			zones(map) {
				return db.zones.asyncFind({'map.map_id': map._id});
			},
			/*image(map) {
				return {
					portrait: /img/map/ + map.code + -trans.png
				}
			},*/
		},

		region: {
			previous(region) {
				return db.region.asyncFindOne({_id: 're_' + (parseInt(region._id.split('_')[1]) - 1)});
			},
			next(region) {
				return db.region.asyncFindOne({_id: 're_' + (parseInt(region._id.split('_')[1]) + 1)});
			},
			island(region) {
				return db.islands.asyncFindOne({_id: region.island_id});
			},
			part(region) {
				return db.parts.asyncFindOne({_id: region.part_id});
			},
			map(region) {
				return db.maps.asyncFindOne({_id: region.map_id});
			},
			zones(region) {
				return db.zones.asyncFind({region_id: region._id});
			},
			/*image(region) {
				return {
					banner: /img/region/ + region.code + -banner.jpg,
					landscape: /img/region/ + region.code + -landscape.png
				}
			},*/
		},

		zone: {
			previous(zone) {
				return db.zone.find({_id: 'zo_' + (parseInt(zone._id.split('_')[1]) - 1)});
			},
			next(zone) {
				return db.zone.find({_id: 'zo_' + (parseInt(zone._id.split('_')[1]) + 1)});
			},
			island(zone) {
				return db.islands.asyncFindOne({_id: zone.island_id});
			},
			part(zone) {
				return db.parts.asyncFindOne({_id: zone.part_id});
			},
			region(zone) {
				return db.regions.asyncFindOne({_id: zone.region_id});
			},
			placenames(zone) {
				return db.placenames.asyncFind({zone_id: zone._id});
			},
			speakers(zone) {
				return db.placenames.asyncFind({zone_id: zone._id}).then(placenames => {
					return db.speakers.asyncFind({_id: {$in: placenames.map(placename => placename.names).flat().filter(name => name.audio).map(name => name.spoken.speaker_id)}});
				});
			},
			featured(zone) {
				return db.placenames.asyncFind({zone_id: zone._id, featured: {$exists: true}}); //.sort({featured._id: 1});
			},
			tribes(zone) {
				return db.tribes.asyncFind({_id: {$in: zone.tribe_ids}});
			},
		},

		placename: {
			zone(placename) {
				return db.zones.asyncFindOne({_id: placename.zone_id});
			},
			part(placename) {
				return db.parts.asyncFindOne({_id: placename.part_id});
			},
			island(placename) {
				return db.islands.asyncFindOne({_id: placename.island_id});
			},
			zones(placename) {
				return db.zone.asyncFind({_id: {$in: placename.zone_ids}});
			},
		},

		name: {
			meaning(name) {
				return db.meaning.asyncFindOne({'title.mi': name.title.mi});
			},
			identical(name) {
				return db.name.asyncFind({'title.mi': name.title.mi});
			},
			similar(name) {
				return db.name.asyncFind({'title.mi': {$ne: name.title.mi}}).sort((a, b) => levenshtein(name.title.mi, a.title.mi) - levenshtein(name.title.mi, b.title.mi)).slice(0, 8);
			},
		},

		place: {
			feature(place) {
				return db.features.asyncFindOne({_id: place.feature_id});
			},
		},

		/*maparea: {
			shape(maparea) {
				if (maparea.coords.length == 3) return circle;
				if (maparea.coords.length == 4) return rect;
				return poly;
			},
		},*/

		membership: {
			group(membership) {
				return db.groups.asyncFindOne({_id: membership.group_id});
			},
		},

		spoken: {
			speaker(spoken) {
				return db.speakers.asyncFindOne({_id: spoken.speaker_id});
			},
		},

		group: {
			feature(group) {
				return db.features.asyncFindOne({_id: group.feature_id});
			},
			placenames(group) {
				return db.placenames.asyncFind({'places.groups.group_id': group._id});
			},
			/*placenames(obj) {
				return db.placenames.asyncFind({_id: obj.placename._id});
			},*/
		},

		see: {
			placename(see) {
				return db.placenames.asyncFindOne({_id: see.placename_id});
			},
		},

		speaker: {
			zones(speaker) {
				return db.zones.asyncFind({_id: {$in: speaker.zone_ids}});
			},
			placenames(speaker) {
				return db.placenames.asyncFind({'names.speaker_id': speaker._id});
			},
			/*fullname(speaker) {
				return [
					speaker.title.parts.title,
					speaker.title.parts.first,
					speaker.title.parts.nick ? ( + speaker.title.parts.nick + ) : null,
					speaker.title.parts.middle,
					speaker.title.parts.last,
					speaker.title.parts.suffix,
				].filter(a => a).join( );
			},*/
		},

		tribe: {
			zones(tribe) {
				return db.zones.asyncFind({tribe_id: tribe._id});
			},
		},

		feature: {
			placenames(feature) {
				return db.placenames.asyncFind({'places.feature_id': feature._id});
			},
		},

		Query: {
			islands(obj, args) {
				return db.islands.asyncFind(...params(args));
			},
			island(obj, args) {
				return db.islands.asyncFindOne(...params(args));
			},
			parts(obj, args) {
				return db.parts.asyncFind(...params(args));
			},
			part(obj, args) {
				return db.parts.asyncFindOne(...params(args));
			},
			maps(obj, args) {
				return db.maps.asyncFind(...params(args));
			},
			map(obj, args) {
				return db.maps.asyncFindOne(...params(args));
			},
			regions(obj, args) {
				return db.regions.asyncFind(...params(args));
			},
			region(obj, args) {
				return db.regions.asyncFindOne(...params(args));
			},
			zones(obj, args) {
				return db.zones.asyncFind(...params(args));
			},
			zone(obj, args) {
				return db.zones.asyncFindOne(...params(args));
			},
			speakers(obj, args) {
				return db.speakers.asyncFind(...params(args));
			},
			speaker(obj, args) {
				return db.speakers.asyncFindOne(...params(args));
			},
			groups(obj, args) {
				return db.groups.asyncFind(...params(args));
			},
			group(obj, args) {
				return db.groups.asyncFindOne(...params(args));
			},
			features(obj, args) {
				return db.features.asyncFind(...params(args));
			},
			feature(obj, args) {
				return db.features.asyncFindOne(...params(args));
			},
			tribes(obj, args) {
				return db.tribes.asyncFind(...params(args));
			},
			tribe(obj, args) {
				return db.tribes.asyncFindOne(...params(args));
			},
			placenames(obj, args) {
				return db.placenames.asyncFind(...params(args));
			},
			placename(obj, args) {
				return db.placenames.asyncFindOne(...params(args));
			},
		},
	};
};

function params(args) {
	if (!args.sort && !args.pagination) {
		return [args];
	}
	const options = [];
	if (args.sort) {
		options.push(['sort', {[args.sort.field || '_id']: args.sort.order || 1}]);
		delete args.sort;
	}
	if (args.pagination) {
		if (args.pagination.offset) options.push(['skip', args.pagination.offset]);
		if (args.pagination.limit) options.push(['limit', args.pagination.limit]);
		delete args.pagination;
	}
	return [args, options];
}
