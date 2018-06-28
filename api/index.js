//const {createError} = require('micro');

const db = require('../db/loki.js');
db(function(db) {
	function removeLokiMeta(obj) {
		var copy = Object.assign({}, obj);
		delete copy.meta;
		delete copy.$loki;
		return copy;
	}

	function removeLokiMetas(objs) {
		var copy = Object.assign({}, objs);
		for (var obj in copy) {
			copy[obj] = removeLokiMeta(copy[obj]);
		}
		return copy;
	}

	function cleanArray(actual) {
		var newArray = [];
		for (var i = 0; i < actual.length; i++) {
			if (actual[i]) {
				newArray.push(actual[i]);
			}
		}
		return newArray;
	}

	function arrayUnique(value, index, self) {
		return self.indexOf(value) === index;
	}

	exports.getSpeakers = async (filter, depth) => {
		var speakers = db.tables.Speaker.chain().find(filter).simplesort('id').data();
		for (var speaker in speakers) {
			speakers[speaker] = removeLokiMeta(speakers[speaker]);
			/*speakers[speaker].image = {
				portrait: '/media/images/speaker/' + speakers[speaker].code + '-portrait.jpg'
			};*/
		}
		return speakers;
	};

	exports.getImageMaps = async (filter, depth) => {
		var imagemaps = db.tables.ImageMap.chain().find(filter).simplesort('id').data();
		for (var imagemap in imagemaps) {
			imagemaps[imagemap] = removeLokiMeta(imagemaps[imagemap]);
			imagemaps[imagemap].image = {
				map: '/media/images/imagemap/' + imagemaps[imagemap].code + '.jpg',
				trans: '/media/images/imagemap/' + imagemaps[imagemap].code + '-trans.png'
			};
			if (depth >= 0) {
				for (var map in imagemaps[imagemap].imagemaplinks) {
					//For some reason, there's an issue with converting the maplink from an imagemap id to a new imagemap object, and the action appears to create a recursion error. I suspect that it's because a new copy of the object is not being created with the LokiJS query, although that doesn't make much sense to me. Maybe a caching issue, with Loki returning the same object when it's asked the same query twice?
					//imagemaps[imagemap].imagemaplinks[map].maplink = (await exports.getImageMaps({id: imagemaps[imagemap].imagemaplinks[map].maplink}, -1))[0];
					//imagemaps[imagemap].imagemaplinks[map].maplink = Object.assign({}, (await exports.getImageMaps({id: imagemaps[imagemap].imagemaplinks[map].maplink}, -1))[0]);
					var maplink = (await exports.getImageMaps({id: imagemaps[imagemap].imagemaplinks[map].maplink}, -1))[0];
					imagemaps[imagemap].imagemaplinks[map].linkedmap = {
						id: imagemaps[imagemap].imagemaplinks[map].maplink,
						name: maplink.name,
						names: maplink.names,
						code: maplink.code,
						codes: maplink.codes
					}
				}
			}
			if (depth > 0) {
				imagemaps[imagemap].zones = [];
				var regions = await exports.getRegions({'location.imagemap.map': imagemaps[imagemap].id}, depth - 1);
				for (var region in regions) {
					imagemaps[imagemap].zones = imagemaps[imagemap].zones.concat(regions[region].zones);
				}
			}
			if (imagemaps.length === 1) {
				imagemaps[imagemap].island = (await exports.getIslands({id: imagemaps[imagemap].island}))[0];
			}
		}
		return imagemaps;
	};

	exports.getIslands = async (filter, depth) => {
		var islands = db.tables.Island.chain().find(filter).simplesort('id').data();
		for (var island in islands) {
			islands[island] = removeLokiMeta(islands[island]);
			islands[island].image = {
				landscape: '/media/images/island/' + islands[island].code + '-landscape.png',
				banner: '/media/images/island/' + islands[island].code + '-banner.jpg'
			};
			islands[island].zone = await zoneDetails({code: islands[island].code, id: islands[island].zone}, 1, 1);
			if (depth > 0) {
				islands[island].regions = await exports.getRegions({island: islands[island].id}, depth - 1);
				if (islands.length === 1) {
					islands[island].imagemaps = await exports.getImageMaps({island: islands[island].id}, 2);
					islands[island].parts = await exports.getParts({island: islands[island].id});
				}
			}
		}
		return islands;
	};

	exports.getRegions = async (filter, depth) => {
		var regions = db.tables.Region.chain().find(filter).simplesort('id').data();
		for (var region in regions) {
			regions[region] = removeLokiMeta(regions[region]);
			regions[region].image = {
				landscape: '/media/images/region/' + regions[region].code + '-landscape.png',
				banner: '/media/images/region/' + regions[region].code + '-banner.jpg'
			}
			if (depth > 0) {
				regions[region].zones = await exports.getZones({region: regions[region].id}, depth - 1);
			}
			if (regions.length === 1) {
				regions[region].island = (await exports.getIslands({id: regions[region].island}))[0];
				//regions[region].imagemap = (await exports.getImageMaps({id: zones[zone].region.imagemap}))[0];
				regions[region].part = (await exports.getParts({id: regions[region].part}))[0];
			}
		}
		return regions;
	};

	async function zoneDetails(zone, depth, length) {
		zone.image = {
			landscape: '/media/images/zone/' + zone.code + '-landscape.png',
			banner: '/media/images/zone/' + zone.code + '-banner.jpg'
		};
		zone.audio = '/media/audio/' + zone.id + '.mp3';
		if (depth > 0) {
			zone.places = await exports.getPlaces({zone: zone.id});
		}
		if (length === 1) {
			zone.region = (await exports.getRegions({id: zone.region}))[0];
			var speakers = [];
			for (var place in zone.places) {
				for (var name in zone.places[place].placenames) {
					if ('audio' in zone.places[place].placenames[name]) {
						speakers.push(zone.places[place].placenames[name].audio.speaker);
					}
				}
			}
			zone.speakers = {};
			speakers = speakers.filter(arrayUnique);
			for (var speaker in speakers) {
				zone.speakers[speakers[speaker]] = (await exports.getSpeakers({id: speakers[speaker]}))[0];
			}
		}
		return zone;
	}

	exports.getZones = async (filter, depth) => {
		var zones = db.tables.Zone.chain().find(filter).simplesort('id').data();
		for (var zone in zones) {
			zones[zone] = removeLokiMeta(zones[zone]);
			zones[zone] = await zoneDetails(zones[zone], depth, zones.length);
		}
		return zones;
	};

	exports.getParts = async (filter, depth) => {
		var parts = db.tables.Part.chain().find(filter).simplesort('id').data();
		for (var part in parts) {
			parts[part] = removeLokiMeta(parts[part]);
			parts[part].image = {
				front: '/media/images/part/' + parts[part].code + '-front.png'
			};
			parts[part].zone = await zoneDetails({code: parts[part].code, id: parts[part].zone}, 1, 1);
			if (depth > 0) {
				parts[part].regions = await exports.getRegions({part: parts[part].id}, depth - 1);
			}
		}
		return parts;
	};

	exports.getPlaces = async (filter, depth) => {
		var places = db.tables.Place.chain().find(filter).simplesort('id').data();
		for (var place in places) {
			places[place] = removeLokiMeta(places[place]);
		}
		return places;
	};

	exports.getNames = async (filter, depth) => {
	};

	exports.getKinds = async (filter, depth) => {
		var kinds = [];
		db.tables.Place.find().forEach(function(place) {
			if ('kinds' in place) {
				for (var kind in place.kinds) {
					kinds.push(kind);
				}
			}
		});
		return kinds.filter(arrayUnique).sort();
	};

	exports.getKind = async (kind) => {
		/*db.tables.Place.find({$efinedin: {'kinds.' + kind: 'string'}}).forEach(function(place) {
		});*/
	};

	exports.getSuggestions = async () => {
		var suggestions = [];
		db.tables.Place.find().forEach(function(place) {
			place.placenames.foreach(function(name) {
				suggestions.push({name: name.name, type: 'Name'});
			});
			if ('kinds' in place) {
				place.kinds.forEach(function(kind) {
					suggestions.push({name: kind.name, type: 'Kind'});
				});
			}
		});
		db.tables.Zone.find().forEach(function(zone) {
			suggestions.push({name: zone.name, type: 'Zone'});
			if ('tereo' in zone) {
				suggestions.push({name: zone.tereo, type: 'Zone'});
			}
		});
		db.tables.Region.find().forEach(function(region) {
			suggestions.push({name: region.name, type: 'Region'});
			if ('tereo' in region) {
				suggestions.push({name: region.tereo, type: 'Region'});
			}
		});
		db.tables.Island.find().forEach(function(island) {
			suggestions.push({name: island.name, type: 'Island'});
			if ('tereo' in island) {
				suggestions.push({name: island.tereo, type: 'Island'});
			}
		});
		db.tables.Speaker.find().forEach(function(speaker) {
			suggestions.push({name: speaker.name, type: 'Speaker'});
			suggestions.push({name: cleanArray([speaker.fullname.title, speaker.fullname.first, (speaker.fullname.nick ? '(' + speaker.fullname.nick + ')' : null), speaker.fullname.middle, speaker.fullname.last, speaker.fullname.suffix]).join(' '), type: 'Speaker'});
		});
		return suggestions.filter(arrayUnique);
	};
});
