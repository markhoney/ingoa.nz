import {InMemoryCache} from 'apollo-cache-inmemory';
import {persistCache} from 'apollo-cache-persist';

console.log(process.client);
console.log(process.env.graphClient);


export default function() {
	const cache = new InMemoryCache();
	if (process.client) persistCache({
		cache,
		storage: window.localStorage,
		//storage: window.sessionStorage,
		//maxSize: 134217728,
		maxSize: 5242880,
		debug: process.env.dev,
	});
	return {
		httpEndpoint: (process.client ? process.env.graphClient : process.env.graphServer),
		//addTypename: false,
		persisting: true,
		cache,
	};
}
