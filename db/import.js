const fs = require('fs');
const path = require('path');
const csv = require('csv');
const stream = require('stream');
//const zlib = require('zlib');
//const _ = require('underscore');

const sourcepath = path.join(__dirname, 'source');

try {
	fs.renameSync(path.join(__dirname, '../db/ingoa.json'), path.join(__dirname, '../db/ingoa.old.json'));
} catch (err) {}
const db = require('../db/loki.js');

function cleanobj(o) {
	for (var k in o) {
		if (typeof o[k] === 'object') {
			cleanobj(o[k]);
		};
		if (['-', ' ', '', undefined, null].indexOf(o[k]) > -1 || (typeof (o[k]) === 'object' && Object.keys(o[k]).length === 0)) {
			delete o[k];
		}
	}
	return o;
}

function sentenceCase(sentence) {
	if (sentence) {
		return sentence.charAt(0).toUpperCase() + sentence.slice(1);
	}
}

function createCode(name) {
	if (name) {
		return name.toLowerCase().replace(/ /g, '_').replace(/\//g, '-').replace(/\(/g, '').replace(/\)/g, '').replace(/ʰ/g, 'h').replace(/ā/g, 'a').replace(/ē/g, 'e').replace(/ī/g, 'i').replace(/ō/g, 'o').replace(/ū/g, 'u');
	}
}

db(function(db) {
	const lokiStream = (table) => {
		const writable = new stream.Writable({
			objectMode: true,
			write: async (input, encoding, next) => {
				try {
					//console.log(input);
					await db.tables[table].insert(input);
					next();
				} catch (err) {
					//console.log(err);
				}
			}
		});
		writable.on('finish', async () => {
			db.conn.saveDatabase();
		});
		return writable;
	};

	var openpipes = 0;
	function openPipe(inputtsv, parsecsv, transformcsv, outputloki) {
		openpipes++;
		inputtsv.pipe(parsecsv).pipe(transformcsv).pipe(outputloki);
		openpipes--;
		if (!openpipes) {
			db.conn.close();
		}
	}

	var lastend;
	function importPlaces() {
		const inputtsv = fs.createReadStream(path.join(sourcepath, 'Ingoa - Place.tsv'));
		const outputloki = lokiStream('Place');
		const parsecsv = csv.parse({auto_parse: true, delimiter: '	', trim: true, skip_empty_lines: true, columns: true, escape: '\\', quote: '~'});
		const transformcsv = csv.transform(function(input, callback) {
			if (input['IndexName_1']) {
				var output = {
					zone: input.ZoneID,
					id: input.Number,
					code: createCode(input.IndexName_1),
					codes: {
						en: createCode(input.CommonName),
						mi: createCode(input.IndexName_1)
					},
					name: input.IndexName_1,
					names: {
						en: input.CommonName,
						mi: input.IndexName_1
					},
					placenames: [],
					kinds: [],
					see: [],
					notes: input.Notes
				};
				var placenames = {};
				['IndexName_1', 'IndexName_2', 'IndexName_3', 'UnspokenName', 'ExtendedName', 'VariantName', 'MisspelledName', 'CommonName'].forEach(function(name) {
					placenames[input[name]] = {name: input[name], categories: []};
				});
				['UnspokenName', 'ExtendedName', 'VariantName', 'MisspelledName', 'CommonName'].forEach(function(name) {
					if (input[name]) {
						placenames[input[name]].categories.push(name.slice(0, -4));
					}
				});
				for (var i = 1; i <= 3; i++) {
					if (input['IndexName_' + i]) {
						//placenames[input['IndexName_' + i]].index = i;
						if (input['SpokenName_' + i]) {
							placenames[input['IndexName_' + i]].audio = {start: input['Start_' + i], end: input['End_' + i], speaker: input['SpeakerID_' + i]};
							if (input.ZoneID >= 60 && input.Number !== 0) {
								placenames[input['IndexName_' + i]].phonetic = input['SpokenName_' + i];
							}
							placenames[input['IndexName_' + i]].audio.prestart = 0;
							if (input.Number !== 0) {
								placenames[input['IndexName_' + i]].audio.prestart = (input['Start_' + i] + lastend) / 2;
							}
							lastend = input['End_' + i];
							placenames[input['IndexName_' + i]].categories.push('Spoken');
						}
					}
				}
				for (var name in cleanobj(placenames)) {
					output.placenames.push(placenames[name]);
				}
				for (i = 1; i <= 4; i++) {
					if (input['SeeZoneID_' + i] || input['SeeName_' + i]) {
						output.see.push({zone: input['SeeZoneID_' + i] || input.Zone, name: input['SeeName_' + i], notes: input['SeeNotes_' + i]});
					}
				}
				for (i = 1; i <= 5; i++) {
					if (input['Kind_' + i]) {
						var kind = sentenceCase(input['Kind_' + i]);
						output.kinds.push({
							name: kind,
							group: input['Super_' + i]
						});
					}
				}
				callback(null, cleanobj(output));
			}
		});
		openPipe(inputtsv, parsecsv, transformcsv, outputloki);
	}

	function importZones() {
		const inputtsv = fs.createReadStream(path.join(sourcepath, 'Ingoa - Zone.tsv'));
		const outputloki = lokiStream('Zone');
		const parsecsv = csv.parse({auto_parse: true, delimiter: '	', trim: true, skip_empty_lines: true, columns: true, escape: '\\', quote: '~'});
		const transformcsv = csv.transform(function(input, callback) {
			var output = {
				id: input.ID,
				code: createCode(input.Name),
				codes: {
					en: createCode(input.Name === input.TeReo ? null : input.Name),
					mi: createCode(input.TeReo)
				},
				name: input.Name,
				names: {
					en: (input.Name === input.TeReo ? null : input.Name),
					mi: input.TeReo
				},
				region: input.RegionID,
				location: {
					boundary: input.Boundary,
					imagemap: {
						map: input.ImageMapID,
						areas: []
					},
					areas: {}
				},
				notes: input.Notes
			};
			var areas = input.Name.split('/');
			for (var area in areas) {
				output.location.areas[areas[area]] = {googleplaceid: input['GooglePlaceIDLarge_' + (area + 1)] || input['GooglePlaceIDSmall_' + (area + 1)]};
			}
			output.location.googleplacename = input['GooglePlaceName'];
			for (var i = 1; i <= 2; i++) {
				if (input['ImageMapAreaShape_' + i]) {
					output.location.imagemap.areas.push({
						shape: input['ImageMapAreaShape_' + i],
						coords: input['ImageMapAreaCoords_' + i]
					});
				}
			}
			callback(null, cleanobj(output));
		});
		openPipe(inputtsv, parsecsv, transformcsv, outputloki);
	}

	function importSpeakers() {
		const inputtsv = fs.createReadStream(path.join(sourcepath, 'Ingoa - Speaker.tsv'));
		const outputloki = lokiStream('Speaker');
		const parsecsv = csv.parse({auto_parse: true, delimiter: '	', trim: true, skip_empty_lines: true, columns: true, escape: '\\', quote: '~'});
		const transformcsv = csv.transform(function(input, callback) {
			if (input['FirstName']) {
				var output = {
					id: input.ID,
					code: createCode([input.FirstName, input.Surname].join(' ')),
					name: [input.FirstName, input.Surname].join(' '),
					gender: input.Gender,
					fullname: {
						nick: input.Nickname,
						title: input.Prefix,
						alternate: input.AlternateName,
						first: input.FirstName,
						middle: input.MiddleNames,
						last: input.Surname,
						suffix: input.Suffix
					},
					notes: input.Notes,
					location: {
						recorded: input.Location
					},
					url: input.URL
				};
				callback(null, cleanobj(output));
			}
		});
		openPipe(inputtsv, parsecsv, transformcsv, outputloki);
	}

	function importIslands() {
		const inputtsv = fs.createReadStream(path.join(sourcepath, 'Ingoa - Island.tsv'));
		const outputloki = lokiStream('Island');
		const parsecsv = csv.parse({auto_parse: true, delimiter: '	', trim: true, skip_empty_lines: true, columns: true, escape: '\\', quote: '~'});
		const transformcsv = csv.transform(function(input, callback) {
			var output = {
				id: input.ID,
				code: createCode(input.Name),
				codes: {
					en: createCode(input.Name === input.TeReo ? null : input.Name),
					mi: createCode(input.TeReo)
				},
				name: input.Name,
				names: {
					en: (input.Name === input.TeReo ? null : input.Name),
					mi: input.TeReo
				},
				zone: input.ZoneID,
				description: input.Description,
				location: {
					googleplaceid: input.GooglePlaceID,
					googleplacename: input.GooglePlaceName
				}
			};
			callback(null, cleanobj(output));
		});
		openPipe(inputtsv, parsecsv, transformcsv, outputloki);
	}

	function importParts() {
		const inputtsv = fs.createReadStream(path.join(sourcepath, 'Ingoa - Part.tsv'));
		const outputloki = lokiStream('Part');
		const parsecsv = csv.parse({auto_parse: true, delimiter: '	', trim: true, skip_empty_lines: true, columns: true, escape: '\\', quote: '~'});
		const transformcsv = csv.transform(function(input, callback) {
			var output = {
				id: input.ID,
				code: createCode(input.Name),
				codes: {
					en: createCode(input.Name === input.TeReo ? null : input.Name),
					mi: createCode(input.TeReo)
				},
				name: input.Name,
				names: {
					en: (input.Name === input.TeReo ? null : input.Name),
					mi: input.TeReo
				},
				island: input.IslandID,
				zone: input.ZoneID,
				dates: {
					start: input.Started,
					end: input.Ended,
					launch: input.Launched
				},
				location: {
					distance: input.DistanceKM
				},
				funding: input.Funding,
				format: input.Format,
				description: input.Description,
				notes: {
					text: input.NotesText,
					recording: input.NotesRecording
				}
			};
			callback(null, cleanobj(output));
		});
		openPipe(inputtsv, parsecsv, transformcsv, outputloki);
	}

	function importImageMaps() {
		const inputtsv = fs.createReadStream(path.join(sourcepath, 'Ingoa - ImageMap.tsv'));
		const outputloki = lokiStream('ImageMap');
		const parsecsv = csv.parse({auto_parse: true, delimiter: '	', trim: true, skip_empty_lines: true, columns: true, escape: '\\', quote: '~'});
		const transformcsv = csv.transform(function(input, callback) {
			var output = {
				id: input.ID,
				code: createCode(input.Name),
				codes: {
					en: createCode(input.Name === input.TeReo ? null : input.Name),
					mi: createCode(input.TeReo)
				},
				name: input.Name,
				names: {
					en: (input.Name === input.TeReo ? null : input.Name),
					mi: input.TeReo
				},
				island: input.IslandID,
				part: input.PartID,
				dates: {
					start: input.Start,
					end: input.End
				},
				imagemaplinks: []
			};
			for (var i = 1; i <= 2; i++) {
				if (input['MapLinkID_' + i]) {
					output.imagemaplinks.push({
						map: input.ID,
						maplink: input['MapLinkID_' + i],
						areas: [
							{
								shape: input['MapLinkShape_' + i],
								coords: input['MapLinkCoords_' + i]
							}
						]
					});
				}
			}
			callback(null, cleanobj(output));
		});
		openPipe(inputtsv, parsecsv, transformcsv, outputloki);
	}

	function importRegions() {
		openpipes++;
		const inputtsv = fs.createReadStream(path.join(sourcepath, 'Ingoa - Region.tsv'));
		const outputloki = lokiStream('Region');
		const parsecsv = csv.parse({auto_parse: true, delimiter: '	', trim: true, skip_empty_lines: true, columns: true, escape: '\\', quote: '~'});
		const transformcsv = csv.transform(function(input, callback) {
			var output = {
				id: input.ID,
				code: createCode(input.Name),
				codes: {
					en: createCode(input.Name === input.TeReo ? null : input.Name),
					mi: createCode(input.TeReo)
				},
				name: input.Name,
				names: {
					en: (input.Name === input.TeReo ? null : input.Name),
					mi: input.TeReo
				},
				island: input.IslandID,
				part: input.PartID,
				location: {
					googleplaceid: input.GooglePlaceID,
					googleplacename: input.GooglePlaceName,
					gazetteer: input.GazetteerDistricts.split(','),
					imagemap: {
						map: input.ImageMapID
					}
				}
			};
			callback(null, cleanobj(output));
		});
		openPipe(inputtsv, parsecsv, transformcsv, outputloki);
	}

	function importMeanings() {
		openpipes++;
		const inputtsv = fs.createReadStream(path.join(sourcepath, 'Ingoa - Meaning.tsv'));
		const outputloki = lokiStream('Meaning');
		const parsecsv = csv.parse({auto_parse: true, delimiter: '	', trim: true, skip_empty_lines: true, columns: true, escape: '\\', quote: '~'});
		const transformcsv = csv.transform(function(input, callback) {
			var output = {
				code: createCode(input.CleanedName),
				name: input.CleanedName,
				components: input.Components,
				meaning: input.Meaning
			};
			callback(null, cleanobj(output));
		});
		openPipe(inputtsv, parsecsv, transformcsv, outputloki);
	}

	function importGazetteer() {
		openpipes++;
		const inputcsv = fs.createReadStream(path.join(sourcepath, 'gaz_names.csv'));
		const outputloki = lokiStream('Gazetteer');
		const parsecsv = csv.parse({auto_parse: true, skip_empty_lines: true, columns: true});
		const transformcsv = csv.transform(function(input, callback) {
			var output = {
				id: input.name_id,
				code: createCode(input.name),
				name: input.name,
				district: input.land_district,
				kinds: {},
				location: {
					position: {
						lat: input.crd_latitude,
						lng: input.crd_longitude
					}
				}
			};
			output.kinds[input.feat_type] = {
				id: 1
			};
			callback(null, cleanobj(output));
		});
		openPipe(inputcsv, parsecsv, transformcsv, outputloki);
	}

	function importAll() {
		importIslands();
		importParts();
		importImageMaps();
		importRegions();
		importZones();
		importSpeakers();
		importPlaces();
		importMeanings();
		importGazetteer();
	}

	importAll();
});
