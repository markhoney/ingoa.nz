require('dotenv').config();
require('events').EventEmitter.prototype._maxListeners = 20;
const {existsSync, mkdirSync, writeFileSync, statSync} = require('fs');
const path = require('path');
const utils = require('../server/db/utils');
const {getSheet} = require('./googleapi.js');

const jsonpath = path.join(__dirname, '..', 'server', 'db', 'json');

const wikidataURL = 'https://www.wikidata.org/wiki/';

if (!existsSync(jsonpath)) {
	mkdirSync(jsonpath, 744);
}

const imports = {
	islands: (input) => {
		const audioLocation = input.ID === 'is_3' ? '' : '/audio/island/' + input.ID + '.mp3';
		const output = {
			id: input.ID,
			//index: parseInt(input.Number - 1),
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
					mi: {
						ascii: utils.ascii(input.TeReo),
						double: utils.double(input.TeReo),
					},
				},
			},
			audio: {
				file: audioLocation,
				length: input.AudioLength,
				size: audioLocation ? statSync('src/client/static' + audioLocation).size : 0,
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
		return output;
	},
	parts: (input) => {
		const audioLocation = '/audio/part/' + input.ID + '.mp3';
		const output = {
			id: input.ID,
			//index: parseInt(input.Number - 1),
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
					mi: {
						ascii: utils.ascii(input.TeReo),
						double: utils.double(input.TeReo),
					},
				},
			},
			audio: {
				file: audioLocation,
				length: input.AudioLength,
				size: statSync('src/client/static' + audioLocation).size,
			},
			island_id: input.IslandID,
			/*island: {
				id: input.IslandID,
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
		return output;
	},
	maps: (input) => {
		const output = {
			id: input.ID,
			//index: parseInt(input.Number - 1),
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
					mi: {
						ascii: utils.ascii(input.TeReo),
						double: utils.double(input.TeReo),
					},
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
		return output;
	},
	regions: (input) => {
		const output = {
			id: input.ID,
			//index: parseInt(input.Number - 1),
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
					mi: {
						ascii: utils.ascii(input.TeReo),
						double: utils.double(input.TeReo),
					},
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
		return output;
	},
	sectors: (input) => {
		const output = {
			id: input.ID,
			//index: parseInt(input.Number - 1),
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
					mi: {
						ascii: utils.ascii(input.TeReo),
						double: utils.double(input.TeReo),
					},
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
		return output;
	},
	districts: (input) => {
		const output = {
			id: input.ID,
			//index: parseInt(input.Number - 1),
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
					mi: {
						ascii: utils.ascii(input.TeReo),
						double: utils.double(input.TeReo),
					},
					en: {
						full: input.FullName,
					},
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
		return output;
	},
	zones: (input) => {
		const audioLocation = '/audio/zone/' + input.ID + '.mp3';
		const output = {
			id: input.ID,
			//index: parseInt(input.Number - 1),
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
					mi: {
						ascii: utils.ascii(input.TeReo),
						double: utils.double(input.TeReo),
					},
				},
			},
			audio: {
				file: audioLocation,
				length: input.AudioLength,
				size: statSync('src/client/static' + audioLocation).size,
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
		return output;
	},
	speakers: (input) => {
		const output = {
			id: input.ID,
			//index: parseInt(input.Number - 1),
			slug: {
				en: utils.createCode(input.PreferredName),
				mi: utils.createCode(input.PreferredName),
			},
			name: {
				locale: {
					mi: input.PreferredName,
				},
				alt: {
					mi: {
						ascii: utils.ascii(input.PreferredName),
						double: utils.double(input.PreferredName),
					},
					en: {
							full: [
							input.Prefix,
							input.FirstName,
							input.Nickname ? '(' + input.Nickname + ')' : null,
							input.MiddleNames,
							input.Surname,
							input.Suffix,
						].filter(a => a).join(' '),
					},
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
		return output;
	},
	features: (input) => {
		const output = {
			id: input.ID,
			//index: parseInt(input.Number - 1),
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
					mi: {
						ascii: utils.ascii(input.TeReo),
						double: utils.double(input.TeReo),
					},
					en: {
						plural: input.Plural,
					},
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
		return output;
	},
	groups: (input) => {
		const output = {
			id: input.ID,
			//index: parseInt(input.Number - 1),
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
					mi: {
						ascii: utils.ascii(input.TeReo),
						double: utils.double(input.TeReo),
					},
				},
			},
			feature_id: input.FeatureID,
			/*feature: {
				id: input.FeatureID,
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
		return output;
	},
	iwi: (input) => {
		const output = {
			id: input.ID,
			//index: parseInt(input.Number - 1),
			slug: {
				en: utils.createCode(input.Name),
				mi: utils.createCode(input.Name),
			},
			name: {
				locale: {
					mi: input.Name,
				},
				alt: {
					mi: {
						ascii: utils.ascii(input.Name),
						double: utils.double(input.Name),
					},
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
		return output;
	},
	placenames: (input) => {
		const output = {
			id: input.ID,
			//index: parseInt(input.Number),
			number: parseInt(input.Number),
			slug: {
				en: utils.createCode(input.IndexName_1),
				mi: utils.createCode(input.IndexName_1),
			},
			zone_id: input.ZoneID,
			part_id: input.PartID,
			island_id: input.IslandID,
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
						mi: {
							ascii: utils.ascii(input[name]),
							double: utils.double(input[name]),
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
						names[input['IndexName_' + i]].alt.mi.phonetic = {
							plain: input['PhoneticName_' + i].split("_").join(""),
							markdown: input['PhoneticName_' + i],
							html: utils.htmlItalics(input['PhoneticName_' + i]),
						};
					}
				}
			}
		}
		Object.keys(names).forEach((name, index) => {
			names[name].id = 'na_' + input.ID + '-' + index;
			output.names.push(names[name]);
		});
		output.names[0].alt.en = {transliteration: input.Transliteration};
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
			id: input.ID,
			//index: parseInt(input.Number - 1),
			slug: {
				en: utils.createCode(input.CleanedName),
				mi: utils.createCode(input.CleanedName),
			},
			name: {
				locale: {
					mi: input.CleanedName,
				},
				alt: {
					mi: {
						ascii: utils.ascii(input.CleanedName),
						double: utils.double(input.CleanedName),
					},
				},
			},
			components: input.Components,
			translation: input.Meaning,
		};
		return output;
	},
	overseas: (input) => {
		const output = {
			id: input.ID,
			location: input.Location,
			city: input.City,
			country: input.Country,
			position: {
				lat: input.Latitude,
				lng: input.Longitude,
			}
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
			position: {
				lat: parseFloat(input.crd_latitude),
				lng: parseFloat(input.crd_longitude),
			},
		};
		return output;
	},
};

const sheets = {
	ingoa: '100v99De8wK91CW9iR7Ma6fkmePepiH7T-XqxiMIPlp4',
	gazetteer: '1PVqlKVo4X6fjDaLwEMHRRfqU0SIU_KXT2FM-kIPyWVk',
};

async function cache(page, sheet, tab = page.charAt(0).toUpperCase() + page.slice(1)) {
	console.log('Importing', page);
	const table = await getSheet(sheet, tab);
	console.log('Processing', page);
	const data = table.map((item) => utils.cleanobj(imports[page](item)));
	console.log('Writing', page);
	writeFileSync(path.join(jsonpath, page.toLowerCase() + '.json'), JSON.stringify(utils.cleanobj(data), null, '\t'));
}

const pages = Object.keys(imports);

async function importAll() {
	const data = {};
	for (const page of pages) {
		if (page === 'gazetteer') cache(page, sheets.gazetteer, 'gaz_names.csv');
		else cache(page, sheets.ingoa);
	}
}

importAll();
