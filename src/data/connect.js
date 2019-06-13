const fs = require('fs');
const path = require('path');
const levenshtein = require('js-levenshtein');
const utils = require('./utils');

const jsonpath = path.join(__dirname, '..', 'server', 'db', 'json');

const db = ['island', 'part', 'map', 'region', 'zone', 'speaker', 'group', 'feature', 'iwi', 'placename', 'meaning', 'gazetteer'].reduce((db, collection) => {
	db[collection] = require(path.join(jsonpath, collection + '.json'));
	//db[collection] = JSON.parse(fs.readFileSync(path.join(jsonpath, collection + '.json')));
	return db;
}, {});

function getSpeakers(placenames) {
	const speakers = placenames.map(placename => placename.names).flat().filter(name => name.spoken).map(name => name.spoken.speaker_id);
	return db.speaker.filter(speaker => speaker.code != "hugh_young" && speakers.includes(speaker._id));
}

[
	{name: 'island', images: ['banner.png', 'landscape.png', 'portrait.png']},
	{name: 'part', codes: ['island'], images: ['front.jpg']},
	{name: 'map', codes: ['island', 'part'], images: ['portrait.png']},
	{name: 'region', codes: ['island', 'part', 'map'], images: ['banner.jpg', 'landscape.png']},
	{name: 'zone', codes: ['region', 'part', 'island'], images: ['landscape.png']},
	{name: 'placename', codes: ['zone', 'part', 'island']},
	{name: 'group', codes: ['zone']},
].forEach(collection => {
	db[collection.name].forEach(record => {
		if (collection.codes) {
			collection.codes.forEach(code => {
				if (record[code + '_id'] && record[code + '_id'] != "zo_0") record[code + '_code'] = db[code].find(myrecord => myrecord._id == record[code + '_id']).code;
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
	/*if (placename.see) {
		placename.see.forEach(see => {
			see.placename_code = db.placename.find(myplacename => myplacename._id == see.placename_id).code;
		});
	}*/
	if (placename.places) {
		placename.places.forEach(place => {
			place.zone_id = placename.zone_id;
			//place.zone_code = placename.zone_code;
		});
	}
	placename.names.forEach(name => {
		name.zone_id = placename.zone_id;
		//name.zone_code = placename.zone_code;
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

db.island.forEach(island => {
	speakers = getSpeakers(db.placename.filter(placename => placename.island_id == island._id));
	island.speaker_ids = speakers.map(speaker => speaker._id);
	//island.speaker_codes = speakers.map(speaker => speaker.code);
});

db.part.forEach(part => {
	speakers = getSpeakers(db.placename.filter(placename => placename.part_id == part._id));
	part.speaker_ids = speakers.map(speaker => speaker._id);
	//part.speaker_codes = speakers.map(speaker => speaker.code);
});

db.zone.forEach(zone => {
	speakers = getSpeakers(db.placename.filter(placename => placename.zone_id == zone._id));
	zone.speaker_ids = speakers.map(speaker => speaker._id);
	//zone.speaker_codes = speakers.map(speaker => speaker.code);
});

/*
db.name.forEach(name => {
	//name.code = [name.zone_code, utils.createCode(name.name.mi)].join('/');
	name.code = utils.createCode(name.name.mi);
});

db.place.forEach(place => {
	//place.code = [place.zone_code, utils.createCode(place.name.en || place.name.mi)].join('/');
	place.code = utils.createCode(place.name.en || place.name.mi);
});
*/

db.name.forEach(name => {
	/*if (name.spoken) {
		name.spoken.speaker_code = db.speaker.find(speaker => speaker._id == name.spoken.speaker_id).code;
	}*/
	if (name.name.mi != "Intro") {
		const identical = db.name.filter(myname => myname.name.mi == name.name.mi);
		name.identical_ids = identical.map(name => name._id);
		//name.identical_codes = identical.map(name => name.code);
		const similar = db.name.filter(myname => myname.name.mi != name.name.mi).sort((a, b) => levenshtein(name.name.mi, a.name.mi) - levenshtein(name.name.mi, b.name.mi)).slice(0, 8);
		name.similar_ids = similar.map(name => name._id);
		//name.similar_codes = similar.map(name => name.code);
	}
});

db.place.forEach(place => {
	/*if (place.feature_id) {
		place.feature_code = db.feature.find(feature => feature._id == place.feature_id).code;
	}*/
	/*if (place.groups) {
		place.groups.forEach(group => {
			group.group_code = db.group.find(mygroup => mygroup._id == group.group_id).code;
		});
	}*/
	if (place.zone_id) {
		const district = db.zone.find(zone => zone._id == place.zone_id).gazetteer;
		const feature = db.feature.find(feature => feature._id == place.feature_id);
		const gazetteer =
			db.gazetteer.find(gazetteer => gazetteer.district == district && gazetteer.feature == feature.gazetteer && (gazetteer.name == place.name.mi || gazetteer.name == place.name.ascii || gazetteer.name == place.name.en)) ||
			db.gazetteer.find(gazetteer => gazetteer.district == district && gazetteer.feature == feature.gazetteer && (gazetteer.name == [place.name.mi, feature.name.en].join(' ') || gazetteer.name == [place.name.ascii, feature.name.en].join(' ') || gazetteer.name == [place.name.en, feature.name.en].join(' '))) ||
			db.gazetteer.find(gazetteer => gazetteer.district == district && (gazetteer.name == [place.name.mi, feature.name.en].join(' ') || gazetteer.name == [place.name.ascii, feature.name.en].join(' ') || gazetteer.name == [place.name.en, feature.name.en].join(' '))) ||
			db.gazetteer.find(gazetteer => gazetteer.district == district && (gazetteer.name == place.name.mi || gazetteer.name == place.name.ascii || gazetteer.name == place.name.en));
		if (gazetteer) {
			place.location = place.location || {};
			place.location.position = gazetteer.position;
		}
	}
});

delete db.name;
delete db.place;

for (const collection in db) {
	fs.writeFileSync(path.join(jsonpath, collection + '.json'), JSON.stringify(db[collection]).replace(/^\[{/, "[\n\t{").replace(/}\]$/, "}\n]").replace(/},{/g, "},\n\t{"));
}
