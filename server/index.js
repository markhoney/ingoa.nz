const express = require('express');
const consola = require('consola');
const {Nuxt, Builder} = require('nuxt');
const app = express();

// Added code

// const db = require('../apollo-server/db/nedb')(false);
const db = require('../apollo-server/db/memory');

// Root

//const apis = ['rest', 'graphql'];
const apis = ['graphql'];

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
	const typeDefs = importSchema('./apollo-server/schema.graphql');
	//const resolvers = require('../apollo-server/resolvers')(db);
	const resolvers = require('../apollo-server/resolvers.mem')(db);
	const {ApolloServer} = require('apollo-server-express');
	const graphqlPath = '/api/graphql';
	const server = new ApolloServer({
		typeDefs,
		resolvers,
		tracing: !(process.env.NODE_ENV === 'production'),
		playground: {
			endpoint: graphqlPath
		}
	});

	server.applyMiddleware({
		app,
		path: graphqlPath
	});
}
// REST

if (apis.includes('rest')) {
	const rest = require('express-nedb-rest')();
	for (var collection in db) {
		rest.addDatastore(collection, db[collection]);
	}

	app.use('/api/rest', rest);
}

// End of added code

// Import and Set Nuxt.js options
let config = require('../nuxt.config.js');
config.dev = !(process.env.NODE_ENV === 'production');

async function start() {
	// Init Nuxt.js
	const nuxt = new Nuxt(config);

	const { host, port } = nuxt.options.server;

	// Build only in dev mode
	if (config.dev) {
		const builder = new Builder(nuxt);
		await builder.build();
	} else {
		await nuxt.ready();
	}

	// Give nuxt middleware to express
	app.use(nuxt.render);

	// Listen the server
	app.listen(port, host);
	consola.ready({
		message: `Server listening on http://${host}:${port}`,
		badge: true
	});
}
start();
