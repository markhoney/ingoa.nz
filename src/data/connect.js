const {existsSync, statSync, readFileSync, writeFileSync} = require('fs'); // readFileSync
const path = require('path');
const levenshtein = require('js-levenshtein');
const axios = require('axios');
const cheerio = require('cheerio');
const utils = require('../server/db/utils');

const jsonpath = path.join(__dirname, '..', 'server', 'db', 'json');

let db;
function readData() {
	db = ['islands', 'parts', 'maps', 'regions', 'sectors', 'districts', 'zones', 'speakers', 'groups', 'features', 'iwi', 'placenames', 'meanings', 'gazetteer', 'overseas'].reduce((db, collection) => {
		db[collection] = require(path.join(jsonpath, collection + '.json'));
		//db[collection] = JSON.parse(readFileSync(path.join(jsonpath, collection + '.json')));
		return db;
	}, {});
}

function getSpeakers(placenames) {
	const speakers = placenames.map(placename => placename.names).flat().filter(name => name.spoken).map(name => name.spoken.speaker_id);
	return db.speakers.filter(speaker => speaker.id !== "sp_37" && speakers.includes(speaker.id));
}

function linkImages() {
	let total = 0;
	[
		{name: 'islands', images: ['banner.png', 'landscape.png', 'portrait.png']},
		{name: 'parts', images: ['front.jpg']},
		{name: 'maps', images: ['portrait.png']},
		//{name: 'regions', images: ['banner.jpg', 'landscape.png']},
		{name: 'sectors', images: ['banner.jpg', 'landscape.png']},
		//{name: 'districts', images: ['banner.jpg', 'landscape.png']},
		{name: 'zones', images: ['landscape.png']},
	].forEach(collection => {
		db[collection.name].forEach(record => {
			if (!record.images) {
				/*record.images = collection.images.reduce((obj, image) => {
					obj[image.split('.')[0]] = '/img/' + collection.name + '/' + record.slug.en + '-' + image;
					return obj;
				}, {});*/
				record.images = {};
				collection.images.forEach(image => {
					const imagepath = ['img', collection.name, record.slug.en + '-' + image];
					if (existsSync(path.join(__dirname, '..', 'client', 'assets', ...imagepath))) {
						total++;
						record.images[image.split('.')[0]] = '/' + imagepath.join("/");
					}
				});
			}
		});
	});
	console.log(total);
}

function addPlacenameIDs() {
	let total = 0;
	db.placenames.forEach(placename => {
		if (placename.places) {
			placename.places.forEach(place => {
				//if (!place.zone_id) place.zone_id = placename.zone_id;
				if (!place.placename_id) {
					total++;
					place.placename_id = placename.id;
				}
			});
		}
		placename.names.forEach(name => {
			//if (!name.zone_id) name.zone_id = placename.zone_id;
			if (!name.placename_id) {
				total++;
				name.placename_id = placename.id;
			}
		});
	});
	console.log(total);
}

function createNamesPlaces() {
	db.names = db.placenames.map(placename => placename.names).flat();
	db.places = db.placenames.filter(placename => placename.places).map(placename => placename.places).flat();
}

function addPrePost() {
	let total = 0;
	['islands', 'parts', 'zones'].forEach(collection => {
		db[collection].forEach(record => {
			const bookmarks = db.names.filter(name => name.id.startsWith('na_pn_' + record.id + '-')).filter(name => name.spoken).sort((a, b) => a.spoken.start - b.spoken.start);
			bookmarks.forEach((name, index) => {
				if (!name.spoken.pre) {
					total++;
					name.spoken.pre = parseFloat((index <= 0 ? '0' : ((bookmarks[index - 1].spoken.end + name.spoken.start) / 2).toFixed(2)));
					name.spoken.post = parseFloat((index >= bookmarks.length - 1 ? '999' : ((name.spoken.end + bookmarks[index + 1].spoken.start) / 2).toFixed(2)));
				}
			});
		});
	});
	console.log(total);
}

function addSpeakers() {
	let total = 0;
	db.islands.forEach(island => {
		if (!island.speaker_ids) {
			total++;
			speakers = getSpeakers(db.placenames.filter(placename => placename.island_id === island.id));
			island.speaker_ids = speakers.map(speaker => speaker.id);
		}
	});
	console.log(total);
	total = 0;
	db.parts.forEach(part => {
		if (!part.speaker_ids) {
			total++;
			speakers = getSpeakers(db.placenames.filter(placename => placename.part_id === part.id));
			part.speaker_ids = speakers.map(speaker => speaker.id);
		}
	});
	console.log(total);
	total = 0;
	db.zones.forEach(zone => {
		if (!zone.speaker_ids) {
			total++;
			speakers = getSpeakers(db.placenames.filter(placename => placename.zone_id === zone.id));
			zone.speaker_ids = speakers.map(speaker => speaker.id);
		}
	});
	console.log(total);
}

function addPlacenameAudio() {
	let total = 0;
	db.names.forEach(name => {
		if (name.spoken) {
			total++;
			audioLocation = '/audio/placename/' + name.id + '.mp3';
			name.spoken.audio = {
				file: audioLocation,
				size: statSync('src/client/static' + audioLocation).size,
				length: ((name.spoken.end + 0.1) - Math.max(0, name.spoken.start - 0.1)).toFixed(2),
			};
		}
	});
	console.log(total);
}

function addSimilarIdentical() {
	let total = 0;
	const similarspath = path.join(__dirname, '..', '..', 'cache', 'similar.json');
	let similars = {};
	if (existsSync(similarspath)) {
		similars = require(similarspath);
	}
	//db.names.forEach(name => {
	for (const name of db.names) {
		if (!name.similar_ids && name.locale.mi !== "Intro") {
			const identical = db.names.filter(myname => myname.locale.mi === name.locale.mi);
			name.identical_ids = identical.map(name => name.id);
			//const similar = similars.find(similar => similar.id === name.id);
			if (similars[name.id]) {
				total++;
				name.similar_ids = similars[name.id];
			} else {
				total++;
				const similar = db.names.filter(myname => myname.locale.mi !== name.locale.mi).sort((a, b) => levenshtein(name.locale.mi, a.name.locale.mi) - levenshtein(name.locale.mi, b.name.locale.mi)).slice(0, 8);
				name.similar_ids = similar.map(name => name.id);
				similars[name.id] = name.similar_ids;
			}
		}
	}//);
	writeFileSync(similarspath, JSON.stringify(similars, null, '\t'));
	console.log(total);
}

function addMeanings() {
	let total = 0;
	db.names.forEach(name => {
		if (!name.meaning_id && name.locale.mi) {
			const meaning = db.meanings.find(meaning => meaning.name.locale.mi === name.locale.mi || (name.alt && name.alt.mi && meaning.name.locale.mi === name.alt.mi.ascii) || (name.alt && name.alt.mi && meaning.name.locale.mi === name.alt.mi.double));
			if (meaning) {
				name.meaning_id = meaning.id;
				total++;
			}
		}
	});
	console.log(total);
}

async function addNominatimLocations() {
	let total = 0;
	const nominatim = axios.create({baseURL: "http://localhost:8080/search/"});
	for (const placename of db.placenames) {
		if (placename.zone_id && placename.places) {
			let zone = db.zones.find(zone => zone.id === placename.zone_id);
			if (placename.addendum_ids) zone = db.zones.find(zone => zone.id === placename.addendum_ids[0]); // If this is an addendum to another zone, use that zone
			const district = db.districts.find(district => district.id === zone.district_id);
			if (district) {
				const region = db.regions.find(region => region.id === district.region_id);
				for (const place of placename.places) {
					if (!place.location || (place.location && !place.location.position)) {
						const placename = (place.name.alt && place.name.alt.mi ? place.name.alt.mi.ascii : null) || place.name.locale.en || place.name.locale.mi;
						const url = encodeURI(placename + '?addressdetails=1&extratags=1&format=json'); //&limit=1
						let geo = [];
						const cachepath = path.join(__dirname, '..', '..', 'cache', 'nominatim', placename + '.json');
						if (existsSync(cachepath)) {
							geo = require(cachepath);
						} else {
							try {
								geo = (await nominatim.get(url)).data;
								if (geo.length) {
									writeFileSync(cachepath, JSON.stringify(geo, null, '\t'));
								}
							} catch(error) {
								//console.log(error);
							}
						}
						if (geo && geo.length) {
							const regions = [district.name.alt.en.full, district.name.locale.en, district.name.locale.en + " District", district.name.locale.mi, district.name.locale.mi + " District"];
							if (region) regions.push(region.name.locale.en, region.name.locale.mi);
							let placenames = geo.filter(placename => regions.filter(Boolean).some(region => [placename.address.region, placename.address.county, placename.address.state].includes(region)));
							if (placenames.length) {
								const feature = db.features.find(feature => feature.id === place.feature_id);
								placenames.forEach(placename => {
									placename.score = 0;
									if (placename.class === feature.category.osm.class) {
										placename.score++;
										if (placename.type === feature.category.osm.type) placename.score++;
									}
									if (placename.class === "landuse" && placename.type === feature.category.osm.landuse) placename.score += 2;
									const name = utils.simplify(placename.display_name.split(",")[0]);
									if (name === utils.simplify(place.name.locale.en)) placename.score += 1;
									if (name === utils.simplify(place.name.locale.en + feature.name.locale.en)) placename.score++;
									if (name === utils.simplify(place.name.locale.en + feature.name.locale.mi)) placename.score++;
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
								total++;
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
		gazetteer.simple = utils.simplify(gazetteer.name.en);
	});
	db.placenames.forEach(placename => {
		if (placename.zone_id && placename.places) {
			let zone = db.zones.find(zone => zone.id === placename.zone_id);
			if (placename.addendum_ids) zone = db.zones.find(zone => zone.id === placename.addendum_ids[0]); // If this is an addendum to another zone, use that zone
			const district = zone.gazetteer;
			placename.places.forEach(place => {
				if (!place.location || (place.location && !place.location.position)) {
					const feature = db.features.find(feature => feature.id === place.feature_id);
					const names = [utils.simplify(place.name.locale.mi), utils.simplify(place.name.locale.ascii), utils.simplify(place.name.locale.double), utils.simplify([place.name.locale.mi, feature.name.locale.en].join(' ')), utils.simplify([place.name.locale.ascii, feature.name.locale.en].join(' ')), utils.simplify([place.name.locale.double, feature.name.locale.en].join(' '))];
					let placenames = db.gazetteer.filter(gazetteer => gazetteer.district === district && names.includes(gazetteer.simple));
					if (placenames.length) {
						placenames.forEach(placename => {
							placename.score = 0;
							if (placename.feature === feature.category.gazetteer) placename.score++;
						});
						placenames = placenames.sort((a, b) => a.score > b.score);
						const foundplace = placenames[0];
						//console.log(placename, "==", foundplace.display_name.split(",")[0]);
						place.location = place.location || {};
						place.location.source = "gazetteer";
						place.location.position = foundplace.position;
						total++;
					}
				}
			});
		}
	});
	console.log(total);
	delete db.gazetteer;
}

async function getWikiDataInfo(url, wikidata) {
	let wiki = false;
	const id = url.replace("https://www.wikidata.org/wiki/", "");
	url = id + ".json";
	const cachepath = path.join(__dirname, '..', '..', 'cache', 'wikidata', url);
	if (existsSync(cachepath)) {
		wiki = require(cachepath);
	} else {
		try {
			wiki = (await wikidata.get(url)).data.entities[id];
			writeFileSync(cachepath, JSON.stringify(wiki, null, '\t'));
		} catch(error) {
			//console.log(error);
		}
	}
	return wiki;
}

function caseInitial(text) {
	if (!text) return null;
	if (text === '') return '';
	return text[0].toUpperCase() + text.slice(1);
}

async function addWikiDataInfos() {
	let total = 0;
	const wikidata = axios.create({baseURL: "https://www.wikidata.org/wiki/Special:EntityData/"});
	for (const collection of ['islands', 'regions', 'sectors', 'districts', 'iwi', 'groups', 'features']) {
		for (const record of db[collection]) {
			if (record.links && record.links.wikidata) {
				const wiki = await getWikiDataInfo(record.links.wikidata, wikidata);
				if (wiki) {
					if (wiki.sitelinks) {
						if (!record.links.wikipedia) record.links.wikipedia = {};
						if (!record.links.wikipedia.en && wiki.sitelinks.enwiki) record.links.wikipedia.en = wiki.sitelinks.enwiki.url;
						if (!record.links.wikipedia.mi && wiki.sitelinks.miwiki) record.links.wikipedia.mi = wiki.sitelinks.miwiki.url;
					}
					if (wiki.labels) {
						if (!record.name.locale.en && wiki.labels.en) record.name.locale.en = caseInitial(wiki.labels.en.value);
						if (!record.name.locale.mi && wiki.labels.mi) record.name.locale.mi = caseInitial(wiki.labels.mi.value);
					}
					total++;
				}
			}
		}
	}
	console.log(total);
}

async function addWikiDataZoneInfos() {
	let total = 0;
	const wikidata = axios.create({baseURL: "https://www.wikidata.org/wiki/Special:EntityData/"});
	for (const zone of db.zones) {
		for (const record of zone.areas) {
			//console.log(record);
			if (record.links && record.links.wikidata) {
				const wiki = await getWikiDataInfo(record.links.wikidata, wikidata);
				if (wiki) {
					if (wiki.sitelinks) {
						if (!record.links.wikipedia) record.links.wikipedia = {};
						if (!record.links.wikipedia.en && wiki.sitelinks.enwiki) record.links.wikipedia.en = wiki.sitelinks.enwiki.url;
						if (!record.links.wikipedia.mi && wiki.sitelinks.miwiki) record.links.wikipedia.mi = wiki.sitelinks.miwiki.url;
					}
					if (wiki.labels) {
						if (!record.name.locale.en && wiki.labels.en) record.name.locale.en = caseInitial(wiki.labels.en.value);
						if (!record.name.locale.mi && wiki.labels.mi) record.name.locale.mi = caseInitial(wiki.labels.mi.value);
					}
					total++;
				}
			}
		}
	}
	console.log('zones:', total);
}

async function getWikipediaIntro(url, locale, wikipedia) {
	let wiki;
	url = url.replace("https://" + locale + ".wikipedia.org/wiki/", "");
	const cachepath = path.join(__dirname, '..', '..', 'cache', 'wikipedia', locale, url + '.json');
	if (existsSync(cachepath)) {
		wiki = require(cachepath);
	} else {
		try {
			wiki = (await wikipedia.get(url)).data;
			writeFileSync(cachepath, JSON.stringify(wiki, null, '\t'));
		} catch(error) {
			//console.log(error);
		}
	}
	return wiki;
}

async function addWikipediaIntros(locale) {
	let total = 0;
	const wikipedia = axios.create({baseURL: "https://" + locale + ".wikipedia.org/api/rest_v1/page/summary/"});
	for (const collection of ['islands', 'regions', 'sectors', 'districts', 'iwi', 'groups', 'features']) {
		for (const record of db[collection]) {
			if (record.links && record.links.wikipedia && record.links.wikipedia[locale]) {
				const wiki = await getWikipediaIntro(record.links.wikipedia[locale], locale, wikipedia);
				if (wiki && wiki.extract) {
					if (!record.notes) record.notes = {};
					if (!record.notes.wikipedia) record.notes.wikipedia = {};
					record.notes.wikipedia[locale] = wiki.extract;
					total++;
				}
			}
		}
	}
	console.log(locale + ":", total);
}

async function addWikipediaZoneIntros(locale) {
	let total = 0;
	const wikipedia = axios.create({baseURL: "https://" + locale + ".wikipedia.org/api/rest_v1/page/summary/"});
	for (const zone of db.zones) {
		for (const record of zone.areas) {
			if (record.links && record.links.wikipedia && record.links.wikipedia[locale]) {
				const wiki = await getWikipediaIntro(record.links.wikipedia[locale], locale, wikipedia);
				if (wiki && wiki.extract) {
					if (!zone.notes) zone.notes = {};
					if (!zone.notes.wikipedia) zone.notes.wikipedia = {en: "", mi: ""};
					zone.notes.wikipedia[locale] = (zone.notes.wikipedia[locale] + '\n\n' + wiki.extract).trim();
					total++;
				}
			}
		}
	}
	console.log(locale + ":", total);
}

async function getMaoriMapsInfo(url, locale, maorimaps) {
	let marae;
	url = url.replace("https://maorimaps.com/marae/", "");
	const cachepath = path.join(__dirname, '..', '..', 'cache', 'maorimaps', locale, url + '.html');
	if (existsSync(cachepath)) {
		//marae = require(cachepath);
		marae = readFileSync(cachepath);
	} else {
		try {
			marae = (await maorimaps.get("marae/" + url, { headers: {Cookie: "SSESS04fb61a42ac94afd2a8df6d0aaa40edf=Ji1xYLRRbD31bLF5qTuRgjXU1K0_Ne5fj2iO0dbCvUE;"}})).data;
			writeFileSync(cachepath, marae);
		} catch(error) {
			//console.log(error);
		}
	}
	return marae;
}

async function addMaoriMapsInfos(locale) {
	let total = 0;
	const maorimaps = axios.create({baseURL: "https://maorimaps.com/", withCredentials: true, headers: {Cookie: "SSESS04fb61a42ac94afd2a8df6d0aaa40edf=Ji1xYLRRbD31bLF5qTuRgjXU1K0_Ne5fj2iO0dbCvUE;"}}); // , {headers: {'accept-language': locale + '-NZ'}} // , withCredentials: true
	/*if (locale === 'en') {
		try {
			await maorimaps.get("home/English", {headers: {referer: 'https://maorimaps.com/'}});
		} catch(error) {
			console.log(error);
		}
	} else {
		try {
			await maorimaps.get("home/Te+Reo", {headers: {referer: 'https://maorimaps.com/'}});
		} catch(error) {
			console.log(error);
		}
	}*/
	for (const record of db.groups) {
		if (record.links && record.links.maorimaps) {
			const page = await getMaoriMapsInfo(record.links.maorimaps, locale, maorimaps);
			if (page) {
				const $ = cheerio.load(page);
				if (!record.notes) record.notes = {};
				if (!record.notes.description) record.notes.description = {};
				record.notes.description[locale] = $('.field-name-field-poi-description-body').text();
				total++;
			}
		}
	}
	console.log(locale + ':', total);
}

function addNextPrevious(collection, wrap = false) {
	let total = 0;
	collection.forEach((item, index) => {
		if (!item.previous_id && collection[index - 1]) {
			total++;
			item.previous_id = collection[index - 1].id;
		}
		if (!item.next_id && collection[index + 1]) {
			total++;
			item.next_id = collection[index + 1].id;
		}
		if (wrap) {
			if (!item.previous_id) {
				total++;
				item.previous_id = collection[collection.length - 1].id;
			}
			if (!item.next_id) {
				total++;
				item.next_id = collection[0].id;
			}
		}
	});
	console.log(total);
}

function allNextPrevious() {
	for (const collection of Object.keys(db)) {
		if (['gazetteer', 'meanings', 'groups', 'features'].includes(collection)) {
			// Do nothing
		} else if (collection === 'placenames') {
			// Add next/previous by zone
		} else {
			addNextPrevious(db[collection]);
		}
	}
}

function deleteNamesPlaces() {
	delete db.names;
	delete db.places;
}

function writeData() {
	for (const collection in db) {
		writeCollection(collection);
	}
}

function writeCollection(collection) {
	if (db[collection]) {
		// writeFileSync(path.join(jsonpath, collection + '.json'), JSON.stringify(utils.cleanobj(db[collection])).replace(/^\[{/, "[\n\t{").replace(/}\]$/, "}\n]").replace(/},{/g, "},\n\t{"));
		writeFileSync(path.join(jsonpath, collection + '.json'), JSON.stringify(utils.cleanobj(db[collection]), null, '\t'));
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
	console.log("Adding Placename Audio Info...");
	await addPlacenameAudio();
	console.log("Adding Location Coordinates from Nominatim...");
	await addNominatimLocations();
	console.log("Adding Location Coordinates from the Gazetteer...");
	addGazetteerLocations();
	console.log("Adding Info from WikiData...");
	await addWikiDataInfos();
	await addWikiDataZoneInfos();
	console.log("Adding Intros from Wikipedia...");
	await addWikipediaIntros("en");
	await addWikipediaIntros("mi");
	await addWikipediaZoneIntros("en");
	await addWikipediaZoneIntros("mi");
	console.log("Adding Data from MaoriMaps...");
	await addMaoriMapsInfos("en");
	await addMaoriMapsInfos("mi");
	console.log("Deleting Names & Places...");
	deleteNamesPlaces();
	console.log('Adding Next & Previous IDs...');
	allNextPrevious();
	console.log("Writing Data...");
	writeData();
}

runAll();
