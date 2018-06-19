const {createError} = require('micro');

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
	for (obj in copy) {
		copy[obj] = removeLokiMeta(copy[obj]);
	}
	return copy;
}

function cleanArray(actual) {
  var newArray = new Array();
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

function fixSpeaker(obj) {
	var speaker = removeLokiMeta(obj);
	speaker.image = {
		portrait: '/media/images/speaker/' + speaker.code + '-portrait.jpg'
	};
	return speaker;
}

function fixIsland(obj) {
	var island = removeLokiMeta(obj);
	island.image = {
		landscape: '/media/images/island/' + island.code + '-landscape.png',
		banner: '/media/images/island/' + island.code + '-banner.jpg'
	};
	return island;
}

function fixPart(obj) {
	var part = removeLokiMeta(obj);
	part.image = {
		front: '/media/images/part/' + part.code + '-front.png'
	};
	return part;
}

function fixImageMap(obj) {
	var imagemap = removeLokiMeta(obj);
	imagemap.image = {
		map: '/media/images/imagemap/' + imagemap.code + '.jpg'
	};
	return imagemap;
}

function fixRegion(obj) {
	var region = removeLokiMeta(obj);
	region.image = {
		landscape: '/media/images/region/' + region.code + '-landscape.png',
		banner: '/media/images/region/' + region.code + '-banner.jpg'
	}
	return region;
}

function fixZone(obj) {
	var zone = removeLokiMeta(obj);
	zone.image = {
		landscape: '/media/images/zone/' + zone.code + '-landscape.png',
		banner: '/media/images/zone/' + zone.code + '-banner.jpg'
	};
	zone.audio = '/media/audio/' + zone.id + '.mp3';
	return zone;
}

exports.getSpeakers = async () => {
	var speakers = db.tables.Speaker.chain().find().simplesort('id').data();
	for (speaker in speakers) {
		speakers[speaker] = fixSpeaker(speakers[speaker]);
	}
	return speakers;
}

exports.getSpeaker = async (filter) => {
	var speaker = fixSpeaker(db.tables.Speaker.find(filter)[0]);
	// Add zones spoken, etc
	return speaker;
}

exports.getParts = async (filter, depth) => {
	var parts = db.tables.Part.chain().find().simplesort('id').data();
	for (part in parts) {
		parts[part] = fixPart(parts[part]);
		if (depth) {
			parts[part].regions = await exports.getRegions({part: parts[part].id}, depth - 1);
		}
	}
	return parts;
}

exports.getPart = async (filter, depth) => {
	var part = fixPart(db.tables.Part.find(filter)[0]);
	part.island = await exports.getIsland({id: part.island});
	if (depth) {
		part.regions = await exports.getRegions({part: part.id}, depth - 1);
	}
	return part;
}

exports.getImageMaps = async (filter, depth) => {
	var imagemaps = db.tables.ImageMap.chain().find(filter).simplesort('id').data();
	for (imagemap in imagemaps) {
		imagemaps[imagemap] = fixImageMap(imagemaps[imagemap]);
		if (depth) {
			imagemaps[imagemap].regions = await exports.getRegions({"location.imagemap.map": imagemaps[imagemap].id}, depth - 1);
		}
	}
	return imagemaps;
}

exports.getImageMap = async (filter, depth) => {
	var imagemap = fixImageMap(db.tables.ImageMap.find(filter)[0]);
	imagemap.island = await exports.getIsland({id: imagemap.island});
	if (depth) {
		imagemap.regions = await exports.getRegions({"location.imagemap.map": imagemap.id}, depth - 1);
	}
	return imagemap;
}

exports.getIslands = async (filter, depth) => {
	var islands = db.tables.Island.chain().find(filter).simplesort('id').data();
	for (island in islands) {
		islands[island] = fixIsland(islands[island]);
		islands[island].location = {
			imagemaps: await exports.getImageMaps({island: islands[island].id})
		};
		if (depth) {
			islands[island].regions = await exports.getRegions({island: islands[island].id}, depth - 1);
		}
	}
	return islands;
}

exports.getIsland = async (filter, depth) => {
	var island = fixIsland(db.tables.Island.find(filter)[0]);
	if (depth) {
		island.regions = await exports.getRegions({island: island.id}, depth - 1);
	}
	return island;
}

exports.getRegions = async (filter, depth) => {
	var regions = db.tables.Region.chain().find(filter).simplesort('id').data();
	for (region in regions) {
		regions[region] = fixRegion(regions[region]);
		if (depth) {
			regions[region].zones = await exports.getZones({region: regions[region].id});
		}
	}
	return regions;
}

exports.getRegion = async (filter, depth) => {
	var region = fixRegion(db.tables.Region.find(filter)[0]);
	region.island = await exports.getIsland({id: region.island});
	region.part = await exports.getPart({id: region.part});
	if (depth) {
		region.zones = await exports.getZones({region: region.id});
	}
	return region;
}

exports.getZones = async (filter) => {
	var zones = db.tables.Zone.chain().find(filter).simplesort('id').data();
	for (zone in zones) {
		zones[zone] = fixZone(zones[zone]);
	}
	return zones;
}

exports.getZone = async (filter) => {
	var zone = fixZone(db.tables.Zone.find(filter)[0]);
	zone.region = await exports.getRegion({id: zone.region});
	zone.places = await exports.getPlaces({zone: zone.id});
	return zone;
}

exports.getPlaces = async (filter) => {
	var places = db.tables.Place.chain().find(filter).simplesort('id').data();
	return removeLokiMetas(places);
}

exports.getKinds = async () => {
	var kinds = [];
	db.tables.Place.find().forEach(function(place) {
		if ('kinds' in place) {
			for (kind in place.kinds) {
				kinds.push(kind);
			}
		}
	});
	return kinds.filter(arrayUnique).sort();
}

exports.getKind = async (kind) => {
	db.tables.Place.find({$efinedin: {"kinds." + kind: 'string'}}).forEach(function(place) {
	});
}

exports.getSuggestions = async () => {
	var suggestions = [];
	db.tables.Place.find().forEach(function(place) {
		for (name in place.names) {
			suggestions.push({name: name, type: 'Name'});
		}
		if ('kinds' in place) {
			for (kind in place.kinds) {
				suggestions.push({name: kind, type: 'Kind'});
			}
		}
	});
	db.tables.Zone.find().forEach(function(zone) {
		suggestions.push({name: zone.name, type: 'Zone'});
	});
	db.tables.Region.find().forEach(function(region) {
		suggestions.push({name: region.name, type: 'Region'});
	});
	db.tables.Island.find().forEach(function(island) {
		suggestions.push({name: island.name, type: 'Island'});
		suggestions.push({name: island.tereo, type: 'Island'});
	});
	db.tables.Speaker.find().forEach(function(speaker) {
		suggestions.push({name: speaker.name, type: 'Speaker'});
		suggestions.push({name: cleanArray([speaker.fullname.title, speaker.fullname.first, (speaker.fullname.nick ? "(" + speaker.fullname.nick + ")" : null), speaker.fullname.middle, speaker.fullname.last, speaker.fullname.suffix]).join(" "), type: 'Speaker'});
	});
	return suggestions.filter(arrayUnique);
}
});
