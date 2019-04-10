const fs = require('fs');
const path = require('path');
//const Datastore = require('nedb');
const Datastore = require('nedb-async').default;

const dbfolder = 'nedb';
const dbpath = path.join(__dirname, dbfolder);
if (!fs.existsSync(dbpath)) {
	fs.mkdirSync(dbpath, 744);
}

function createCollections(collections) {
	var stores = {};
	collections.forEach(function(collection) {
		stores[collection] = new Datastore({
			filename: path.join(dbpath, collection + '.db'),
			autoload: true
		});
		stores[collection].loadDatabase();
	});
	return stores;
}

module.exports = function(extras) {
	var collections = ['speaker', 'island', 'part', 'region', 'map', 'zone', 'placename', 'feature', 'iwi', 'group']; // , 'menus', 'suggestions'
	if (extras) collections = collections.concat(['meaning', 'gazetteer']); // , 'places'
	return createCollections(collections);
};
