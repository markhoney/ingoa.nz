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
    write: async (record, encoding, next) => {
			try {
				//console.log(record);
				await db.tables[table].insert(record);
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
	if ('IndexName_1' in input) {
		var output = {
			zone: input.ZoneID,
			id: input.Number,
			code: createCode(input.IndexName_1),
			name: input.IndexName_1,
			names: {},
			kinds: [],
			see: [],
			notes: input.Notes
		};
		["UnspokenName", "ExtendedName", "VariantName", "MisspelledName", "IndexName_1", "IndexName_2", "IndexName_3", "CommonName", "GeoName_1", "GeoName_2", "GeoName_3"].forEach(function(name) {
			if (input[name]) {
				output.names[input[name]] = {categories: []};
			}
		});
		for (i = 1; i <= 3; i++) {
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
		["Extended", "Variant", "Misspelled", "Common", "Unspoken"].forEach(function(name) { // , "Fixed"
			if (input[name + "Name"]) {
				output.names[input[name + "Name"]].categories.push(name);
			}
		});
		for (i = 1; i <= 3; i++) {
			if (input["GeoName_" + i]) {
				output.names[input["GeoName_" + i]].googlemap = "https://www.google.co.nz/maps/place/" + input["GeoName_" + i];
				output.names[input["GeoName_" + i]].categories.push("Geo");
			}
		}
		for (i = 1; i <= 4; i++) {
			if (input["SeeZoneID_" + i] || input["SeeName_" + i]) {
				output.see.push({zone: input["SeeZoneID_" + i] || input.Zone, name: input["SeeName_" + i], notes: input["SeeNotes_" + i]});
			}
		}
		for (i = 1; i <= 4; i++) {
			if (input["Kind_" + i]) {
				//output.kinds.push({name: sentenceCase(input["Kind_" + i])});
				output.kinds.push(sentenceCase(input["Kind_" + i]));
				// Need to sort out the superscripts that join names together
			}
		}
		return cleanobj(output);
	}
}

function fixZone(input) {
	var output = {
		id: input.ID,
		code: createCode(input.Name),
		name: input.Name,
		tereo: input.TeReo,
		region: input.RegionID,
		boundary: input.Boundary,
		imagemap: {
			map: input.ImageMap,
			areas: []
		},
		location: [
			{
				type: "Google Place Name",
				value: input.GeoName
			}
		],
		notes: input.Notes
	};
	for (i = 1; i <= 2; i++) { // , audio: {start: input.Start, end: input.End}
		["Small", "Large"].forEach(function(type) {
			if (input["GooglePlaceID" + type + "_" + i]) {
				output.location.push({type: "Google Place ID", size: type, value: input["GooglePlaceID" + type + "_" + i]});
			}
		});
	}
	for (i = 1; i <= 2; i++) {
		if (input["ImageMapAreaType_" + i]) {
			output.imagemap.areas.push({type: input["ImageMapAreaType_" + i], coords: input["ImageMapAreaCoords_" + i]});
		}
	}
	return cleanobj(output);
}

function fixSpeaker(input) {
	if ('Code' in input) {
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
			location: input.Location,
			url: input.URL
		}
		return cleanobj(output);
	}
}

function importPlaces() {
	const inputtsv = fs.createReadStream(path.join(sourcepath, 'Ingoa - Place.tsv'));
	const outputloki = lokiStream("Place");
	const parsecsv = csv.parse({auto_parse: true, delimiter: "	", trim: true, skip_empty_lines: true, columns: true, escape: "\\", quote: "~"});
	const transformcsv = csv.transform(function(record, callback) {
		callback(null, fixPlace(record));
	});
	openPipe(inputtsv, parsecsv, transformcsv, outputloki);
}


function importZones() {
	const inputtsv = fs.createReadStream(path.join(sourcepath, 'Ingoa - Zone.tsv'));
	const outputloki = lokiStream("Zone");
	const parsecsv = csv.parse({auto_parse: true, delimiter: "	", trim: true, skip_empty_lines: true, columns: true, escape: "\\", quote: "~"});
	const transformcsv = csv.transform(function(record, callback) {
		callback(null, fixZone(record));
	});
	openPipe(inputtsv, parsecsv, transformcsv, outputloki);
}

function importSpeakers() {
	const inputtsv = fs.createReadStream(path.join(sourcepath, 'Ingoa - Speaker.tsv'));
	const outputloki = lokiStream("Speaker");
	const parsecsv = csv.parse({auto_parse: true, delimiter: "	", trim: true, skip_empty_lines: true, columns: true, escape: "\\", quote: "~"});
	const transformcsv = csv.transform(function(record, callback) {
		callback(null, fixSpeaker(record));
	});
	openPipe(inputtsv, parsecsv, transformcsv, outputloki);
}

function importIslands() {
	const inputtsv = fs.createReadStream(path.join(sourcepath, 'Ingoa - Island.tsv'));
	const outputloki = lokiStream("Island");
	const parsecsv = csv.parse({auto_parse: true, delimiter: "	", trim: true, skip_empty_lines: true, columns: true, escape: "\\", quote: "~"});
	const transformcsv = csv.transform(function(record, callback) {
		var output = {
			id: record.ID,
			code: createCode(record.Name),
			name: record.Name,
			tereo: record.TeReo,
			description: record.Description,
			location: [
				{
					type: "Google Place ID",
					value: record.GooglePlaceID
				}
			]
		};
		callback(null, cleanobj(output));
	});
	openPipe(inputtsv, parsecsv, transformcsv, outputloki);
}

function importParts() {
	const inputtsv = fs.createReadStream(path.join(sourcepath, 'Ingoa - Part.tsv'));
	const outputloki = lokiStream("Part");
	const parsecsv = csv.parse({auto_parse: true, delimiter: "	", trim: true, skip_empty_lines: true, columns: true, escape: "\\", quote: "~"});
	const transformcsv = csv.transform(function(record, callback) {
		var output = {
			id: record.ID,
			code: createCode(record.Name),
			name: record.Name,
			tereo: record.TeReo,
			island: record.IslandID,
			dates: {
				start: record.Started,
				end: record.Ended,
				launch: record.Launched
			},
			distance: record.DistanceKM,
			funding: record.Funding,
			format: record.Format,
			description: record.Description,
			notes: {
				text: record.NotesText,
				recording: record.NotesRecording
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
	const transformcsv = csv.transform(function(record, callback) {
		var output = {
			id: record.ID,
			code: createCode(record.Name),
			name: record.Name,
			island: record.IslandID,
			dates: {
				start: record.Start,
				end: record.End
			}
		};
		callback(null, cleanobj(output));
	});
	openPipe(inputtsv, parsecsv, transformcsv, outputloki);
}

function importRegions() {
	openpipes++;
	const inputtsv = fs.createReadStream(path.join(sourcepath, 'Ingoa - Region.tsv'));
	const outputloki = lokiStream("Region");
	const parsecsv = csv.parse({auto_parse: true, delimiter: "	", trim: true, skip_empty_lines: true, columns: true, escape: "\\", quote: "~"});
	const transformcsv = csv.transform(function(record, callback) {
		var output = {
			id: record.ID,
			code: createCode(record.Name),
			name: record.Name,
			tereo: record.TeReo,
			island: record.IslandID,
			part: record.PartID,
			location: [
				{
					type: "Google Place ID",
					size: "Large",
					value: record.GooglePlaceID
				}
			]
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
