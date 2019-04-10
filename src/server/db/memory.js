//const fs = require('fs');
const levenshtein = require('js-levenshtein');

const db = ['island', 'part', 'map', 'region', 'zone', 'speaker', 'group', 'feature', 'iwi', 'placename', 'meaning', 'gazetteer'].reduce((db, collection) => {
	db[collection] = require('./json/' + collection + '.json');
	//db[collection] = JSON.parse(fs.readFileSync('apollo-server/db/json/' + collection + '.json'));
	return db;
}, {});

[
	{name: 'island', images: ['banner.png', 'landscape.png', 'portrait.png']},
	{name: 'part', codes: ['island'], images: ['front.jpg']},
	{name: 'map', codes: ['island', 'part'], images: ['portrait.png']},
	{name: 'region', codes: ['island', 'part', 'map'], images: ['banner.jpg', 'landscape.png']},
	{name: 'zone', codes: ['region', 'part', 'island'], images: ['landscape.png']},
	{name: 'placename', codes: ['zone', 'part', 'island']},
].forEach(collection => {
	db[collection.name].forEach(record => {
		if (collection.codes) {
			collection.codes.forEach(code => {
				if (record[code + '_id']) record[code + '_code'] = db[code].find(myrecord => myrecord._id == record[code + '_id']).code;
			});
		}
		if (collection.images) {
			record.images = collection.images.reduce((obj, image) => {
				obj[image.split('.')[0]] = '/img/' + collection.name + '/' + record.code + '-' + image;
				return obj;
			}, {});
		}
	});
});

db.placename.forEach(placename => {
	if (placename.see) {
		placename.see.forEach(see => {
			see.placename_code = db.placename.find(myplacename => myplacename._id == see.placename_id).code;
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
});

db.name = db.placename.map(placename => placename.names).flat();
db.place = db.placename.filter(placename => placename.places).map(placename => placename.places).flat();

['island', 'part', 'zone'].forEach(collection => {
	db[collection].forEach(record => {
		const bookmarks = db.name.filter(name => name._id.startsWith('na_pn_' + record._id + '-')).filter(name => name.spoken).map(name => name.spoken).sort((a, b) => a.start - b.start);
		bookmarks.forEach((spoken, index) => {
			spoken.pre = parseFloat((index <= 0 ? '0' : ((bookmarks[index - 1].end + spoken.start) / 2).toFixed(2)));
			spoken.post = parseFloat((index >= bookmarks.length - 1 ? '999' : ((spoken.end + bookmarks[index + 1].start) / 2).toFixed(2)));
		});
	});
});

db.name.forEach(name => {
	if (name.spoken) {
		name.spoken.speaker_code = db.speaker.find(speaker => speaker._id == name.spoken.speaker_id).code;
	}
});

db.place.forEach(place => {
	if (place.feature_id) {
		place.feature_code = db.feature.find(feature => feature._id == place.feature_id).code;
	}
	if (place.groups) {
		place.groups.forEach(group => {
			group.group_code = db.group.find(mygroup => mygroup._id == group.group_id).code;
		});
	}
	if (place.zone_id) {
		const district = db.zone.find(zone => zone._id == place.zone_id).gazetteer;
		const feature = db.feature.find(feature => feature._id == place.feature_id).gazetteer;
		const gazetteer = db.gazetteer.find(gazetteer => gazetteer.district == district && gazetteer.feature == feature && gazetteer.name == place.name.en);
		if (gazetteer) {
			place.location = place.location || {};
			place.location.position = gazetteer.position;
		}
	}
});

//delete db.gazetteer;

module.exports = db;
