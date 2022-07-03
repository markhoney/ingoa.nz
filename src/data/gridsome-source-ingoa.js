const pluralise = require('pluralize');
const utils = require('./utils');
const getDB = require('./db');

function addReferences(name, collection, record, path = '') {
	for (const field of Object.keys(record)) {
		if (utils.isObj(record[field])) {
			addReferences(name, collection, record[field], path + field + '.');
		} else if (Array.isArray(record[field])) {
			if (utils.isObj(record[field][0])) addReferences(name, collection, record[field][0], path + field + '.');
		}
		if (field.endsWith('_id')) {
			const type = field.replace('_id', '');
			if (['next', 'previous'].includes(type)) {
				collection.addReference(path + type, name);
			} else {
				collection.addReference(path + type, utils.case.sentence(type));
			}
		} else if (field.endsWith('_ids')) {
			const type = field.replace('_ids', '');
			collection.addReference(path + pluralise.plural(type), utils.case.sentence(type));
		}
	}
}

function renameFields(record) {
	for (const field of Object.keys(record)) {
		let type;
		if (utils.isObj(record[field])) {
			renameFields(record[field]);
		} else if (Array.isArray(record[field])) {
			if (utils.isObj(record[field][0])) for (const item of record[field]) renameFields(item);
		}
		if (field.endsWith('_id')) {
			type = field.replace('_id', '');
		} else if (field.endsWith('_ids')) {
			type = pluralise.plural(field.replace('_ids', ''));
		}
		if (type) {
			record[type] = record[field];
			delete record[field];
		}
	}
	return utils.cleanobj(record);
}

module.exports = class Ingoa {
	constructor(api) {
		api.loadSource(async ({addCollection, addSchemaResolvers}) => {
			const db = await getDB(true);
			const collections = {};
			for (const collection of Object.keys(db)) {
				const typeName = utils.case.sentence(pluralise.singular(collection));
				collections[collection] = addCollection({typeName});
			}
			for (const collection of Object.keys(collections)) {
				const typeName = utils.case.sentence(pluralise.singular(collection));
				// addReferences(typeName, collections[collection], db[collection][0]);
				for (const node of db[collection]) {
					addReferences(typeName, collections[collection], node);
				}
				for (const node of db[collection]) {
					// console.log(collection, collections[collection], node);
					collections[collection].addNode(renameFields(node));
				}
			}
			addSchemaResolvers({
				Zone: {
					featured: {
						type: 'Placename',
						resolve(obj, args, context) {
							console.log(context);
							return `${obj.firstName} ${obj.lastName}`;
						},
					},
				},
			});
		});
	}
};
