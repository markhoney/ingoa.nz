const fs = require('fs');
const path = require('path');
const levenshtein = require('js-levenshtein');
const axios = require('axios');
const utils = require('../server/db/utils');

const jsonpath = path.join(__dirname, '..', 'server', 'db', 'json');

let db;
function readData() {
	db = ['island', 'part', 'map', 'region', 'zone', 'speaker', 'group', 'feature', 'iwi', 'placename', 'meaning', 'district', 'gazetteer', 'overseas'].reduce((db, collection) => {
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
				//if (!place.zone_id) place.zone_id = placename.zone_id;
				if (!place.placename_id) place.placename_id = placename._id;
			});
		}
		placename.names.forEach(name => {
			//if (!name.zone_id) name.zone_id = placename.zone_id;
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
		if (!name.similar_ids && name.title.mi != "Intro") {
			const identical = db.name.filter(myname => myname.title.mi == name.title.mi);
			name.identical_ids = identical.map(name => name._id);
			const similar = db.name.filter(myname => myname.title.mi != name.title.mi).sort((a, b) => levenshtein(name.title.mi, a.title.mi) - levenshtein(name.title.mi, b.title.mi)).slice(0, 8);
			name.similar_ids = similar.map(name => name._id);
		}
	});
}

function addMeanings() {
	db.name.forEach(name => {
		if (!name.meaning_id && name.title.mi) {
			const meaning = db.meaning.find(meaning => meaning.title.mi == name.title.mi || meaning.title.mi == name.title.ascii || meaning.title.mi == name.title.double);
			if (meaning) name.meaning_id = meaning._id;
		}
	});
}

async function addNominatimLocations() {
	let total = 0;
	const nominatim = axios.create({baseURL: "http://localhost:8080/search/"});
	for (const placename of db.placename) {
		if (placename.zone_id && placename.places) {
			let zone = db.zone.find(zone => zone._id == placename.zone_id);
			if (placename.addendum_ids) zone = db.zone.find(zone => zone._id == placename.addendum_ids[0]); // If this is an addendum to another zone, use that zone
			const district = db.district.find(district => district._id == zone.district_id);
			if (district) {
				for (const place of placename.places) {
					if (!place.location || (place.location && !place.location.position)) {
						const placename = place.title.en || place.title.mi;
						const feature = db.feature.find(feature => feature._id == place.feature_id);
						const url = encodeURI(placename + '?addressdetails=1&extratags=1&format=json'); //&limit=1
						let geo = {};
						try {
							geo = await nominatim.get(url);
						} catch(error) {
							//console.log(error);
						}
						if (geo.data && geo.data.length) {
							let placenames = geo.data.filter(placename => placename.address.region == district.title.en || placename.address.county == district.title.en);
							if (placenames.length) {
								placenames.forEach(placename => {
									placename.score = 0;
									if (placename.class == feature.category.osm.class) {
										placename.score += 1;
										if (placename.type == feature.category.osm.type) placename.score += 1;
									}
									if (placename.class == "landuse" && placename.type == feature.category.osm.landuse) placename.score += 2;
									const name = utils.simplify(placename.display_name.split(",")[0]);
									if (name == utils.simplify(place.title.en)) placename.score += 1;
									if (name == utils.simplify(place.title.en + feature.title.en)) placename.score += 1;
								});
								placenames = placenames.sort((a, b) => a.score > b.score);
								const foundplace = placenames[0];
								//console.log(placename, "==", name);
								place.location = place.location || {};
								place.location.source = "nominatim";
								place.location.position = {
									lat: foundplace.lat,
									lng: foundplace.lon,
								};
								place.links = {
									wikipedia: (foundplace.extratags.wikipedia ? "https://en.wikipedia.org/wiki/" + foundplace.extratags.wikipedia.split(":")[1] : null),
									wikidata: (foundplace.extratags.wikidata ? "https://www.wikidata.org/wiki/" + foundplace.extratags.wikidata : null),
									website: foundplace.extratags.website,
								};
								total += 1;
							}
						}
					}
				}
			}
		}
	}
	console.log(total);
}

function addGazetteerLocations() {
	let total = 0;
	db.gazetteer.forEach(gazetteer => {
		gazetteer.simple = utils.simplify(gazetteer.title);
	});
	db.placename.forEach(placename => {
		if (placename.zone_id && placename.places) {
			let zone = db.zone.find(zone => zone._id == placename.zone_id);
			if (placename.addendum_ids) zone = db.zone.find(zone => zone._id == placename.addendum_ids[0]); // If this is an addendum to another zone, use that zone
			const district = zone.gazetteer;
			placename.places.forEach(place => {
				if (!place.location || (place.location && !place.location.position)) {
					const feature = db.feature.find(feature => feature._id == place.feature_id);
					const names = [utils.simplify(place.title.mi), utils.simplify(place.title.ascii), utils.simplify(place.title.double), utils.simplify([place.title.mi, feature.title.en].join(' ')), utils.simplify([place.title.ascii, feature.title.en].join(' ')), utils.simplify([place.title.double, feature.title.en].join(' '))];
					let placenames = db.gazetteer.filter(gazetteer => gazetteer.district == district && names.includes(gazetteer.simple));
					if (placenames.length) {
						placenames.forEach(placename => {
							placename.score = 0;
							if (placename.feature == feature.category.gazetteer) placename.score += 1;
						});
						placenames = placenames.sort((a, b) => a.score > b.score);
						const foundplace = placenames[0];
						//console.log(placename, "==", foundplace.display_name.split(",")[0]);
						place.location = place.location || {};
						place.location.source = "gazetteer";
						place.location.position = foundplace.position;
						total += 1;
					}
				}
			});
		}
	});
	console.log(total);
	delete db.gazetteer;
}

function deleteNamesPlaces() {
	delete db.name;
	delete db.place;
}

function writeData() {
	for (const collection in db) {
		fs.writeFileSync(path.join(jsonpath, collection + '.json'), JSON.stringify(utils.cleanobj(db[collection])).replace(/^\[{/, "[\n\t{").replace(/}\]$/, "}\n]").replace(/},{/g, "},\n\t{"));
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
