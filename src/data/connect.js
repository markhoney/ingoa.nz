//var googleMapsClient = require('@google/maps').createClient({key: ''});
const utils = require('./utils.js');
const db = require('./nedb')(true);
/*const geocoder = require('node-geocoder')({
	provider: 'openstreetmap',
	email: 'mark@honeychurch.org'
});*/

async function connect() {
	[
		{name: 'island', images: ['banner.png', 'landscape.png', 'portrait.png']},
		{name: 'part', codes: ['island'], images: ['front.jpg']},
		{name: 'map', codes: ['island', 'part'], images: ['portrait.png']},
		{name: 'region', codes: ['island', 'part', 'map'], images: ['banner.jpg', 'landscape.png']},
		{name: 'zone', codes: ['region', 'part', 'island'], images: ['landscape.png']},
		{name: 'placename', codes: ['zone', 'part', 'island']},
	].forEach(collection => {
		db[collection.name].asyncFind({}).forEach(record => {
			if (collection.codes) {
				collection.codes.forEach(code => {
					if (record[code + '_id']) record[code + '_code'] = db[code].asyncFindOne({_id: record[code + '_id']}).code;
				});
			}
			if (collection.images) {
				record.images = collection.images.reduce((obj, image) => {
					obj[image.split('.')[0]] = '/img/' + collection.name + '/' + record.code + '-' + image;
					return obj;
				}, {});
			}
			db[collection.name].update({_id: record._id}, record);
		});
	});

	db.placename.asyncFind({}).forEach(placename => {
		if (placename.see) {
			placename.see.forEach(see => {
				see.placename_code = db.placename.asyncFindOne({_id: see.placename_id}).code;
			});
		}
		if (placename.places) {
			placename.places.forEach(place => {
				place.zone_id = placename.zone_id;
			});
		}
		placename.names.forEach(name => {
			name.zone_id = placename.zone_id;
		});
		placename.names.forEach(name => {
			if (name.spoken) {
				name.spoken.speaker_code = db.speaker.asyncFindOne({_id: name.spoken.speaker_id}).code;
			}
		});
		placename.places.forEach(place => {
			if (place.feature_id) {
				place.feature_code = db.feature.asyncFindOne({_id: place.feature_id}).code;
			}
			if (place.groups) {
				place.groups.forEach(group => {
					group.group_code = db.group.asyncFindOne({_id: group.group_id}).code;
				});
			}
			if (place.zone_id) {
				const zone = db.zone.asyncFindOne({_id: place.zone_id});
				const feature = db.feature.asyncFindOne({_id: place.feature_id});
				const gazetteer = db.gazetteer.asyncFindOne({district: zone.gazetteer, feature: feature.gazetteer, name: place.name.mi || place.name.en});
				place.location = place.location || {};
				place.location.position = gazetteer.position;
			}
			db.placename.update({_id: placename._id}, placename);
		});
	});

	['island', 'part', 'zone'].forEach(collection => {
		db[collection].asyncFind({}).forEach(record => {
			const placenames = db.placename.asyncFind({_id: record[collection + '_id']});
			const bookmarks = placenames.map(placename => placename.names).flat().filter(name => name.spoken).map(name => name.spoken).sort((a, b) => a.start - b.start);
			bookmarks.forEach((spoken, index) => {
				spoken.pre = parseFloat((index <= 0 ? '0' : ((bookmarks[index - 1].end + spoken.start) / 2).toFixed(2)));
				spoken.post = parseFloat((index >= bookmarks.length - 1 ? '999' : ((spoken.end + bookmarks[index + 1].start) / 2).toFixed(2)));
			});
			placenames.forEach(placename => {
				db.placename.update({_id: placename._id}, placename);
			});
		});
	});
}

connect();