const db = ['island', 'part', 'map', 'region', 'zone', 'speaker', 'group', 'feature', 'iwi', 'placename', 'meaning', 'gazetteer'].reduce((db, collection) => {
	db[collection] = require('./json/' + collection + '.json');
	//db[collection] = JSON.parse(fs.readFileSync('apollo-server/db/json/' + collection + '.json'));
	return db;
}, {});

db.name = db.placename.map(placename => placename.names).flat();
db.place = db.placename.filter(placename => placename.places).map(placename => placename.places).flat();

module.exports = db;
