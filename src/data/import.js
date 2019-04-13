require('events').EventEmitter.prototype._maxListeners = 20;
const fs = require('fs');
const path = require('path');
const csv = require('csv');
const stream = require('stream');
const JSONStream = require('JSONStream');
const utils = require('./utils');

const sourcepath = path.join(__dirname, 'source');
const jsonpath = path.join(__dirname, '..', 'server', 'db', 'json');

const json = true;

if (!fs.existsSync(jsonpath)) {
	fs.mkdirSync(jsonpath, 744);
}

if (!json) {
	const db = require('../server/db/nedb')(true);
}

const dbStream = table => {
	return new stream.Writable({
		objectMode: true,
		write: async (input, encoding, next) => {
			db[table].asyncInsert(input);
			next();
		},
	});
};

function openPipe(input, output, transformCSVtoObject) {
	const inputtsv = fs.createReadStream(path.join(sourcepath, input));
	const outputObjecttoDB = dbStream(output);
	const outputJSON = JSONStream.stringify('[\n', ',\n', '\n]\n');
	const outputToFile = fs.createWriteStream(path.join(jsonpath, output + '.json'));
	const inputCSV = csv.parse({
		auto_parse: true,
		delimiter: '	',
		trim: true,
		skip_empty_lines: true,
		columns: true,
		escape: '\\',
		quote: '~',
	});
	if (json) {
		inputtsv
			.pipe(inputCSV)
			.pipe(transformCSVtoObject)
			.pipe(outputJSON)
			.pipe(outputToFile);
	} else {
		inputtsv
			.pipe(inputCSV)
			.pipe(transformCSVtoObject)
			.pipe(outputObjecttoDB);
	}
}

function importPlacenames() {
	const transformCSVtoObject = csv.transform(function(input, callback) {
		var output = {
			_id: input.ID,
			code: utils.createCode(input.IndexName_1),
			slug: {
				mi: utils.createCode(input.IndexName_1),
			},
			zone_id: input.ZoneID,
			part_id: input.PartID,
			island_id: input.IslandID,
			number: parseInt(input.Number),
			featured: input.Featured ? true : null,
			names: [],
			places: [],
			see: [],
			zone_ids: [],
			notes: {
				name: input.Note_Name,
				speech: input.Note_Speech,
				spelling: input.Note_Spelling,
				place: input.Note_Place,
			},
		};
		var names = {};
		['IndexName_1', 'IndexName_2', 'IndexName_3', 'UnspokenName_1', 'ExtendedName_1', 'ExtendedName_2', 'VariantName_1', 'MisspelledName_1'].forEach(name => {
			if (input[name]) {
				var nomacrons = utils.removeMacrons(input[name]);
				var newname = {
					name: {
						en: input.CommonName_1,
						mi: input[name],
						ascii: input[name] === nomacrons ? null : nomacrons,
					},
					categories: [],
				};
				names[input[name]] = Object.assign({}, names[input[name]], newname);
			}
		});
		['ExtendedName_1', 'ExtendedName_2', 'VariantName_1', 'MisspelledName_1'].forEach(name => {
			if (input[name]) {
				names[input[name]].categories.push(name.slice(0, -6));
			}
		});
		for (var i = 1; i <= 3; i++) {
			if (input['IndexName_' + i]) {
				if (input['SpokenName_' + i]) {
					names[input['IndexName_' + i]].spoken = {
						start: parseFloat(input['Start_' + i]),
						end: parseFloat(input['End_' + i]),
						speaker_id: input['SpeakerID_' + i],
					};
					if (names[input['IndexName_' + i]].name.phonetic) {
						names[input['IndexName_' + i]].name.phonetic = {
							markdown: input['PhoneticName_' + i],
							html: utils.htmlItalics(input['PhoneticName_' + i]),
						};
					}
				}
			}
		}
		names = utils.cleanobj(names);
		Object.keys(names).forEach((name, index) => {
			names[name]._id = 'na_' + input.ID + '-' + index;
			output.names.push(names[name]);
		});
		output.names[0].name.transliteration = input.Transliteration;
		for (i = 1; i <= 4; i++) {
			if (input['SeeNameID_' + i]) {
				output.see.push({
					zone_id: input['SeeZoneID_' + i],
					placename_id: input['SeeID_' + i],
					type: input.SeeType,
				});
			} else if (input['SeeZoneID_' + i]) {
				output.zone_ids.push(input['SeeZoneID_' + i]);
			}
		}
		for (i = 1; i <= 5; i++) {
			if (input['Kind_' + i]) {
				var groups = [];
				if (input['Super_' + i]) {
					groups.push({
						group_id: 'gr_' + input.ZoneID.slice(3) + '-' + input['Super_' + i],
						subgroup_id: input['Super_' + i + '.a'] ? 'gr_' + input.ZoneID.slice(3) + '-' + input['Super_' + i] + '-' + input['Super_' + i + '.a'] : null,
					});
				}
				if (input['Super_' + i + '.1']) {
					groups.push({
						group_id: input['Super_' + i + '.1'] ? 'gr_' + input.ZoneID.slice(3) + '-' + input['Super_' + i + '.1'] : null,
					});
				}
				output.places.push({
					_id: 'pl_' + input.ID + '-' + i,
					name: {
						en: input['KindName_' + i],
					},
					feature_id: input['KindID_' + i],
					plural: input['KindPlural_' + i] ? true : null,
					variant: input['KindPrefix_' + i],
					groups: groups,
				});
			}
		}
		for (i = 1; i <= 2; i++) {
			if (input['Group_' + i]) {
				output.places[0].groups.push({
					group_id: input['GroupID_' + i],
				});
			}
		}
		callback(null, utils.cleanobj(output));
	});
	openPipe('Ingoa - Placenames.tsv', 'placename', transformCSVtoObject);
}

function importZones() {
	const transformCSVtoObject = csv.transform(function(input, callback) {
		const audioLocation = '/audio/zone/' + input.ID + '.mp3';
		const audioSize = fs.statSync('src/client/static' + audioLocation).size;
		var output = {
			_id: input.ID,
			number: parseInt(input.Number),
			code: utils.createCode(input.Name || input.TeReo),
			slug: {
				en: utils.createCode(input.Name === input.TeReo ? null : input.Name),
				mi: utils.createCode(input.TeReo),
			},
			name: {
				en: input.Name === input.TeReo ? null : input.Name,
				mi: input.TeReo,
			},
			audio: {
				file: audioLocation,
				length: input.Length,
				size: audioSize,
			},
			region_id: input.RegionID,
			part_id: input.PartID,
			island_id: input.IslandID,
			maplink: {
				map_id: input.MapID,
				mapareas: [],
			},
			areas: [],
			boundary: input.Boundary,
			gazetteer: input.GazetteerDistrict,
			speaker_ids: [],
			iwi_ids: [],
			notes: input.Notes,
		};
		for (var i = 1; i <= 4; i++) {
			if (input['SpeakerID_' + i]) {
				output.speaker_ids.push(input['SpeakerID_' + i]);
			}
		}
		for (i = 1; i <= 3; i++) {
			if (input['Area_' + i] || input['TeReo_' + i]) {
				output.areas.push({
					name: {
						en: input['Area_' + i],
						mi: input['TeReo_' + i],
					},
				});
			}
		}
		for (i = 1; i <= 2; i++) {
			if (input['MapAreaShape_' + i]) {
				output.maplink.mapareas.push({
					shape: input['MapAreaShape_' + i],
					coords: input['MapAreaCoords_' + i].split(",").map(coord => parseInt(coord)),
				});
			}
		}
		for (i = 1; i <= 4; i++) {
			if (input['IwiID_' + i]) {
				output.iwi_ids.push(input['IwiID_' + i]);
			}
		}
		callback(null, utils.cleanobj(output));
	});
	openPipe('Ingoa - Zones.tsv', 'zone', transformCSVtoObject);
}

function importSpeakers() {
	const transformCSVtoObject = csv.transform(function(input, callback) {
		if (input.FirstName) {
			var output = {
				_id: input.ID,
				code: utils.createCode(input.PreferredName),
				slug: {
					mi: utils.createCode(input.PreferredName),
				},
				name: {
					mi: input.PreferredName,
					parts: {
						nick: input.Nickname,
						title: input.Prefix,
						alternate: input.AlternateName,
						first: input.FirstName,
						middle: input.MiddleNames,
						last: input.Surname,
						suffix: input.Suffix,
					},
					full: [
						input.Prefix,
						input.FirstName,
						input.Nickname ? '(' + input.Nickname + ')' : null,
						input.MiddleNames,
						input.Surname,
						input.Suffix,
					].filter(a => a).join(' '),	
				},
				gender: input.Gender,
				notes: input.Notes,
				recorded: input.Location,
				links: {
					info: input.URL,
				},
			};
			callback(null, utils.cleanobj(output));
		}
	});
	openPipe('Ingoa - Speakers.tsv', 'speaker', transformCSVtoObject);
}

function importIslands() {
	const transformCSVtoObject = csv.transform(function(input, callback) {
		let audioLocation = '';
		let audioSize = 0;
		if (input.ID != 'is_3') {
			audioLocation = '/audio/island/' + input.ID + '.mp3';
			audioSize = fs.statSync('src/client/static' + audioLocation).size;
		}
		var output = {
			_id: input.ID,
			code: utils.createCode(input.Name || input.TeReo),
			slug: {
				en: utils.createCode(input.Name === input.TeReo ? null : input.Name),
				mi: utils.createCode(input.TeReo),
			},
			name: {
				en: input.Name === input.TeReo ? null : input.Name,
				mi: input.TeReo,
			},
			audio: {
				file: audioLocation,
				length: input.Length,
				size: audioSize,
			},
			description: input.Description,
			links: {
				wikipedia: input.Wikipedia,
			},
		};
		callback(null, utils.cleanobj(output));
	});
	openPipe('Ingoa - Islands.tsv', 'island', transformCSVtoObject);
}

function importParts() {
	const transformCSVtoObject = csv.transform(function(input, callback) {
		audioLocation = '/audio/part/' + input.ID + '.mp3';
		audioSize = fs.statSync('src/client/static' + audioLocation).size;
		var output = {
			_id: input.ID,
			number: parseInt(input.Number),
			code: utils.createCode(input.Name || input.TeReo),
			slug: {
				en: utils.createCode(input.Name === input.TeReo ? null : input.Name),
				mi: utils.createCode(input.TeReo),
			},
			name: {
				en: input.Name === input.TeReo ? null : input.Name,
				mi: input.TeReo,
			},
			audio: {
				file: audioLocation,
				length: input.Length,
				size: audioSize,
			},
			island_id: input.IslandID,
			/*island: {
				_id: input.IslandID,
			},*/
			dates: {
				start: input.Start,
				end: input.End,
				launch: input.Launch,
			},
			location: {
				distance: parseInt(input.DistanceKM),
			},
			funding: input.Funding,
			format: input.Format,
			description: input.Description,
			notes: {
				text: input.NotesText,
				recording: input.NotesRecording,
			},
		};
		callback(null, utils.cleanobj(output));
	});
	openPipe('Ingoa - Parts.tsv', 'part', transformCSVtoObject);
}

function importMaps() {
	const transformCSVtoObject = csv.transform(function(input, callback) {
		var output = {
			_id: input.ID,
			code: utils.createCode(input.Name || input.TeReo),
			slug: {
				en: utils.createCode(input.Name === input.TeReo ? null : input.Name),
				mi: utils.createCode(input.TeReo),
			},
			name: {
				en: input.Name === input.TeReo ? null : input.Name,
				mi: input.TeReo,
			},
			island_id: input.IslandID,
			part_id: input.PartID,
			dates: {
				start: input.Start,
				end: input.End,
			},
			maplinks: [],
		};
		for (var i = 1; i <= 2; i++) {
			if (input['MapLinkID_' + i]) {
				output.maplinks.push({
					map_id: input['MapLinkID_' + i],
					mapareas: [
						{
							shape: input['MapLinkShape_' + i],
							coords: input['MapLinkCoords_' + i].split(",").map(coord => parseInt(coord)),
						},
					],
				});
			}
		}
		callback(null, utils.cleanobj(output));
	});
	openPipe('Ingoa - Maps.tsv', 'map', transformCSVtoObject);
}

function importRegions() {
	const transformCSVtoObject = csv.transform(function(input, callback) {
		var output = {
			_id: input.ID,
			code: utils.createCode(input.Name || input.TeReo),
			slug: {
				en: utils.createCode(input.Name === input.TeReo ? null : input.Name),
				mi: utils.createCode(input.TeReo),
			},
			name: {
				en: input.Name === input.TeReo ? null : input.Name,
				mi: input.TeReo,
			},
			island_id: input.IslandID,
			part_id: input.PartID,
			map_id: input.MapID,
			links: {
				wikipedia: input.Wikipedia,
			},
		};
		callback(null, utils.cleanobj(output));
	});
	openPipe('Ingoa - Regions.tsv', 'region', transformCSVtoObject);
}

function importFeatures() {
	const transformCSVtoObject = csv.transform(function(input, callback) {
		var output = {
			_id: input.ID,
			code: utils.createCode(input.Name || input.TeReo),
			slug: {
				en: utils.createCode(input.Name === input.TeReo ? null : input.Name),
				mi: utils.createCode(input.TeReo),
			},
			name: {
				en: input.Name === input.TeReo ? null : input.Name,
				mi: input.TeReo,
			},
			plural: input.Plural,
			order: input.Hierarchy,
			gazetteer: input.GazetteerName,
		};
		callback(null, utils.cleanobj(output));
	});
	openPipe('Ingoa - Features.tsv', 'feature', transformCSVtoObject);
}

function importGroups() {
	const transformCSVtoObject = csv.transform(function(input, callback) {
		var output = {
			_id: input.ID,
			code: utils.createCode(input.Name || input.TeReo),
			slug: {
				en: utils.createCode(input.Name === input.TeReo ? null : input.Name),
				mi: utils.createCode(input.TeReo),
			},
			name: {
				en: input.Name === input.TeReo ? null : input.Name,
				mi: input.TeReo,
			},
			feature_id: input.FeatureID,
			/*feature: {
				_id: input.FeatureID,
			},*/
			plural: input.FeaturePlural ? true : null,
			links: {
				wikipedia: input.Wikipedia,
			},
		};
		callback(null, utils.cleanobj(output));
	});
	openPipe('Ingoa - Groups.tsv', 'group', transformCSVtoObject);
}

function importIwi() {
	const transformCSVtoObject = csv.transform(function(input, callback) {
		var output = {
			_id: input.ID,
			code: utils.createCode(input.Name),
			slug: {
				mi: utils.createCode(input.Name),
			},
			name: {
				mi: input.Name,
			},
			links: {
				wikipedia: input.Wikipedia,
			},
		};
		callback(null, utils.cleanobj(output));
	});
	openPipe('Ingoa - Iwi.tsv', 'iwi', transformCSVtoObject);
}

function importMeanings() {
	const transformCSVtoObject = csv.transform(function(input, callback) {
		var output = {
			_id: input.ID,
			code: utils.createCode(input.CleanedName),
			slug: {
				mi: utils.createCode(input.CleanedName),
			},
			name: {
				mi: input.CleanedName,
			},
			components: input.Components,
			meaning: input.Meaning,
		};
		callback(null, utils.cleanobj(output));
	});
	openPipe('Ingoa - Meanings.tsv', 'meaning', transformCSVtoObject);
}

function importGazetteer() {
	const inputCSV = fs.createReadStream(path.join(sourcepath, 'gaz_names.csv'));
	const outputJSON = JSONStream.stringify('[\n', ',\n', '\n]\n');
	const outputToFile = fs.createWriteStream(path.join(jsonpath, 'gazetteer.json'));
	const outputObjecttoDB = dbStream('gazetteer');
	const parseCSV = csv.parse({
		auto_parse: true,
		skip_empty_lines: true,
		columns: true,
	});
	const transformCSVtoObject = csv.transform(function(input, callback) {
		var output = {
			/*_id: input.name_id,
			code: utils.createCode(input.name),
			slug: {
				en: utils.createCode(input.name),
			},
			name: {
				en: input.name,
			},
			district: input.land_district,
			kind: {
				name: {
					en: input.feat_type,
				},
			},
			location: {
				position: {
					lat: parseFloat(input.crd_latitude),
					lng: parseFloat(input.crd_longitude),
				},
			},*/
			name: input.name,
			district: input.land_district,
			feature: input.feat_type,
			position: {
				lat: parseFloat(input.crd_latitude),
				lng: parseFloat(input.crd_longitude),
			},
		};
		callback(null, utils.cleanobj(output));
	});
	if (json) {
		inputCSV
		.pipe(parseCSV)
		.pipe(transformCSVtoObject)
		.pipe(outputJSON)
		.pipe(outputToFile);
	} else {
		inputCSV
			.pipe(parseCSV)
			.pipe(transformCSVtoObject)
			.pipe(outputObjecttoDB);
	}
}

function importAll() {
	importIslands();
	importParts();
	importMaps();
	importRegions();
	importZones();
	importSpeakers();
	importPlacenames();
	importFeatures();
	importIwi();
	importMeanings();
	importGroups();
	importGazetteer();
}

importAll();
