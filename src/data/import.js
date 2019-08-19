require('events').EventEmitter.prototype._maxListeners = 20;
const fs = require('fs');
const path = require('path');
const csv = require('csv');
const stream = require('stream');
const JSONStream = require('JSONStream');
const utils = require('../server/db/utils');

const sourcepath = path.join(__dirname, 'source');
const jsonpath = path.join(__dirname, '..', 'server', 'db', 'json');

const wikidataURL = 'https://www.wikidata.org/wiki/';

if (!fs.existsSync(jsonpath)) {
	fs.mkdirSync(jsonpath, 744);
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
	let inputtsv = fs.createReadStream(path.join(sourcepath, input));
	const outputObjecttoDB = dbStream(output);
	const outputJSON = JSONStream.stringify('[\n', ',\n', '\n]\n');
	const outputToFile = fs.createWriteStream(path.join(jsonpath, output + '.json'));
	let inputCSV = csv.parse({
		auto_parse: true,
		delimiter: '	',
		trim: true,
		skip_empty_lines: true,
		columns: true,
		escape: '\\',
		quote: '~',
	});
	inputtsv
		.pipe(inputCSV)
		.pipe(transformCSVtoObject)
		.pipe(outputJSON)
		.pipe(outputToFile);
}

function importIslands() {
	const transformCSVtoObject = csv.transform(function(input, callback) {
		let audioLocation = '';
		let audioSize = 0;
		if (input.ID != 'is_3') {
			audioLocation = '/audio/island/' + input.ID + '.mp3';
			audioSize = fs.statSync('src/client/static' + audioLocation).size;
		}
		const output = {
			_id: input.ID,
			slug: {
				en: utils.createCode(input.Name || input.TeReo),
				mi: utils.createCode(input.TeReo || input.Name),
			},
			name: {
				locale: {
					en: input.Name === input.TeReo ? null : input.Name,
					mi: input.TeReo,
				},
				alt: {
					ascii: utils.ascii(input.TeReo),
					double: utils.double(input.TeReo),
				},
			},
			audio: {
				file: audioLocation,
				length: input.AudioLength,
				size: audioSize,
			},
			links: {
				wikipedia: {
					en: input.WikiLink,
					mi: input.WikiMi,
				},
				wikidata: (input.WikiData ? wikidataURL + input.WikiData : null),
			},
			funding: [
				{
					source: {
						en: input.Funding,
					},
					url: input.FundingLink,
				},
				{
					source: {
						en: input.Funding_2,
					},
					url: input.FundingLink_2,
				},
			],
			metric: {
				area: parseInt(input.Area),
				population: parseInt(input.Population),
			},
			notes: {
				description: {
					en: input.Description,
				},
				funding: {
					en: input.Funded,
				},
				recording: {
					en: input.Recorded,
				},
			}
		};
		callback(null, utils.cleanobj(output));
	});
	openPipe('Ingoa - Islands.tsv', 'island', transformCSVtoObject);
}

function importParts() {
	const transformCSVtoObject = csv.transform(function(input, callback) {
		audioLocation = '/audio/part/' + input.ID + '.mp3';
		audioSize = fs.statSync('src/client/static' + audioLocation).size;
		const output = {
			_id: input.ID,
			number: parseInt(input.Number),
			slug: {
				en: utils.createCode(input.Name || input.TeReo),
				mi: utils.createCode(input.TeReo || input.Name),
			},
			name: {
				locale: {
					en: input.Name === input.TeReo ? null : input.Name,
					mi: input.TeReo,
				},
				alt: {
					ascii: utils.ascii(input.TeReo),
					double: utils.double(input.TeReo),
				},
			},
			audio: {
				file: audioLocation,
				length: input.AudioLength,
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
			format: {
				en: input.Format,
			},
			funding: [
				{
					source: {
						en: input.Funding,
					},
					url: input.FundingLink,
				},
				{
					source: {
						en: input.Funding_2,
					},
					url: input.FundingLink_2,
				},
			],
			notes: {
				description: {
					en: input.Description,
				},
				creation: {
					en: input.NotesText,
				},
				recording: {
					en: input.NotesRecording,
				},
				funding: {
					en: input.Funding,
				},
			},
		};
		callback(null, utils.cleanobj(output));
	});
	openPipe('Ingoa - Parts.tsv', 'part', transformCSVtoObject);
}

function importMaps() {
	const transformCSVtoObject = csv.transform(function(input, callback) {
		const output = {
			_id: input.ID,
			slug: {
				en: utils.createCode(input.Name || input.TeReo),
				mi: utils.createCode(input.TeReo || input.Name),
			},
			name: {
				locale: {
					en: input.Name === input.TeReo ? null : input.Name,
					mi: input.TeReo,
				},
				alt: {
					ascii: utils.ascii(input.TeReo),
					double: utils.double(input.TeReo),
				},
			},
			island_id: input.IslandID,
			part_id: input.PartID,
			dates: {
				start: input.Start,
				end: input.End,
			},
			maplinks: [],
		};
		for (let i = 1; i <= 2; i++) {
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
		const output = {
			_id: input.ID,
			slug: {
				en: utils.createCode(input.Name || input.TeReo),
				mi: utils.createCode(input.TeReo || input.Name),
			},
			name: {
				locale: {
					en: input.Name === input.TeReo ? null : input.Name,
					mi: input.TeReo,
				},
				alt: {
					ascii: utils.ascii(input.TeReo),
					double: utils.double(input.TeReo),
				},
			},
			island_id: input.IslandID,
			part_id: input.PartID,
			map_id: input.MapID,
			metric: {
				area: parseInt(input.Area),
				population: parseInt(input.Population),
			},
			links: {
				wikipedia: {
					en: input.WikiLink,
					mi: input.WikiMi,
				},
				wikidata: (input.WikiData ? wikidataURL + input.WikiData : null),
			},
		};
		callback(null, utils.cleanobj(output));
	});
	openPipe('Ingoa - Regions.tsv', 'region', transformCSVtoObject);
}

function importSectors() {
	const transformCSVtoObject = csv.transform(function(input, callback) {
		const output = {
			_id: input.ID,
			slug: {
				en: utils.createCode(input.Name || input.TeReo),
				mi: utils.createCode(input.TeReo || input.Name),
			},
			name: {
				locale: {
					en: input.Name === input.TeReo ? null : input.Name,
					mi: input.TeReo,
				},
				alt: {
					ascii: utils.ascii(input.TeReo),
					double: utils.double(input.TeReo),
				},
			},
			island_id: input.IslandID,
			part_id: input.PartID,
			map_id: input.MapID,
			links: {
				wikipedia: {
					en: input.WikiLink,
					mi: input.WikiMi,
				},
				wikidata: (input.WikiData ? wikidataURL + input.WikiData : null),
			},
		};
		callback(null, utils.cleanobj(output));
	});
	openPipe('Ingoa - Sectors.tsv', 'sector', transformCSVtoObject);
}

function importDistricts() {
	const transformCSVtoObject = csv.transform(function(input, callback) {
		const output = {
			_id: input.ID,
			slug: {
				en: utils.createCode(input.Name || input.TeReo),
				mi: utils.createCode(input.TeReo || input.Name),
			},
			name: {
				locale: {
					en: input.Name === input.TeReo ? null : input.Name,
					mi: input.TeReo,
				},
				alt: {
					ascii: utils.ascii(input.TeReo),
					double: utils.double(input.TeReo),
					full: input.FullName,
				},
			},
			island_id: input.IslandID,
			//part_id: input.PartID,
			//map_id: input.MapID,
			region_id: input.RegionID,
			sector_id: input.SectorID,
			seat: input.Seat,
			metric: {
				area: parseInt(input.Area),
				population: parseInt(input.Population),
			},
			links: {
				wikipedia: {
					en: input.WikiLink,
					mi: input.WikiMi,
				},
				wikidata: (input.WikiData ? wikidataURL + input.WikiData : null),
			},
		};
		callback(null, utils.cleanobj(output));
	});
	openPipe('Ingoa - Districts.tsv', 'district', transformCSVtoObject);
}

function importZones() {
	const transformCSVtoObject = csv.transform(function(input, callback) {
		const audioLocation = '/audio/zone/' + input.ID + '.mp3';
		const audioSize = fs.statSync('src/client/static' + audioLocation).size;
		const output = {
			_id: input.ID,
			number: parseInt(input.Number),
			slug: {
				en: utils.createCode(input.Name || input.TeReo),
				mi: utils.createCode(input.TeReo || input.Name),
			},
			name: {
				locale: {
					en: input.Name === input.TeReo ? null : input.Name,
					mi: input.TeReo,
				},
				alt: {
					ascii: utils.ascii(input.TeReo),
					double: utils.double(input.TeReo),
				},
			},
			audio: {
				file: audioLocation,
				length: input.AudioLength,
				size: audioSize,
			},
			//island_id: input.IslandID,
			//part_id: input.PartID,
			//map_id: input.MapID,
			//region_id: input.RegionID,
			sector_id: input.SectorID,
			district_id: input.DistrictID,
			maplink: {
				map_id: input.MapID,
				mapareas: [],
			},
			areas: [],
			district_id: input.DistrictID,
			boundary: {
				en: input.Boundary,
			},
			gazetteer: input.GazetteerDistrict,
			speaker_ids: [],
			tribe_ids: [],
			notes: {
				recording: {
					en: input.Notes,
				},
			},
		};
		for (let i = 1; i <= 4; i++) {
			if (input['SpeakerID_' + i]) {
				output.speaker_ids.push(input['SpeakerID_' + i]);
			}
		}
		for (i = 1; i <= 3; i++) {
			if (input['Area_' + i] || input['TeReo_' + i]) {
				output.areas.push({
					name: {
						locale: {
							en: input['Area_' + i],
							mi: input['TeReo_' + i],
						},
					},
					links: {
						wikipedia: {
							en: input['WikiLink_' + i],
							mi: input['WikiMi_' + i],
						},
						wikidata: (input['WikiData_' + i] ? wikidataURL + input['WikiData_' + i] : null),
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
				output.tribe_ids.push(input['IwiID_' + i]);
			}
		}
		callback(null, utils.cleanobj(output));
	});
	openPipe('Ingoa - Zones.tsv', 'zone', transformCSVtoObject);
}

function importSpeakers() {
	const transformCSVtoObject = csv.transform(function(input, callback) {
		if (input.FirstName) {
			const output = {
				_id: input.ID,
				slug: {
					en: utils.createCode(input.PreferredName),
					mi: utils.createCode(input.PreferredName),
				},
				name: {
					locale: {
						mi: input.PreferredName,
					},
					alt: {
						ascii: utils.ascii(input.PreferredName),
						double: utils.double(input.PreferredName),
						full: [
							input.Prefix,
							input.FirstName,
							input.Nickname ? '(' + input.Nickname + ')' : null,
							input.MiddleNames,
							input.Surname,
							input.Suffix,
						].filter(a => a).join(' '),
					},
					parts: {
						nick: input.Nickname,
						title: input.Prefix,
						alternate: input.AlternateName,
						first: input.FirstName,
						middle: input.MiddleNames,
						last: input.Surname,
						suffix: input.Suffix,
					},
				},
				gender: input.Gender,
				notes: {
					description: {
						en: input.Notes,
					},
					recording: {
						en: input.Recording,
					},
				},
				location: {
					description: {
						en: input.Location,
					},
				},
				links: {
					info: input.URL,
				},
			};
			callback(null, utils.cleanobj(output));
		}
	});
	openPipe('Ingoa - Speakers.tsv', 'speaker', transformCSVtoObject);
}

function importFeatures() {
	const transformCSVtoObject = csv.transform(function(input, callback) {
		const output = {
			_id: input.ID,
			slug: {
				en: utils.createCode(input.Name || input.TeReo),
				mi: utils.createCode(input.TeReo || input.Name),
			},
			name: {
				locale: {
					en: input.Name === input.TeReo ? null : input.Name,
					mi: input.TeReo,
				},
				alt: {
					ascii: utils.ascii(input.TeReo),
					double: utils.double(input.TeReo),
					plural: input.Plural,
				},
			},
			order: input.Hierarchy,
			links: {
				wikipedia: {
					en: input.WikiLink,
					mi: input.WikiMi,
				},
				wikidata: (input.WikiData ? wikidataURL + input.WikiData : null),
			},
			category: {
				gazetteer: input.GazetteerName,
				osm: {
					class: input.OSMClass,
					type: input.OSMType,
					landuse: input.OSMLandUse,
				},
			},
		};
		callback(null, utils.cleanobj(output));
	});
	openPipe('Ingoa - Features.tsv', 'feature', transformCSVtoObject);
}

function importGroups() {
	const transformCSVtoObject = csv.transform(function(input, callback) {
		const output = {
			_id: input.ID,
			zone_id: input.ZoneID,
			slug: {
				en: utils.createCode(input.Name || input.TeReo),
				mi: utils.createCode(input.TeReo || input.Name),
			},
			name: {
				locale: {
					en: input.Name === input.TeReo ? null : input.Name,
					mi: input.TeReo,
				},
				alt: {
					ascii: utils.ascii(input.TeReo),
					double: utils.double(input.TeReo),
				},
			},
			feature_id: input.FeatureID,
			/*feature: {
				_id: input.FeatureID,
			},*/
			plural: input.FeaturePlural ? true : null,
			links: {
				wikipedia: {
					en: input.WikiLink,
					mi: input.WikiMi,
				},
				wikidata: (input.WikiData ? wikidataURL + input.WikiData : null),
				maorimaps: input.MaoriMaps,
			},
		};
		callback(null, utils.cleanobj(output));
	});
	openPipe('Ingoa - Groups.tsv', 'group', transformCSVtoObject);
}

function importTribes() {
	const transformCSVtoObject = csv.transform(function(input, callback) {
		const output = {
			_id: input.ID,
			slug: {
				en: utils.createCode(input.Name),
				mi: utils.createCode(input.Name),
			},
			name: {
				locale: {
					mi: input.Name,
				},
				alt: {
					ascii: utils.ascii(input.Name),
					double: utils.double(input.Name),
				},
			},
			metric: {
				population: parseInt(input["2013"]),
			},
			links: {
				wikipedia: {
					en: input.WikiLink,
					mi: input.WikiMi,
				},
				wikidata: (input.WikiData ? wikidataURL + input.WikiData : null),
			},
		};
		callback(null, utils.cleanobj(output));
	});
	openPipe('Ingoa - Iwi.tsv', 'tribe', transformCSVtoObject);
}

function importPlacenames() {
	const transformCSVtoObject = csv.transform(function(input, callback) {
		const output = {
			_id: input.ID,
			slug: {
				en: utils.createCode(input.IndexName_1),
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
			addendum_ids: [],
			notes: {
				name: {
					en: input.Note_Name,
				},
				speech: {
					en: input.Note_Speech,
				},
				spelling: {
					en: input.Note_Spelling,
				},
				place: {
					en: input.Note_Place,
				},
			},
		};
		const names = {};
		['IndexName_1', 'IndexName_2', 'IndexName_3', 'UnspokenName_1', 'ExtendedName_1', 'ExtendedName_2', 'VariantName_1', 'MisspelledName_1'].forEach(name => {
			if (input[name]) {
				const newname = {
					locale: {
						en: input.CommonName_1,
						mi: input[name],
					},
					alt: {
						ascii: utils.ascii(input[name]),
						double: utils.double(input[name]),
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
		for (let i = 1; i <= 3; i++) {
			if (input['IndexName_' + i]) {
				if (input['SpokenName_' + i]) {
					names[input['IndexName_' + i]].spoken = {
						start: parseFloat(input['Start_' + i]),
						end: parseFloat(input['End_' + i]),
						speaker_id: input['SpeakerID_' + i],
					};
					if (input['PhoneticName_' + i]) {
						names[input['IndexName_' + i]].alt.phonetic = {
							markdown: input['PhoneticName_' + i],
							html: utils.htmlItalics(input['PhoneticName_' + i]),
						};
					}
				}
			}
		}
		Object.keys(names).forEach((name, index) => {
			names[name]._id = 'na_' + input.ID + '-' + index;
			output.names.push(names[name]);
		});
		output.names[0].alt.transliteration = input.Transliteration;
		output.names = utils.cleanobj(output.names);
		for (i = 1; i <= 4; i++) {
			if (input['SeeNameID_' + i]) {
				output.see.push({
					zone_id: input['SeeZoneID_' + i],
					placename_id: input['SeeID_' + i],
					type: input.SeeType,
				});
			} else if (input['SeeZoneID_' + i]) {
				output.addendum_ids.push(input['SeeZoneID_' + i]);
			}
		}
		for (i = 1; i <= 7; i++) {
			if (input['Kind_' + i]) {
				const groups = [];
				if (input['Super_' + i]) {
					groups.push({
						group_id: 'gr_zo_' + input.ZoneID.slice(3) + '-' + input['Super_' + i],
						subgroup_id: input['Super_' + i + '.a'] ? 'gr_zo_' + input.ZoneID.slice(3) + '-' + input['Super_' + i] + '-' + input['Super_' + i + '.a'] : null,
					});
				}
				if (input['Super_' + i + '.1']) {
					groups.push({
						group_id: input['Super_' + i + '.1'] ? 'gr_zo_' + input.ZoneID.slice(3) + '-' + input['Super_' + i + '.1'] : null,
					});
				}
				output.places.push({
					_id: 'pl_' + input.ID + '-' + i,
					name: {
						locale: {
							en: input['KindName_' + i],
							mi: input.IndexName_1,
						},
						alt: {
							ascii: utils.ascii(input['KindName_' + i]),
							double: utils.double(input['KindName_' + i]),
						},
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

function importMeanings() {
	const transformCSVtoObject = csv.transform(function(input, callback) {
		const output = {
			_id: input.ID,
			slug: {
				en: utils.createCode(input.CleanedName),
				mi: utils.createCode(input.CleanedName),
			},
			name: {
				locale: {
					mi: input.CleanedName,
				},
				alt: {
					ascii: utils.ascii(input.CleanedName),
					double: utils.double(input.CleanedName),
				},
			},
			components: input.Components,
			translation: input.Meaning,
		};
		callback(null, utils.cleanobj(output));
	});
	openPipe('Ingoa - Meanings.tsv', 'meaning', transformCSVtoObject);
}

function importOverseas() {
	const transformCSVtoObject = csv.transform(function(input, callback) {
		const output = {
			_id: input.ID,
			location: input.Location,
			city: input.City,
			country: input.Country,
			position: {
				lat: input.Latitude,
				lng: input.Longitude,
			}
		};
		callback(null, utils.cleanobj(output));
	});
	openPipe('Ingoa - Overseas.tsv', 'overseas', transformCSVtoObject);
}

function importGazetteer() {
	let inputCSV = fs.createReadStream(path.join(sourcepath, 'gaz_names.csv'));
	const outputJSON = JSONStream.stringify('[\n', ',\n', '\n]\n');
	const outputToFile = fs.createWriteStream(path.join(jsonpath, 'gazetteer.json'));
	//const outputObjecttoDB = dbStream('gazetteer');
	const parseCSV = csv.parse({
		auto_parse: true,
		skip_empty_lines: true,
		columns: true,
	});
	const transformCSVtoObject = csv.transform(function(input, callback) {
		const output = {
			name: {
				en: input.name,
			},
			district: input.land_district,
			feature: input.feat_type,
			position: {
				lat: parseFloat(input.crd_latitude),
				lng: parseFloat(input.crd_longitude),
			},
		};
		callback(null, utils.cleanobj(output));
	});
	inputCSV
	.pipe(parseCSV)
	.pipe(transformCSVtoObject)
	.pipe(outputJSON)
	.pipe(outputToFile);
}

function importAll() {
	importIslands();
	importParts();
	importMaps();
	importRegions();
	importSectors();
	importDistricts();
	importZones();
	importSpeakers();
	importPlacenames();
	importFeatures();
	importTribes();
	importMeanings();
	importOverseas();
	importGroups();
	importGazetteer();
}

importAll();
