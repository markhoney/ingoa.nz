const {importSchema} = require('graphql-import');
const typeDefs = importSchema('./schema.graphql');
const resolvers = require('./resolvers');

module.exports = {
		typeDefs,
		resolvers,
		playground: {
			endpoint: '/api/graphql'
		}
};
