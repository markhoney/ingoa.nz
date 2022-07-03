const {join} = require('path');
const {readdirSync} = require('fs');

function linkName(collection) {
	collection.forEach((placename) => {
		placename.name = placename.names[0].name;
	});
}

module.exports = async (addname = false, cached = true, cache = true, path = join(__dirname, 'json')) => {
	let db;
	if (cached) {
		db = readdirSync(path).map((file) => file.endsWith('.json') && file.replace('.json', '')).filter(Boolean).reduce((db, collection) => {
			db[collection] = require(join(path, collection + '.json'));
			if (addname && collection === 'placenames') {
				linkName(db.placenames);
			}
			return db;
		}, {});
	} else {
		db = connectData(await importData(cache), cache);
		linkName(db.placenames);
	}
	return db;
};
