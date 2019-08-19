const consola = require('consola');
//if (process.env.NODE_ENV != 'production') require('appmetrics-dash').attach({url: '/metrics', console: consola, title: 'GraphQL'});
process.title = "apollo";
const {ApolloServer} = require('apollo-server');
const {importSchema} = require('graphql-import');
const typeDefs = importSchema('./src/server/apollo/schema.graphql');

require('dotenv').config();

let resolvers;

if (process.argv.length > 2 && process.argv[2] == 'nedb') {
	const db = require('../db/nedb');
	resolvers = require('./resolvers.db')(db);
} else {
	const db = require('../db/memory');
	resolvers = require('./resolvers')(db);
}

const server = new ApolloServer({
	typeDefs,
	resolvers,
	tracing: process.env.dev,
	//engine: (process.env.dev ? {apiKey: process.env.APOLLO_ENGINE_KEY} : null)
	engine: (process.env.NODE_ENV == 'production' ? null : {apiKey: process.env.APOLLO_ENGINE_KEY})
});

server.listen().then(({url}) => {
	//console.log((process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1) + " MB used");
	consola.ready({
		message: `Server ready at ${url}\nMetrics ready at ${url}metrics/`,
		badge: true
	});
});
