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
	for (var obj in copy) {
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

exports.getSpeakers = async (filter, depth) => {
	var speakers = db.tables.Speaker.chain().find().simplesort('id').data();
	for (var speaker in speakers) {
		speakers[speaker] = removeLokiMeta(speakers[speaker]);
		speakers[speaker].image = {
			portrait: '/media/images/speaker/' + speakers[speaker].code + '-portrait.jpg'
		};
	}
	return speakers;
}

exports.getParts = async (filter, depth) => {
	var parts = db.tables.Part.chain().find(filter).simplesort('id').data();
	for (var part in parts) {
		parts[part] = removeLokiMeta(parts[part]);
		parts[part].image = {
			front: '/media/images/part/' + parts[part].code + '-front.png'
		};
		if (depth > 0) {
			parts[part].regions = await exports.getRegions({part: parts[part].id}, depth - 1);
		}
	}
	return parts;
}

exports.getImageMaps = async (filter, depth) => {
	var imagemaps = db.tables.ImageMap.chain().find(filter).simplesort('id').data();
	for (var imagemap in imagemaps) {
		imagemaps[imagemap] = removeLokiMeta(imagemaps[imagemap]);
		imagemaps[imagemap].image = {
			map: '/media/images/imagemap/' + imagemaps[imagemap].code + '.jpg'
		};
		if (depth >= 0) {
			for (var map in imagemaps[imagemap].imagemaplinks) {
				//imagemaps[imagemap].imagemaplinks[map].maplink = (await exports.getImageMaps({id: imagemaps[imagemap].imagemaplinks[map].maplink}, -1))[0];
				//imagemaps[imagemap].imagemaplinks[map].maplink = Object.assign({}, (await exports.getImageMaps({id: imagemaps[imagemap].imagemaplinks[map].maplink}, -1))[0]);
				var maplink = (await exports.getImageMaps({id: imagemaps[imagemap].imagemaplinks[map].maplink}, -1))[0];
				imagemaps[imagemap].imagemaplinks[map].name = maplink.name;
				imagemaps[imagemap].imagemaplinks[map].code = maplink.code;
			}
		}
		if (depth > 0) {
			imagemaps[imagemap].zones = [];
			var regions = await exports.getRegions({"location.imagemap.map": imagemaps[imagemap].id}, depth - 1);
			for (var region in regions) {
				imagemaps[imagemap].zones = imagemaps[imagemap].zones.concat(regions[region].zones);
			}
		}
	}
	return imagemaps;
}

exports.getIslands = async (filter, depth) => {
	var islands = db.tables.Island.chain().find(filter).simplesort('id').data();
	for (var island in islands) {
		islands[island] = removeLokiMeta(islands[island]);
		islands[island].image = {
			landscape: '/media/images/island/' + islands[island].code + '-landscape.png',
			banner: '/media/images/island/' + islands[island].code + '-banner.jpg'
		};
		if (depth > 0) {
			islands[island].regions = await exports.getRegions({island: islands[island].id}, depth - 1);
			if (islands.length == 1) {if (depth > 0)
				islands[island].imagemaps = await exports.getImageMaps({island: islands[island].id}, 2);
				islands[island].parts = await exports.getParts({island: islands[island].id});
			}
		}
	}
	return islands;
}

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
		if (regions.length == 1) {
			regions[region].island = (await exports.getIslands({id: regions[region].island}))[0];
			//regions[region].imagemap = (await exports.getImageMaps({id: zones[zone].region.imagemap}))[0];
			regions[region].part = (await exports.getParts({id: regions[region].part}))[0];
		}
	}
	return regions;
}

exports.getZones = async (filter, depth) => {
	var zones = db.tables.Zone.chain().find(filter).simplesort('id').data();
	for (var zone in zones) {
		zones[zone] = removeLokiMeta(zones[zone]);
		zones[zone].image = {
			landscape: '/media/images/zone/' + zones[zone].code + '-landscape.png',
			banner: '/media/images/zone/' + zones[zone].code + '-banner.jpg'
		};
		zones[zone].audio = '/media/audio/' + zones[zone].id + '.mp3';
		if (depth > 0) {
			zones[zone].places = await exports.getPlaces({zone: zones[zone].id});
		}
		if (zones.length == 1) {
			zones[zone].region = (await exports.getRegions({id: zones[zone].region}))[0];
		}
	}
	return zones;
}

exports.getPlaces = async (filter, depth) => {
	var places = db.tables.Place.chain().find(filter).simplesort('id').data();
	return removeLokiMetas(places);
}

exports.getNames = async (filter, depth) => {
	var places = db.tables.Place.chain().find(filter).simplesort('id').data();
	return removeLokiMetas(places);
}

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
}

exports.getKind = async (kind) => {
	/*db.tables.Place.find({$efinedin: {"kinds." + kind: 'string'}}).forEach(function(place) {
	});*/
}

exports.getSuggestions = async () => {
	var suggestions = [];
	db.tables.Place.find().forEach(function(place) {
		for (var name in place.names) {
			suggestions.push({name: name, type: 'Name'});
		}
		if ('kinds' in place) {
			for (var kind in place.kinds) {
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
