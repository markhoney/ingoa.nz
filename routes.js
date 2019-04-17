const {execute, makePromise} = require('apollo-link');
const {createHttpLink} = require('apollo-link-http');
const fetch = require('node-fetch');
const gql = require('graphql-tag');

export default function() {
	return makePromise(execute(createHttpLink({uri: 'http://localhost:4000/graphql', fetch: fetch}), {query: gql`{
		islands {
			code
		}
		regions {
			code
		}
		zones {
			code
		}
		speakers {
			code
		}
		groups {
			code
		}
		features {
			code
		}
		ngaiwi {
			code
		}
		placenames {
			code
		}
	}`})).then(response => {
		const staticRoutes = [
			"about",
			"region",
			"island",
			"map",
			"zone",
			"speaker",
			"feature",
			"group",
			"iwi",
			"old",
			"old/contents",
		];
		return [
			...staticRoutes,
			...response.data.islands.map(island => '/island/' + island.code),
			...response.data.regions.map(region => '/region/' + region.code),
			...response.data.zones.map(zone => '/zone/' + zone.code),
			...response.data.zones.map(zone => '/old/' + zone.code),
			...response.data.speakers.map(speaker => '/speaker/' + speaker.code),
			...response.data.groups.map(group => '/group/' + group.code),
			...response.data.features.map(feature => '/feature/' + feature.code),
			...response.data.ngaiwi.map(iwi => '/iwi/' + iwi.code),
			...response.data.placenames.map(placename => '/placename/' + placename.code),
		];
	}).catch(error => console.log(`received error ${error}`))
}
