const {importSchema} = require('graphql-import');
const typeDefs = importSchema('./apollo-server/schema.graphql');
const resolvers = require('./resolvers');

module.exports = {
		typeDefs,
		resolvers,
		playground: {
			endpoint: '/api/graphql'
		}
};
