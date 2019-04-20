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
});

server.listen().then(({url}) => {
	console.log(`🚀 Server ready at ${url}`);
});
