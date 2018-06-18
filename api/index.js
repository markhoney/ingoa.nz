const {createError} = require('micro');

const db = require('../db/loki.js');
db(function(db) {
/*
function removeLokiMeta(input) {
	var output = Object.assign({}, input);
	delete output.meta;
	delete output.$loki;
	return output;
}

function removeLokiMetas(input) {
	var output = Object.assign({}, input);
	for (obj in output) {
		output[obj] = removeLokiMeta(output[obj]);
	}
	return output;
}
*/

function removeLokiMeta(obj) {
	delete obj.meta;
	delete obj.$loki;
}

function removeLokiMetas(objs) {
	objs.forEach(function(obj) {
		removeLokiMeta(obj);
	});
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

exports.getSpeakers = async () => {
	var speakers = db.tables.Speaker.chain().find().simplesort('id').data();
	removeLokiMetas(speakers);
	return speakers;
}

exports.getSpeaker = async (code) => {
	var speaker = db.tables.Speaker.find({code: code})[0];
	removeLokiMeta(speaker);
	return speaker;
}

exports.getIslands = async () => {
	var islands = db.tables.Island.chain().find().simplesort('id').data();
	removeLokiMetas(islands);
	islands.forEach(function(island) {
		island.image = '/media/images/island/' + island.code + '.png';
		island.banner = '/media/images/island/' + island.code + '.jpg';
	});
	return islands;
}

exports.getIsland = async (code) => {
	var island = db.tables.Island.find({code: code})[0];
	removeLokiMeta(island);
	return island;
}

exports.getParts = async () => {
	var parts = db.tables.Part.chain().find().simplesort('id').data();
	removeLokiMetas(parts);
	return parts;
}

exports.getPart = async (code) => {
	var part = db.tables.Part.find({code: code})[0];
	removeLokiMeta(part);
	return part;
}

exports.getRegions = async () => {
	var regions = db.tables.Region.chain().find().simplesort('id').data();
	removeLokiMetas(regions);
	regions.forEach(function(region) {
		region.image = '/media/images/region/' + region.code + '.png';
		region.banner = '/media/images/region/' + region.code + '.jpg';
	});
	return regions;
}

exports.getRegion = async (code) => {
	var region = db.tables.Region.find({code: code})[0];
	removeLokiMeta(region);
	return region;
}


exports.getZones = async () => {
	var zones = db.tables.Zone.chain().find().simplesort('id').data();
	removeLokiMetas(zones);
	return zones;
}

exports.getZone = async (code) => {
	var zone = db.tables.Zone.find({code: code})[0];
	zone.file = '/media/audio/' + zone.id + '.mp3';
	removeLokiMeta(zone);
	zone.region = db.tables.Region.find({id: zone.region})[0];
	removeLokiMeta(zone.region);
	zone.region.island = db.tables.Island.find({id: zone.region.island})[0];
	removeLokiMeta(zone.region.island);
	zone.region.part = db.tables.Part.find({id: zone.region.part})[0];
	removeLokiMeta(zone.region.part);
	zone.places = db.tables.Place.chain().find({zone: zone.id}).simplesort('id').data();
	zone.places.forEach(function(place) {
		delete place.meta;
		delete place.$loki;
	});
	return zone;
}

exports.getKinds = async () => {
	var kinds = [];
	db.tables.Place.find().forEach(function(place) {
		if ('kinds' in place) {
			place.kinds.forEach(function(kind) {
				kinds.push(kind);
			});
		}
	});
	return kinds.filter(arrayUnique).sort();
}

exports.getSuggestions = async () => {
	var suggestions = [];
	db.tables.Place.find().forEach(function(place) {
		for (name in place.names) {
			suggestions.push({name: name, type: 'Name'});
		}
		if ('kinds' in place) {
			place.kinds.forEach(function(kind) {
				suggestions.push({name: kind, type: 'Kind'});
			});
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
