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
	var copy = Object.assign({}, obj);
	delete copy.meta;
	delete copy.$loki;
	return copy;
}

function removeLokiMetas(objs) {
	var copy = Object.assign({}, objs);
	copy.forEach(function(obj) {
		obj = removeLokiMeta(obj);
	});
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
	speaker.images = {
		portrait: '/media/images/speaker/' + speaker.code + '-portrait.jpg'
	};
	return speaker;
}

function getSpeakers() {
	var speakers = db.tables.Speaker.chain().find().simplesort('id').data();
	speakers.forEach(function(speaker) {
		speaker = fixSpeaker(speaker);
	});
	return speakers;
}

function getSpeaker(id) {
	return fixSpeaker(db.tables.Speaker.find({id: id})[0]);
}

function fixIsland(obj) {
	var island = removeLokiMeta(obj);
	island.images = {
		landscape: '/media/images/island/' + island.code + '-landscape.png',
		banner: '/media/images/island/' + island.code + '-banner.jpg'
	};
	return island;
}

function getIslands() {
	var islands = db.tables.Island.chain().find().simplesort('id').data();
	for (island in islands) {
		islands[island] = fixIsland(islands[island]);
	}
	return islands;
}

function getIsland(id) {
	return fixIsland(db.tables.Island.find({id: id})[0]);
}

function fixPart(obj) {
	var part = removeLokiMeta(obj);
	part.images = {
		front: '/media/images/part/' + part.code + '-front.png'
	};
	return part;
}

function getParts() {
	var parts = db.tables.Part.chain().find().simplesort('id').data();
	for (part in parts) {
		parts[part] = fixPart(parts[part]);
	}
	return parts;
}

function getPart(id) {
	return fixPart(db.tables.Part.find({id: id})[0]);
}

function fixRegion(obj) {
	var region = removeLokiMeta(obj);
	region.images = {
		landscape: '/media/images/region/' + region.code + '.png',
		banner: '/media/images/region/' + region.code + '.jpg'
	}
	return region;
}

function getRegions(filter) {
	var regions = db.tables.Region.chain().find(filter).simplesort('id').data();
	for (region in regions) {
		regions[region] = fixRegion(regions[region]);
	}
	return regions;
}

function getRegion(id) {
	var region = fixRegion(db.tables.Region.find({id: id})[0]);
	region.island = getIsland({id: region.island});
	region.part = getPart({id: region.part});
	return region;
}

function fixZone(obj) {
	var zone = removeLokiMeta(obj);
	zone.images = {
		landscape: '/media/images/island/' + zone.code + '-landscape.png',
		banner: '/media/images/island/' + zone.code + '-banner.jpg'
	};
	zone.audio = '/media/audio/' + zone.id + '.mp3';
	return zone;
}

function getZones(filter) {
	var zones = db.tables.Zone.chain().find(filter).simplesort('id').data();
	for (zone in zones) {
		zones[zone] = fixZone(zones[zone]);
	}
	return zones;
}

function getZone(id) {
	var zone = fixZone(db.tables.Zone.find({id: id})[0]);
	zone.region = getRegion({id: zone.region});
	zone.region.island = getIsland({id: zone.region.island});
	zone.region.part = getPart({id: zone.region.part});
	return zone;
}

exports.getSpeakers = async () => {
	return getSpeakers();
}

exports.getSpeaker = async (code) => {
	return getSpeaker({code: code});
}

exports.getIslands = async () => {
	return getIslands();
}

exports.getIsland = async (code) => {
	return getIsland({code: code});
}

exports.getParts = async () => {
	return getParts();
}

exports.getPart = async (code) => {
	return getPart({code: code});
}

exports.getRegions = async () => {
	return getRegions();
}

exports.getRegion = async (code) => {
	return getRegion({code: code});
}
exports.getZones = async () => {
	return getZones();
}

exports.getZone = async (code) => {
	return getZone({code: code});
}

exports.getIslandsRegions = async () => {
	var islands = getIslands();
	for (island in islands) {
		islands[island].regions = getRegions({island: islands[island].id});
	}
	return islands;
}

exports.getIslandRegions = async (code) => {
	var island = getIsland({code: code});
	island.regions = getRegions({island: island.id});
	return island;
}

exports.getIslandRegionsZones = async (code) => {
	var island = getIsland({code: code});
	island.regions = getRegions({island: island.id});
	for (region in island.regions) {
		island.regions[region].zones = getZones({region: island.regions[region].id});
	}
	return island;
}

exports.getIslandsRegionsZones = async () => {
	var islands = getIslands();
	islands.forEach(function(island) {
		island.regions = getRegions({island: island.id});
		island.regions.forEach(function(region) {
			region.zones = getZones({region: region.id});
		});
	});
	return islands;
}

exports.getRegionsZones = async () => {
	var regions = getRegions();
	regions.forEach(function(region) {
		region.zones = getZones({region: region.id});
	});
	return regions;
}

exports.getRegionZones = async (code) => {
	var region = getRegion({code: code});
	region.zones = getZones({region: region.id});
	return regions;
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

exports.getKind = async () => {

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
