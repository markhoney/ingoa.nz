const consola = require('consola');
//const {Nuxt, Builder} = require('nuxt');
const express = require('express');
const app = express();

// Added code

// const db = require('db/nedb')(false);
const db = require('./server/db/memory');

// Root

//const apis = ['rest', 'graphql'];
const apis = ['graphql'];

/*app.get('/api/', function (req, res) {
	const base = req.originalUrl + (req.originalUrl.endsWith('/') ? '' : '/');
	res.send(apis.map(collection => {
		return {
			name: collection,
			link: base + collection
		};
	}));
});*/

// GraphQL

if (apis.includes('graphql')) {
	const {importSchema} = require('graphql-import');
	const typeDefs = importSchema('./src/server/apollo/schema.graphql');
	//const resolvers = require('./resolvers')(db);
	const resolvers = require('./server/apollo/resolvers.mem')(db);
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

// End of added code

// Import and Set Nuxt.js options
//let config = require('../nuxt.config.js');
//config.dev = process.env.NODE_ENV !== 'production';

async function start() {
	// Init Nuxt.js
//	const nuxt = new Nuxt(config);

//	const {host, port} = nuxt.options.server;

	// Build only in dev mode
/*	if (config.dev) {
		const builder = new Builder(nuxt);
		await builder.build();
	} else {
		await nuxt.ready();
	}*/

	// Give nuxt middleware to express
//	app.use(nuxt.render);

	// Listen the server
	app.listen(port, host);
	consola.ready({
		message: `Server listening on http://${host}:${port}`,
		badge: true
	});
}

start();
