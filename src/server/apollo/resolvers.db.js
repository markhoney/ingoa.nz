//const utils = require('./db/utils');

module.exports = function(db) {
	return {
		island: {
			parts(island) {
				return db.parts.asyncFind({
					island_id: island._id,
				});
			},
			maps(island) {
				return db.maps.asyncFind({
					island_id: island._id,
				});
			},
			regions(island) {
				return db.regions.asyncFind({
					island_id: island._id,
				});
			},
			zones(island) {
				return db.zones.asyncFind({
					island_id: island._id,
				});
			},
			placenames(island) {
				return db.placenames.asyncFind({
					island_id: island._id,
				});
			},
			speakers(island) {
				return db.placenames.asyncFind({
					island_id: island._id,
				}).then(placenames => {
					/*var speakerids = [];
					placenames.forEach(function(placename) {
						placename.names.forEach(function(name) {
							if ('spoken' in name) {
								speakerids.push(name.spoken.speaker._id);
							}
						});
					});
					return db.speakers.asyncFind({
						_id: {
							$in: speakerids,
						},
					});*/
					return db.speakers.asyncFind({
						_id: {
							$in: placenames.map(placename => placename.names).flat().filter(name => name.spoken).map(name => name.spoken.speaker_id),
						},						
					});
				});
			},
			/*image(obj) {
				return {
					banner: /img/island/ + obj.code + -banner.jpg,
					landscape: /img/island/ + obj.code + -landscape.png,
					portrait: /img/island/ + obj.code + .png
				}
			},*/
			/*code() {
				return utils.createCode(obj.name.en === obj.name.mi ? null : obj.name.en);
			},
			slug() {
				return {
					en: utils.createCode(obj.name.en === obj.name.mi ? null : obj.name.en),
					mi: utils.createCode(obj.name.mi),
				}
			},*/
		},

		part: {
			island(part) {
				return db.islands.asyncFindOne({
					_id: part.island_id,
				});
			},
			maps(part) {
				return db.maps.asyncFind({
					part_id: part._id,
				});
			},
			regions(part) {
				return db.regions.asyncFind({
					part_id: part._id,
				});
			},
			zones(part) {
				return db.zones.asyncFind({
					part_id: part._id,
				});
			},
			placenames(part) {
				return db.placenames.asyncFind({
					part_id: part._id,
				});
			},
			speakers(part) {
				return db.placenames
					.asyncFind({
						part_id: part._id,
					})
					.then(placenames => {
						return db.speakers.asyncFind({
							_id: {
								$in: placenames.map(placename => placename.names).flat().filter(name => name.audio).map(name => name.spoken.speaker_id),
							},
						});
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
				return db.maps.asyncFindOne({
					_id: mapareas.map._id,
				});
			},
		},*/

		maplink: {
			map(map) {
				return db.maps.asyncFindOne({
					_id: map.map_id,
				});
			},
		},

		map: {
			island(map) {
				return db.islands.asyncFindOne({
					_id: map.island_id,
				});
			},
			part(map) {
				return db.parts.asyncFindOne({
					_id: map.part_id,
				});
			},
			regions(map) {
				return db.regions.asyncFind({
					map_id: map._id,
				});
			},
			zones(map) {
				return db.zones.asyncFind({
					'map.map_id': map._id,
				});
			},
			/*image(map) {
				return {
					portrait: /img/map/ + map.code + -trans.png
				}
			},*/
		},

		region: {
			island(region) {
				return db.islands.asyncFindOne({
					_id: region.island_id,
				});
			},
			part(region) {
				return db.parts.asyncFindOne({
					_id: region.part_id,
				});
			},
			map(region) {
				return db.maps.asyncFindOne({
					_id: region.map_id,
				});
			},
			zones(region) {
				return db.zones.asyncFind({
					region_id: region._id,
				});
			},
			/*image(region) {
				return {
					banner: /img/region/ + region.code + -banner.jpg,
					landscape: /img/region/ + region.code + -landscape.png
				}
			},*/
		},

		zone: {
			island(zone) {
				return db.islands.asyncFindOne({
					_id: zone.island_id,
				});
			},
			part(zone) {
				return db.parts.asyncFindOne({
					_id: zone.part_id,
				});
			},
			region(zone) {
				return db.regions.asyncFindOne({
					_id: zone.region_id,
				});
			},
			placenames(zone) {
				return db.placenames.asyncFind({
					zone_id: zone._id,
				});
			},
			speakers(zone) {
				return db.placenames
					.asyncFind({
						zone_id: zone._id,
					})
					.then(placenames => {
						return db.speakers.asyncFind({
							_id: {
								$in: placenames.map(placename => placename.names).flat().filter(name => name.audio).map(name => name.spoken.speaker_id),
							},
						});
					});
			},
			featured(zone) {
				return db.placenames.asyncFind({
					zone_id: zone._id,
					featured: {
						$exists: true,
					},
				}); //.sort({featured._id: 1});
			},
			ngaiwi(zone) {
				return db.ngaiwi.asyncFind({
					_id: {
						$in: zone.iwi_ids,
					},
				});
			},
			/*image(zone) {
				return {
					landscape: /img/region/ + zone.code + -landscape.png
				}
			},*/
		},

		placename: {
			zone(placename) {
				return db.zones.asyncFindOne({
					_id: placename.zone_id,
				});
			},
			part(placename) {
				return db.parts.asyncFindOne({
					_id: placename.part_id,
				});
			},
			island(placename) {
				return db.islands.asyncFindOne({
					_id: placename.island_id,
				});
			},
		},

		place: {
			feature(place) {
				return db.features.asyncFindOne({
					_id: place.feature_id,
				});
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
				return db.groups.asyncFindOne({
					_id: membership.group_id,
				});
			},
		},

		spoken: {
			speaker(spoken) {
				return db.speakers.asyncFindOne({
					_id: spoken.speaker_id,
				});
			},
		},

		group: {
			feature(group) {
				return db.features.asyncFindOne({
					_id: group.feature_id,
				});
			},
			placenames(group) {
				return db.placenames.asyncFind({
					'places.groups.group_id': group._id,
				});
			},
			/*placenames(obj) {
				return db.placenames.asyncFind({_id: obj.placename._id});
			},*/
		},

		see: {
			placename(see) {
				return db.placenames.asyncFindOne({
					_id: see.placename_id,
				});
			},
		},

		speaker: {
			zones(speaker) {
				return db.zones.asyncFind({
					_id: {
						$in: speaker.zone_ids,
					},
				});
			},
			placenames(speaker) {
				return db.placenames.asyncFind({
					'names.speaker_id': speaker._id,
				});
			},
			/*fullname(speaker) {
				return [
					speaker.name.parts.title,
					speaker.name.parts.first,
					speaker.name.parts.nick ? ( + speaker.name.parts.nick + ) : null,
					speaker.name.parts.middle,
					speaker.name.parts.last,
					speaker.name.parts.suffix,
				].filter(a => a).join( );
			},*/
		},

		iwi: {
			zones(iwi) {
				return db.zones.asyncFind({
					iwi_id: iwi._id,
				});
			},
		},

		feature: {
			placenames(feature) {
				return db.placenames.asyncFind({
					'places.feature_id': feature._id,
				});
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
			ngaiwi(obj, args) {
				return db.ngaiwi.asyncFind(...params(args));
			},
			iwi(obj, args) {
				return db.ngaiwi.asyncFindOne(...params(args));
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
