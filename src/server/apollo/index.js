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
	resolvers = require('./resolvers.mem')(db);
}

const server = new ApolloServer({
	typeDefs,
	resolvers,
	tracing: process.env.dev,
	engine: (process.env.dev ? {apiKey: process.env.APOLLO_ENGINE_KEY} : null)
});

server.listen().then(({url}) => {
	console.log(`🚀 Server ready at ${url}`);
});
