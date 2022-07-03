require('dotenv').config();
require('events').EventEmitter.prototype._maxListeners = 20;
const {existsSync, mkdirSync, writeFileSync, statSync} = require('fs');
const path = require('path');
const utils = require('./utils');
const {getSheet} = require('./googleapi.js');

const jsonpath = path.join(__dirname, 'json');

const wikidataURL = 'https://www.wikidata.org/wiki/';

if (!existsSync(jsonpath)) {
	mkdirSync(jsonpath, 744);
}

function getName(input) {
	return {
		locale: {
			en: input.Name === input.TeReo ? null : input.Name,
			mi: input.TeReo,
		},
		ascii: {
			mi: utils.ascii(input.TeReo),
		},
		double: {
			mi: utils.double(input.TeReo),
		},
		plural: {
			en: input.Plural,
		},
		full: {
			en: input.FullName,
		},
	};
}

function getSlug(input) {
	return {
		en: utils.createCode(input.Name || input.TeReo),
		mi: utils.createCode(input.TeReo || input.Name),
	};
}

function getAudio(input, type) {
	const audioLocation = `/audio/${type}/${input.ID}.mp3`;
	if (existsSync('static' + audioLocation)) return {
		file: audioLocation,
		length: input.AudioLength,
		size: statSync('static' + audioLocation).size,
	};
}

function getLinks(input) {
	return {
		wikipedia: {
			en: input.WikiLink,
			mi: input.WikiMi,
		},
		wikidata: (input.WikiData ? wikidataURL + input.WikiData : null),
		info: input.URL,
		maorimaps: input.MaoriMaps,
	};
}

function getFunding(input) {
	return [
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
	];
}

function getDates(input) {
	return {
		start: input.Start,
		end: input.End,
		launch: input.Launch,
	};
}

function getMetrics(input) {
	return {
		area: parseInt(input.Area),
		population: parseInt(input.Population),
	};
}

function getLocation(input) {
	return {
		description: {
			en: input.Location,
		},
		city: input.City,
		country: input.Country,
		position: {
			lat: parseFloat(input.Latitude || input.crd_latitude),
			lng: parseFloat(input.Longitude || input.crd_longitude),
		},
		boundary: {
			en: input.Boundary,
		},
		travelled: {
			km: parseInt(input.DistanceKM),
		},
	};
}

function getNotes(input) {
	return {
		description: {
			en: input.Note_Description,
		},
		creation: {
			en: input.Note_Text,
		},
		recording: {
			en: input.Note_Recording,
		},
		funding: {
			en: input.Note_Funding,
		},
		format: {
			en: input.Format,
		},
		location: {
			en: input.Note_Location,
		},
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
	};
}

function getBase(input, type) {
	return {
		id: input.ID,
		//index: parseInt(input.Number - 1),
		name: getName(input),
		slug: getSlug(input),
		audio: getAudio(input, type),
		links: getLinks(input),
		funding: getFunding(input),
		dates: getDates(input),
		metrics: getMetrics(input),
		location: getLocation(input),
		notes: getNotes(input),
	};
}

const imports = {
	islands: (input) => {
		const audioLocation = input.ID === 'is_3' ? '' : '/audio/island/' + input.ID + '.mp3';
		const output = {
			...getBase(input, 'island'),
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
		return output;
	},
	parts: (input) => {
		const output = {
			...getBase(input, 'part'),
			number: parseInt(input.Number),
			island_id: input.IslandID,
		};
		return output;
	},
	maps: (input) => {
		const output = {
			...getBase(input),
			island_id: input.IslandID,
			part_id: input.PartID,
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
		return output;
	},
	regions: (input) => {
		const output = {
			...getBase(input),
			island_id: input.IslandID,
			part_id: input.PartID,
			map_id: input.MapID,
		};
		return output;
	},
	sectors: (input) => {
		const output = {
			...getBase(input),
			island_id: input.IslandID,
			part_id: input.PartID,
			map_id: input.MapID,
		};
		return output;
	},
	districts: (input) => {
		const output = {
			...getBase(input),
			island_id: input.IslandID,
			//part_id: input.PartID,
			//map_id: input.MapID,
			region_id: input.RegionID,
			sector_id: input.SectorID,
			seat: input.Seat,
		};
		return output;
	},
	zones: (input) => {
		const output = {
			...getBase(input, 'zone'),
			number: parseInt(input.Number),
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
			gazetteer: input.GazetteerDistrict,
			speaker_ids: [],
			iwi_ids: [],
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
				output.iwi_ids.push(input['IwiID_' + i]);
			}
		}
		return output;
	},
	speakers: (input) => {
		const output = {
			...getBase(input),
			gender: input.Gender,
		};
		output.name.full = {
			en: [
				input.Prefix,
				input.FirstName,
				input.Nickname ? '(' + input.Nickname + ')' : null,
				input.MiddleNames,
				input.Surname,
				input.Suffix,
			].filter(a => a).join(' '),
		};
		output.name.parts = {
			nick: input.Nickname,
			title: input.Prefix,
			alternate: input.AlternateName,
			first: input.FirstName,
			middle: input.MiddleNames,
			last: input.Surname,
			suffix: input.Suffix,
		};
		return output;
	},
	features: (input) => {
		const output = {
			...getBase(input),
			order: input.Hierarchy,
			category: {
				gazetteer: input.GazetteerName,
				osm: {
					class: input.OSMClass,
					type: input.OSMType,
					landuse: input.OSMLandUse,
				},
			},
		};
		return output;
	},
	groups: (input) => {
		const output = {
			...getBase(input),
			zone_id: input.ZoneID,
			feature_id: input.FeatureID,
			plural: input.FeaturePlural ? true : null,
		};
		return output;
	},
	iwi: (input) => {
		const output = {
			...getBase(input),
		};
		return output;
	},
	placenames: (input) => {
		const output = {
			...getBase(input),
			number: parseInt(input.Number),
			zone_id: input.ZoneID,
			part_id: input.PartID,
			island_id: input.IslandID,
			featured: input.Featured ? true : null,
			names: [],
			places: [],
			see: [],
			addendum: {
				zone_ids: [],
			},
		};
		const names = {};
		['IndexName_1', 'IndexName_2', 'IndexName_3', 'UnspokenName_1', 'ExtendedName_1', 'ExtendedName_2', 'VariantName_1', 'MisspelledName_1'].forEach(name => {
			if (input[name]) {
				const newname = {
					name: {
						locale: {
							en: input.CommonName_1,
							mi: input[name],
						},
						ascii: {
							mi: utils.ascii(input[name]),
						},
						double: {
							mi: utils.double(input[name]),
						},
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
						names[input['IndexName_' + i]].phonetic = {
							plain: {mi: input['PhoneticName_' + i].split("_").join("")},
							markdown: {mi: input['PhoneticName_' + i]},
							html: {mi: utils.htmlItalics(input['PhoneticName_' + i])},
						};
					}
				}
			}
		}
		Object.keys(names).forEach((name, index) => {
			names[name].id = 'na_' + input.ID + '-' + index;
			output.names.push(names[name]);
		});
		output.names[0].name.transliteration = {en: input.Transliteration};
		output.names = utils.cleanobj(output.names);
		for (i = 1; i <= 4; i++) {
			if (input['SeeNameID_' + i]) {
				output.see.push({
					zone_id: input['SeeZoneID_' + i],
					placename_id: input['SeeID_' + i],
					type: input.SeeType,
				});
			} else if (input['SeeZoneID_' + i]) {
				output.addendum.zone_ids.push(input['SeeZoneID_' + i]);
			}
		}
		for (i = 1; i <= 7; i++) {
			if (input['Kind_' + i]) {
				const groups = [];
				if (input['Super_' + i]) {
					groups.push({
						group_id: 'gr_zo_' + input.ZoneID.slice(3) + '-' + input['Super_' + i],
						sub: {
							group_id: input['Super_' + i + '.a'] ? 'gr_zo_' + input.ZoneID.slice(3) + '-' + input['Super_' + i] + '-' + input['Super_' + i + '.a'] : null,
						},
					});
				}
				if (input['Super_' + i + '.1']) {
					groups.push({
						group_id: input['Super_' + i + '.1'] ? 'gr_zo_' + input.ZoneID.slice(3) + '-' + input['Super_' + i + '.1'] : null,
					});
				}
				output.places.push({
					id: 'pl_' + input.ID + '-' + i,
					name: {
						locale: {
							en: input['KindName_' + i],
							mi: input.IndexName_1,
						},
						alt: {
							mi: {
								ascii: utils.ascii(input['KindName_' + i]),
								double: utils.double(input['KindName_' + i]),
							},
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
		return output;
	},
	meanings: (input) => {
		const output = {
			...getBase(input),
			components: input.Components,
			translation: input.Meaning,
		};
		return output;
	},
	overseas: (input) => {
		const output = {
			...getBase(input),
		};
		return output;
	},
	gazetteer: (input) => {
		const output = {
			name: {
				en: input.name,
			},
			district: input.land_district,
			feature: input.feat_type,
		};
		return output;
	},
};

const sheets = {
	ingoa: '100v99De8wK91CW9iR7Ma6fkmePepiH7T-XqxiMIPlp4',
	gazetteer: '1PVqlKVo4X6fjDaLwEMHRRfqU0SIU_KXT2FM-kIPyWVk',
};

async function getData(page, sheet, tab = page.charAt(0).toUpperCase() + page.slice(1)) {
	console.log('Importing', page);
	const table = await getSheet(sheet, tab);
	console.log('Processing', page);
	const data = table.map((item) => utils.cleanobj(imports[page](item)));
	if (require.main === module) {
		console.log('Writing', page);
		writeFileSync(path.join(jsonpath, page.toLowerCase() + '.json'), JSON.stringify(utils.cleanobj(data), null, '\t'));
	}
	return data;
}

const pages = Object.keys(imports);

module.exports = async () => {
	const db = {};
	for (const page of pages) {
		if (page === 'gazetteer') db[page] = await getData(page, sheets.gazetteer, 'gaz_names.csv');
		else db[page] = await getData(page, sheets.ingoa);
	}
	return db;
};

// if run directly
if (require.main === module) {
	module.exports();
}
