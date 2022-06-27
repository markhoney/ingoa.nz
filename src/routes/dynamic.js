const {execute, makePromise} = require('apollo-link');
const {createHttpLink} = require('apollo-link-http');
const fetch = require('node-fetch');
const gql = require('graphql-tag');

const en = require('../client/locales/en.json');
const mi = require('../client/locales/mi.json');
const utils = require('../server/db/utils');

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
	sectors {
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
		utils.createCode(en.island),
		utils.createCode(mi.island),
		utils.createCode(en.part),
		utils.createCode(mi.part),
		utils.createCode(en.map),
		utils.createCode(mi.map),
		utils.createCode(en.region),
		utils.createCode(mi.region),
		utils.createCode(en.sector),
		utils.createCode(mi.sector),
		utils.createCode(en.district),
		utils.createCode(mi.district),
		utils.createCode(en.zone),
		utils.createCode(mi.zone),
		utils.createCode(en.tribe),
		utils.createCode(mi.tribe),
		utils.createCode(en.speaker),
		utils.createCode(mi.speaker),
		utils.createCode(en.feature),
		utils.createCode(mi.feature),
		utils.createCode(en.group),
		utils.createCode(mi.group),
		utils.createCode(en.placename),
		utils.createCode(mi.placename),
		utils.createCode(en.about),
		utils.createCode(mi.about),
		"old",
		"old/contents",
	];
	return [
		...staticRoutes,
		...response.data.islands.map(island => '/' + [utils.createCode(en.island), island.slug.en].join("/")),
		...response.data.islands.map(island => '/mi/' + [utils.createCode(mi.island), island.slug.mi].join("/")),
		...response.data.parts.map(part => '/' + [utils.createCode(en.part), part.slug.en].join("/")),
		...response.data.parts.map(part => '/mi/' + [utils.createCode(mi.part), part.slug.mi].join("/")),
		...response.data.maps.map(map => '/' + [utils.createCode(en.map), map.slug.en].join("/")),
		...response.data.maps.map(map => '/mi/' + [utils.createCode(mi.map), map.slug.mi].join("/")),
		...response.data.regions.map(region => '/' + [utils.createCode(en.region), region.slug.en].join("/")),
		...response.data.regions.map(region => '/mi/' + [utils.createCode(mi.region), region.slug.mi].join("/")),
		...response.data.zones.map(zone => '/' + ['old', zone.slug.en].join("/")),
		...response.data.zones.map(zone => '/' + [utils.createCode(en.zone), zone.slug.en].join("/")),
		...response.data.zones.map(zone => '/mi/' + [utils.createCode(mi.zone), zone.slug.mi].join("/")),
		...response.data.tribes.map(tribe => '/' + [utils.createCode(en.tribe), tribe.slug.en].join("/")),
		...response.data.tribes.map(tribe => '/mi/' + [utils.createCode(mi.tribe), tribe.slug.mi].join("/")),
		...response.data.speakers.map(speaker => '/' + [utils.createCode(en.speaker), speaker.slug.en].join("/")),
		...response.data.speakers.map(speaker => '/mi/' + [utils.createCode(mi.speaker), speaker.slug.mi].join("/")),
		...response.data.features.map(feature => '/' + [utils.createCode(en.feature), feature.slug.en].join("/")),
		...response.data.features.map(feature => '/mi/' + [utils.createCode(mi.feature), feature.slug.mi].join("/")),
		...response.data.groups.map(group => '/' + [utils.createCode(en.group), group.zone.slug.en, group.slug.en].join("/")),
		...response.data.groups.map(group => '/mi/' + [utils.createCode(mi.group), group.zone.slug.mi, group.slug.mi].join("/")),
		//...response.data.placenames.map(placename => '/' + [utils.createCode(placename), (placename.zone ? placename.zone.slug.en : (placename.island ? placename.island.slug.en : placename.part.slug.en)), placename.slug.en].join("/")),
		//...response.data.placenames.map(placename => '/mi/' + [utils.createCode(mi.placename), (placename.zone ? placename.zone.slug.mi : (placename.island ? placename.island.slug.mi : placename.part.slug.mi)), placename.slug.mi].join("/")),
		//...response.data.placenames.map(placename => '/' + [utils.createCode(placename), (placename.zone ? placename.zone.slug.en : (placename.island ? 'island/' + placename.island.slug.en : 'part/' + placename.part.slug.en)), placename.slug.en].join("/")),
		//...response.data.placenames.map(placename => '/mi/' + [utils.createCode(mi.placename), (placename.zone ? placename.zone.slug.mi : (placename.island ? 'island/' + placename.island.slug.mi : 'part/' + placename.part.slug.mi)), placename.slug.mi].join("/")),
	];
}).catch(error => console.log(`Received error ${error}`));
