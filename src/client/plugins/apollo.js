import {InMemoryCache} from 'apollo-cache-inmemory';
import {persistCache} from 'apollo-cache-persist';

export default function() {
	const cache = new InMemoryCache();
	if (process.browser) persistCache({
		cache,
		storage: window.localStorage,
		//storage: window.sessionStorage,
		//maxSize: 134217728,
		maxSize: 5242880,
		debug: process.env.NODE_ENV !== 'production',
	});
	return {
		httpEndpoint: '/graphql',
		//wsEndpoint: 'ws://' + (process.env.HOST || 'localhost') + ':' + (process.env.PORT || 3000) + '/' // + '/graphql',
		//addTypename: false,
		persisting: true,
		cache,
	};
}
