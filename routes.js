import {execute, makePromise} from 'apollo-link';
import {createHttpLink} from 'apollo-link-http';
const fetch = require('node-fetch');
import gql from 'graphql-tag';

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
	}`})).then(data => {
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
			...data.islands.map(island => 'island/' + island.code),
			...data.regions.map(region => 'region/' + region.code),
			...data.zones.map(zone => 'zone/' + zone.code),
			...data.zones.map(zone => 'old/' + zone.code),
			...data.speakers.map(speaker => 'speaker/' + speaker.code),
			...data.groups.map(group => 'group/' + group.code),
			...data.features.map(feature => 'feature/' + feature.code),
			...data.ngaiwi.map(iwi => 'iwi/' + iwi.code),
			...data.placenames.map(placename => 'placename/' + placename.code),
		];
	}).catch(error => console.log(`received error ${error}`))
}
