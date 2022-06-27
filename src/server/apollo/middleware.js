const {ApolloServer} = require('apollo-server-express');
const {importSchema} = require('graphql-import');
const typeDefs = importSchema('./src/server/apollo/schema.graphql');

//const express = require('express');
//const app = express();

const connect = require('connect');
const app = connect();

//const db = require('../db/nedb');
//const resolvers = require('./resolvers.nedb')(db);
const db = require('../db/memory');
const resolvers = require('./resolvers')(db);
const server = new ApolloServer({
	typeDefs,
	resolvers,
});

server.applyMiddleware({app});

export default app;

/*export default {
	path: '/graphql',
	handler: app
};*/
