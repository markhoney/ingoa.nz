process.title = "apollo";
const {ApolloServer} = require('apollo-server');
const {importSchema} = require('graphql-import');
const typeDefs = importSchema('./src/server/apollo/schema.graphql');

//const db = require('../db/nedb');
//const resolvers = require('./resolvers.db')(db);

const db = require('../db/memory');
const resolvers = require('./resolvers.mem')(db);

const server = new ApolloServer({
	typeDefs,
	resolvers,
	tracing: process.env.dev,
	engine: (process.env.dev ? {apiKey: "service:ingoa:78h4D9zEtDLOy15k554-IA"} : null)
});

server.listen().then(({url}) => {
	console.log(`🚀 Server ready at ${url}`);
});
