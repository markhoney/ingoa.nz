const {execute, makePromise} = require('apollo-link');
const {createHttpLink} = require('apollo-link-http');
const fetch = require('node-fetch');
const gql = require('graphql-tag');

const mi = require('../client/locales/mi.json');

module.exports = makePromise(execute(createHttpLink({uri: 'http://localhost:4000/graphql', fetch: fetch}), {query: gql`{
	islands {
		slug {
			en
			mi
		}
	}
	parts {
		slug {
			en
			mi
		}
	}
	maps {
		slug {
			en
			mi
		}
	}
	regions {
		slug {
			en
			mi
		}
	}
	zones {
		slug {
			en
			mi
		}
	}
	speakers {
		slug {
			en
			mi
		}
	}
	features {
		slug {
			en
			mi
		}
	}
	groups {
		slug {
			en
			mi
		}
		zone {
			slug {
				en
				mi
			}
		}
	}
	tribes {
		slug {
			en
			mi
		}
	}
	placenames {
		slug {
			en
			mi
		}
		zone {
			slug {
				en
				mi
			}
		}
		island {
			slug {
				en
				mi
			}
		}
		part {
			slug {
				en
				mi
			}
		}
	}
}`})).then(response => {
	const staticRoutes = [
		"island",
		mi.island,
		"part",
		mi.part,
		"map",
		mi.map,
		"region",
		mi.region,
		"zone",
		mi.zone,
		"tribe",
		mi.tribe,
		"speaker",
		mi.speaker,
		"feature",
		mi.feature,
		"group",
		mi.group,
		"placename",
		mi.placename,
		"about",
		mi.about,
		"old",
		"old/contents",
	];
	return [
		...staticRoutes,
		...response.data.islands.map(island => '/' + ['island', island.slug.en].join("/")),
		...response.data.islands.map(island => '/mi/' + [mi.island, island.slug.mi].join("/")),
		...response.data.parts.map(part => '/' + ['part', part.slug.en].join("/")),
		...response.data.parts.map(part => '/mi/' + [mi.part, part.slug.mi].join("/")),
		...response.data.maps.map(map => '/' + ['map', map.slug.en].join("/")),
		...response.data.maps.map(map => '/mi/' + [mi.map, map.slug.mi].join("/")),
		...response.data.regions.map(region => '/' + ['region', region.slug.en].join("/")),
		...response.data.regions.map(region => '/mi/' + [mi.region, region.slug.mi].join("/")),
		...response.data.zones.map(zone => '/' + ['old', zone.slug.en].join("/")),
		...response.data.zones.map(zone => '/' + ['zone', zone.slug.en].join("/")),
		...response.data.zones.map(zone => '/mi/' + [mi.zone, zone.slug.mi].join("/")),
		...response.data.tribes.map(tribe => '/' + ['tribe', tribe.slug.en].join("/")),
		...response.data.tribes.map(tribe => '/mi/' + [mi.tribe, tribe.slug.mi].join("/")),
		...response.data.speakers.map(speaker => '/' + ['speaker', speaker.slug.en].join("/")),
		...response.data.speakers.map(speaker => '/mi/' + [mi.speaker, speaker.slug.mi].join("/")),
		...response.data.features.map(feature => '/' + ['feature', feature.slug.en].join("/")),
		...response.data.features.map(feature => '/mi/' + [mi.feature, feature.slug.mi].join("/")),
		...response.data.groups.map(group => '/' + ['group', group.zone.slug.en, group.slug.en].join("/")),
		...response.data.groups.map(group => '/mi/' + [mi.group, group.zone.slug.mi, group.slug.mi].join("/")),
		//...response.data.placenames.map(placename => '/' + ['placename', (placename.zone ? placename.zone.slug.en : (placename.island ? placename.island.slug.en : placename.part.slug.en)), placename.slug.en].join("/")),
		//...response.data.placenames.map(placename => '/mi/' + [mi.placename, (placename.zone ? placename.zone.slug.mi : (placename.island ? placename.island.slug.mi : placename.part.slug.mi)), placename.slug.mi].join("/")),
		//...response.data.placenames.map(placename => '/' + ['placename', (placename.zone ? placename.zone.slug.en : (placename.island ? 'island/' + placename.island.slug.en : 'part/' + placename.part.slug.en)), placename.slug.en].join("/")),
		//...response.data.placenames.map(placename => '/mi/' + [mi.placename, (placename.zone ? placename.zone.slug.mi : (placename.island ? 'island/' + placename.island.slug.mi : 'part/' + placename.part.slug.mi)), placename.slug.mi].join("/")),
	];
}).catch(error => console.log(`Received error ${error}`));