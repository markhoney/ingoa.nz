const port = 4000;
const path = {
	GraphQL: '/graphql',
	REST: '/rest',
};
const metrics = '/metrics';

const db = require('./db/memory');

require('dotenv').config();
const swaggerUi = require('swagger-ui-express');

process.title = "apollo";

const express = require('express');

const {ApolloServer} = require('apollo-server-express');
const {importSchema} = require('graphql-import');
const {makeExecutableSchema} = require('graphql-tools');

const typeDefs = importSchema('./src/server/apollo/schema.graphql');
const resolvers = require('./apollo/resolvers')(db);
const schema = makeExecutableSchema({typeDefs, resolvers});

const {useSofa, OpenAPI} = require('sofa-api'); // @hofstadter-io/

const apolloServer = new ApolloServer({
	schema,
	tracing: process.env.NODE_ENV != 'production',
	//engine: (process.env.NODE_ENV != 'production' ? {apiKey: process.env.APOLLO_ENGINE_KEY} : null),
});


const openAPI = OpenAPI({
	schema,
	info: {
		title: 'Ngā Ingoa o Aotearoa: An oral dictionary of Māori placenames',
		version: '1.0.0',
	},
});

const app = express();
if (process.env.NODE_ENV != 'production') require('appmetrics-dash').attach({url: metrics, title: 'API'});
apolloServer.applyMiddleware({app});
app.get('/', (req, res) => res.send(path));
app.use('/api', useSofa({
	schema,
	depthLimit: 99,
	onRoute(info) {
		openAPI.addRoute(info, {
			basePath: '/api',
		});
	},
}));
app.use('/api', swaggerUi.serve, swaggerUi.setup(openAPI.get(), {layout: "StandaloneLayout"}));

app.listen({port: port}, () => {
	console.log(`GraphQL Server ready at http://localhost:${port}${path.GraphQL}`);
	console.log(`REST Server ready at http://localhost:${port}${path.REST}`);
	if (process.env.NODE_ENV != 'production') console.log(`Metrics ready at http://localhost:${port}${metrics}`);
});
