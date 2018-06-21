const fs = require('fs');
const path = require('path');
const csv = require("csv");
const stream = require('stream');
const zlib = require('zlib');
const _ = require('underscore');

const sourcepath = path.join(__dirname, 'source');

try {
	fs.renameSync(path.join(__dirname, '../db/ingoa.json'), path.join(__dirname, '../db/ingoa.old.json'));
} catch(err) {}
const db = require('../db/loki.js');
db(function(db) {

const lokiStream = (table) => {
  const writable = new stream.Writable({
    objectMode: true,
    write: async (input, encoding, next) => {
			try {
				//console.log(input);
				await db.tables[table].insert(input);
				next();
			} catch(err) {
				console.log(err);
			}
    }
  });
  writable.on('finish', async () => {
		db.conn.saveDatabase();
  });
  return writable;
};

function cleanobj(o) {
	for (var k in o) {
		if (typeof o[k] === 'object') {
			cleanobj(o[k]);
		};
		if (['-', ' ', '', undefined, null].indexOf(o[k]) > -1 || (typeof(o[k]) === 'object' && Object.keys(o[k]).length === 0)) {
			delete o[k]
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
	return name.toLowerCase().replace(/ /g, "_").replace(/\//g, "-").replace(/ʰ/g, "h").replace(/ā/g, "a").replace(/ē/g, "e").replace(/ī/g, "i").replace(/ō/g, "o").replace(/ū/g, "u");
}


var openpipes = 0;
function openPipe(inputtsv, parsecsv, transformcsv, outputloki) {
	openpipes++;
	inputtsv.pipe(parsecsv).pipe(transformcsv).pipe(outputloki);
	openpipes--;
	if (!openpipes) db.conn.close();
}

var lastend;
function fixPlace(input) {
	if (input['IndexName_1']) {
		var output = {
			zone: input.ZoneID,
			id: input.Number,
			code: createCode(input.IndexName_1),
			//name: input.IndexName_1,
			name: {
				en: input.CommonName,
				mi: input.IndexName_1
			},
			names: {},
			kinds: {},
			see: [],
			notes: input.Notes
		};
		["UnspokenName", "ExtendedName", "VariantName", "MisspelledName", "CommonName", "IndexName_1", "IndexName_2", "IndexName_3"].forEach(function(name) {
			output.names[input[name]] = {categories: []};
		});
		["Extended", "Variant", "Misspelled", "Common", "Unspoken"].forEach(function(name) { // , "Fixed"
			if (input[name + "Name"]) {
				output.names[input[name + "Name"]].categories.push(name);
			}
		});
		for (var i = 1; i <= 3; i++) {
			if (input["IndexName_" + i]) {
				output.names[input["IndexName_" + i]].index = i;
				if (input["SpokenName_" + i]) {
					output.names[input["IndexName_" + i]].audio = {start: input["Start_" + i], end: input["End_" + i], speaker: input["Speaker_" + i]};
					if (input.ZoneID >= 60 && input.Number != 0) {
						output.names[input["IndexName_" + i]].phonetic = input["SpokenName_" + i];
					}
					var prestart = 0;
					if (input.Number != 0) {
						prestart = (input["Start_" + i] + lastend) / 2; //.toFixed(2);
					}
					output.names[input["IndexName_" + i]].audio.prestart = prestart;
					output.names[input["IndexName_" + i]].categories.push("Spoken");
					lastend = input["End_" + i];
				}
			}
		}
		for (var i = 1; i <= 4; i++) {
			if (input["SeeZoneID_" + i] || input["SeeName_" + i]) {
				output.see.push({zone: input["SeeZoneID_" + i] || input.Zone, name: input["SeeName_" + i], notes: input["SeeNotes_" + i]});
			}
		}
		for (var i = 1; i <= 4; i++) {
			if (input["Kind_" + i]) {
				var kind = sentenceCase(input["Kind_" + i]);
				output.kinds[kind] = {
					group: input["Super_" + i],
					location: {
						googleplacename: input["GooglePlaceName_" + i]
					}
				};
			}
		}
		return cleanobj(output);
	}
}

function fixZone(input) {
	var output = {
		id: input.ID,
		code: createCode(input.Name),
		//name: input.Name,
		//tereo: input.TeReo,
		name: {
			en: (input.Name == input.TeReo ? null : input.Name),
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
	var areas = input.Name.split("/");
	for (var area in areas) {
		output.location.areas[areas[area]] = {googleplaceid: input["GooglePlaceIDLarge_" + (area + 1)] || input["GooglePlaceIDSmall_" + (area + 1)]};
	}
	output.location.googleplacename = input["GooglePlaceName"];
	for (var i = 1; i <= 2; i++) {
		if (input["ImageMapAreaShape_" + i]) {
			output.location.imagemap.areas.push({
				shape: input["ImageMapAreaShape_" + i],
				coords: input["ImageMapAreaCoords_" + i]
			});
		}
	}
	return cleanobj(output);
}

function fixSpeaker(input) {
	if (input['FirstName']) {
		var output = {
			id: input.ID,
			code: createCode([input.FirstName, input.Surname].join(" ")),
			name: [input.FirstName, input.Surname].join(" "),
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
				inputed: input.Location
			},
			url: input.URL
		}
		return cleanobj(output);
	}
}

function importPlaces() {
	const inputtsv = fs.createReadStream(path.join(sourcepath, 'Ingoa - Place.tsv'));
	const outputloki = lokiStream("Place");
	const parsecsv = csv.parse({auto_parse: true, delimiter: "	", trim: true, skip_empty_lines: true, columns: true, escape: "\\", quote: "~"});
	const transformcsv = csv.transform(function(input, callback) {
		callback(null, fixPlace(input));
	});
	openPipe(inputtsv, parsecsv, transformcsv, outputloki);
}


function importZones() {
	const inputtsv = fs.createReadStream(path.join(sourcepath, 'Ingoa - Zone.tsv'));
	const outputloki = lokiStream("Zone");
	const parsecsv = csv.parse({auto_parse: true, delimiter: "	", trim: true, skip_empty_lines: true, columns: true, escape: "\\", quote: "~"});
	const transformcsv = csv.transform(function(input, callback) {
		callback(null, fixZone(input));
	});
	openPipe(inputtsv, parsecsv, transformcsv, outputloki);
}

function importSpeakers() {
	const inputtsv = fs.createReadStream(path.join(sourcepath, 'Ingoa - Speaker.tsv'));
	const outputloki = lokiStream("Speaker");
	const parsecsv = csv.parse({auto_parse: true, delimiter: "	", trim: true, skip_empty_lines: true, columns: true, escape: "\\", quote: "~"});
	const transformcsv = csv.transform(function(input, callback) {
		callback(null, fixSpeaker(input));
	});
	openPipe(inputtsv, parsecsv, transformcsv, outputloki);
}

function importIslands() {
	const inputtsv = fs.createReadStream(path.join(sourcepath, 'Ingoa - Island.tsv'));
	const outputloki = lokiStream("Island");
	const parsecsv = csv.parse({auto_parse: true, delimiter: "	", trim: true, skip_empty_lines: true, columns: true, escape: "\\", quote: "~"});
	const transformcsv = csv.transform(function(input, callback) {
		var output = {
			id: input.ID,
			code: createCode(input.Name),
			//name: input.Name,
			//tereo: input.TeReo,
			name: {
				en: (input.Name == input.TeReo ? null : input.Name),
				mi: input.TeReo
			},
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
	const outputloki = lokiStream("Part");
	const parsecsv = csv.parse({auto_parse: true, delimiter: "	", trim: true, skip_empty_lines: true, columns: true, escape: "\\", quote: "~"});
	const transformcsv = csv.transform(function(input, callback) {
		var output = {
			id: input.ID,
			code: createCode(input.Name),
			//name: input.Name,
			//tereo: input.TeReo,
			name: {
				en: (input.Name == input.TeReo ? null : input.Name),
				mi: input.TeReo
			},
			island: input.IslandID,
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
				inputing: input.NotesRecording
			}
		};
		callback(null, cleanobj(output));
	});
	openPipe(inputtsv, parsecsv, transformcsv, outputloki);
}

function importImageMaps() {
	const inputtsv = fs.createReadStream(path.join(sourcepath, 'Ingoa - ImageMap.tsv'));
	const outputloki = lokiStream("ImageMap");
	const parsecsv = csv.parse({auto_parse: true, delimiter: "	", trim: true, skip_empty_lines: true, columns: true, escape: "\\", quote: "~"});
	const transformcsv = csv.transform(function(input, callback) {
		var output = {
			id: input.ID,
			code: createCode(input.Name),
			//name: input.Name,
			name: {
				en: (input.Name == input.TeReo ? null : input.Name),
				mi: input.TeReo
			},
			island: input.IslandID,
			dates: {
				start: input.Start,
				end: input.End
			},
			imagemaplinks: []
		};
		for (var i = 1; i <= 2; i++) {
			if (input["MapLinkID_" + i]) {
				output.imagemaplinks.push({
					map: input.ID,
					maplink: input["MapLinkID_" + i],
					areas: [
						{
							shape: input["MapLinkShape_" + i],
							coords: input["MapLinkCoords_" + i]
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
	const outputloki = lokiStream("Region");
	const parsecsv = csv.parse({auto_parse: true, delimiter: "	", trim: true, skip_empty_lines: true, columns: true, escape: "\\", quote: "~"});
	const transformcsv = csv.transform(function(input, callback) {
		var output = {
			id: input.ID,
			code: createCode(input.Name),
			//name: input.Name,
			//tereo: input.TeReo,
			name: {
				en: (input.Name == input.TeReo ? null : input.Name),
				mi: input.TeReo
			},
			island: input.IslandID,
			part: input.PartID,
			location: {
				googleplaceid: input.GooglePlaceID,
				googleplacename: input.GooglePlaceName,
				imagemap: {
					map: input.ImageMapID
				}
			}
		};
		callback(null, cleanobj(output));
	});
	openPipe(inputtsv, parsecsv, transformcsv, outputloki);
}

function importAll() {
	importIslands();
	importParts();
	importImageMaps();
	importRegions();
	importZones();
	importSpeakers();
	importPlaces();
}

importAll();
});
