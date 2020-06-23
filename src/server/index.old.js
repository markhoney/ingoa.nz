const consola = require('consola');
const express = require('express');
const app = express();

// const db = require('db/nedb')(false);
const db = require('./server/db/memory');

const apis = ['rest', 'graphql'];

app.get('/api/', function (req, res) {
	const base = req.originalUrl + (req.originalUrl.endsWith('/') ? '' : '/');
	res.send(apis.map(collection => {
		return {
			name: collection,
			link: base + collection
		};
	}));
});

// GraphQL

if (apis.includes('graphql')) {
	const {importSchema} = require('graphql-import');
	const typeDefs = importSchema('./src/server/apollo/schema.graphql');
	//const resolvers = require('./resolvers')(db);
	const resolvers = require('./server/apollo/resolvers')(db);
	const {ApolloServer} = require('apollo-server-express');
	const server = new ApolloServer({
		typeDefs,
		resolvers,
	});
	server.applyMiddleware({
		app,
		path: '/graphql'
	});
}
// REST

if (apis.includes('rest')) {
	const rest = require('express-nedb-rest')();
	for (var collection in db) {
		rest.addDatastore(collection, db[collection]);
	}
	app.use('/api', rest);
}

const host = 'localhost';
const port = 4000;

async function start() {
	app.listen(port, host);
	consola.ready({
		message: `Server listening on http://${host}:${port}`,
		badge: true,
	});
}

start();
