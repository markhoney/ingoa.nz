const path = require('path');
const loki = require('lokijs');
const db = new loki(path.join(__dirname, 'ingoa.json'), {autoload: true, autoloadCallback: dbinit, autosave: true, autosaveInterval: 4000});

var callback;
var output = {};
function dbinit () {
	const tablesneeded = {"Speaker": {}, "Island": {}, "Part": {}, "Region": {}, "ImageMap": {}, "Zone": {}, "Place": {indices: ["zone", "name"]}, "Meaning": {}, "Gazetteer": {}};
	var tables = {};
	for (table in tablesneeded) {
		tables[table] = db.getCollection(table);
		if (tables[table] === null) {
			tables[table] = db.addCollection(table, tablesneeded[table]);
		}
	}
	output = {conn: db, tables: tables};
	if (typeof callback == 'function') {
		callback(output);
	}
}

module.exports = function(cb) {
	if(typeof foo != 'undefined') {
			cb(foo);
	} else {
			callback = cb;
	}
}
