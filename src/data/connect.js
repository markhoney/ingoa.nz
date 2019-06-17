const fs = require('fs');
const path = require('path');
const levenshtein = require('js-levenshtein');
const axios = require('axios');

const jsonpath = path.join(__dirname, '..', 'server', 'db', 'json');
let db;

function readData() {
	db = ['island', 'part', 'map', 'region', 'zone', 'speaker', 'group', 'feature', 'iwi', 'placename', 'meaning', 'district', 'gazetteer'].reduce((db, collection) => {
		db[collection] = require(path.join(jsonpath, collection + '.json'));
		//db[collection] = JSON.parse(fs.readFileSync(path.join(jsonpath, collection + '.json')));
		return db;
	}, {});
}

function getSpeakers(placenames) {
	const speakers = placenames.map(placename => placename.names).flat().filter(name => name.spoken).map(name => name.spoken.speaker_id);
	return db.speaker.filter(speaker => speaker.code != "hugh_young" && speakers.includes(speaker._id));
}

function linkImages() {
	[
		{name: 'island', images: ['banner.png', 'landscape.png', 'portrait.png']},
		{name: 'part', images: ['front.jpg']},
		{name: 'map', images: ['portrait.png']},
		{name: 'region', images: ['banner.jpg', 'landscape.png']},
		{name: 'zone', images: ['landscape.png']},
	].forEach(collection => {
		db[collection.name].forEach(record => {
			if (!record.images) {
				record.images = collection.images.reduce((obj, image) => {
					obj[image.split('.')[0]] = '/img/' + collection.name + '/' + record.code + '-' + image;
					return obj;
				}, {});
			}
		});
	});
}

function addPlacenameIDs() {
	db.placename.forEach(placename => {
		if (placename.places) {
			placename.places.forEach(place => {
				if (!place.zone_id) place.zone_id = placename.zone_id;
				if (!place.placename_id) place.placename_id = placename._id;
			});
		}
		placename.names.forEach(name => {
			if (!name.zone_id) name.zone_id = placename.zone_id;
			if (!name.placename_id) name.placename_id = placename._id;
		});
	});
}

function createNamesPlaces() {
	db.name = db.placename.map(placename => placename.names).flat();
	db.place = db.placename.filter(placename => placename.places).map(placename => placename.places).flat();
}

function addPrePost() {
	['island', 'part', 'zone'].forEach(collection => {
		db[collection].forEach(record => {
			const bookmarks = db.name.filter(name => name._id.startsWith('na_pn_' + record._id + '-')).filter(name => name.spoken).map(name => name.spoken).sort((a, b) => a.start - b.start);
			bookmarks.forEach((spoken, index) => {
				if (!spoken.pre) {
					spoken.pre = parseFloat((index <= 0 ? '0' : ((bookmarks[index - 1].end + spoken.start) / 2).toFixed(2)));
					spoken.post = parseFloat((index >= bookmarks.length - 1 ? '999' : ((spoken.end + bookmarks[index + 1].start) / 2).toFixed(2)));
				}
			});
		});
	});
}

function addSpeakers() {
	db.island.forEach(island => {
		if (!island.speaker_ids) {
			speakers = getSpeakers(db.placename.filter(placename => placename.island_id == island._id));
			island.speaker_ids = speakers.map(speaker => speaker._id);
		}
	});

	db.part.forEach(part => {
		if (!part.speaker_ids) {
			speakers = getSpeakers(db.placename.filter(placename => placename.part_id == part._id));
			part.speaker_ids = speakers.map(speaker => speaker._id);
		}
	});

	db.zone.forEach(zone => {
		if (!zone.speaker_ids) {
			speakers = getSpeakers(db.placename.filter(placename => placename.zone_id == zone._id));
			zone.speaker_ids = speakers.map(speaker => speaker._id);
		}
	});
}

function addSimilarIdentical() {
	db.name.forEach(name => {
		if (!name.similar_ids && name.name.mi != "Intro") {
			const identical = db.name.filter(myname => myname.name.mi == name.name.mi);
			name.identical_ids = identical.map(name => name._id);
			const similar = db.name.filter(myname => myname.name.mi != name.name.mi).sort((a, b) => levenshtein(name.name.mi, a.name.mi) - levenshtein(name.name.mi, b.name.mi)).slice(0, 8);
			name.similar_ids = similar.map(name => name._id);
		}
	});
}

function addMeanings() {
	db.name.forEach(name => {
		if (!name.meaning_id && name.name.mi) {
			const meaning = db.meaning.find(meaning => meaning.name.mi == name.name.mi || meaning.name.mi == name.name.ascii);
			if (meaning) name.meaning_id = meaning._id;
		}
	});
}

function addGazetteerLocations() {
	db.place.forEach(place => {
		if (place.zone_id && (!place.location || (place.location && !place.location.position))) {
			const zone = db.zone.find(zone => zone._id == place.zone_id);
			const district = zone.gazetteer;
			const feature = db.feature.find(feature => feature._id == place.feature_id);
			const foundplace =
				   db.gazetteer.find(gazetteer => gazetteer.district == district && gazetteer.feature == feature.category.gazetteer && (gazetteer.name == place.name.mi || gazetteer.name == place.name.ascii || gazetteer.name == place.name.en))
				|| db.gazetteer.find(gazetteer => gazetteer.district == district && gazetteer.feature == feature.category.gazetteer && (gazetteer.name == [place.name.mi, feature.name.en].join(' ') || gazetteer.name == [place.name.ascii, feature.name.en].join(' ') || gazetteer.name == [place.name.en, feature.name.en].join(' ')))
				|| db.gazetteer.find(gazetteer => gazetteer.district == district && (gazetteer.name == place.name.mi || gazetteer.name == place.name.ascii || gazetteer.name == place.name.en))
				|| db.gazetteer.find(gazetteer => gazetteer.district == district && (gazetteer.name == [place.name.mi, feature.name.en].join(' ') || gazetteer.name == [place.name.ascii, feature.name.en].join(' ') || gazetteer.name == [place.name.en, feature.name.en].join(' ')))
			;
			if (foundplace) {
					//console.log(placename, "==", foundplace.display_name.split(",")[0]);
					place.location = place.location || {};
				place.location.position = foundplace.position;
			}
		}
	});
}

async function addNominatimLocations() {
	const nominatim = axios.create({baseURL: "http://localhost:8080/search/"});
	//db.place.forEach(async place => {
	for (const place of db.place) {
		if (place.zone_id && (!place.location || (place.location && !place.location.position))) {
			const zone = db.zone.find(zone => zone._id == place.zone_id);
			const district = db.district.find(district => district._id == zone.district_id);
			const placename = (place.name.en || place.name.mi) + (district ? ', ' + district.name.en : "");
			const feature = db.feature.find(feature => feature._id == place.feature_id);
			const url = encodeURI(placename + '?extratags=1&format=json'); //&limit=1
			//console.log(url);
			let geo = {};
			try {
				geo = await nominatim.get(url);
			} catch(error) {
				//console.log(error);
			}
			if (geo.data && geo.data.length) {
				let foundplace = geo.data.find(placename => placename.class == feature.category.osm.class && placename.type == feature.category.osm.type);
				if (!foundplace) {
					foundplace = geo.data.find(placename => placename.display_name.split(",")[0] == place.name.en || placename.display_name.split(",")[0] == place.name.ascii);
				}
				if (!foundplace) {
					foundplace = geo.data.find(placename => placename.class == feature.category.osm.class);
				}
				if (foundplace) {
					//console.log(placename, "==", foundplace.display_name.split(",")[0]);
					//console.log(foundplace);
					place.location = place.location || {};
					place.location.position = {
						lat: foundplace.lat,
						lng: foundplace.lon,
					};
				} else {
					//console.log(placename);
				}
			}
		}
	}
}

function deleteNamesPlaces() {
	delete db.name;
	delete db.place;
}

function writeData() {
	for (const collection in db) {
		fs.writeFileSync(path.join(jsonpath, collection + '.json'), JSON.stringify(db[collection]).replace(/^\[{/, "[\n\t{").replace(/}\]$/, "}\n]").replace(/},{/g, "},\n\t{"));
	}	
}

async function runAll() {
	console.log("Reading Data...");
	readData();
	console.log("Adding Image Links...");
	linkImages();
	console.log("Adding Placename IDs...");
	addPlacenameIDs();
	console.log("Creating Names & Places Arrays...");
	createNamesPlaces();
	console.log("Adding Pre and Post Times to Spoken Names...");
	addPrePost();
	console.log("Adding Speakers to Zones, Parts & Islands...");
	addSpeakers();
	console.log("Adding Similar & Identical Names...");
	addSimilarIdentical();
	console.log("Adding Name Meanings...");
	addMeanings();
	console.log("Adding Location Coordinates from Nominatim...");
	await addNominatimLocations();
	console.log("Adding Location Coordinates from the Gazetteer...");
	addGazetteerLocations();
	console.log("Deleting Names & Places...");
	deleteNamesPlaces();
	console.log("Writing Data...");
	writeData();
}

runAll();