const path = require('path');
const Loki = require('lokijs');
const db = new Loki(path.join(__dirname, 'ingoa.json'), {autoload: true, autoloadCallback: dbinit, autosave: true, autosaveInterval: 4000});

var callback;
var output = {};
function dbinit () {
	const tablesneeded = {'Speaker': {}, 'Island': {}, 'Part': {}, 'Region': {}, 'ImageMap': {}, 'Zone': {}, 'Place': {indices: ['zone', 'name']}, 'Meaning': {}, 'Gazetteer': {}};
	var tables = {};
	for (var table in tablesneeded) {
		tables[table] = db.getCollection(table);
		if (tables[table] === null) {
			tables[table] = db.addCollection(table, tablesneeded[table]);
		}
	}
	output = {conn: db, tables: tables};
	if (typeof callback === 'function') {
		callback(output);
	}
}

module.exports = function(cb) {
	//if (typeof output !== 'undefined') {
	//	cb(output);
	//} else {
		callback = cb;
	//}
}
