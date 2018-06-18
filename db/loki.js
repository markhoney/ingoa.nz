const path = require('path');
const loki = require('lokijs');
const db = new loki(path.join(__dirname, 'ingoa.json'), {autoload: true, autoloadCallback: dbinit, autosave: true, autosaveInterval: 4000});

var callback;
var output = {};
function dbinit () {
	const tablesneeded = {"Speaker": {indices: []}, "Island": {indices: []}, "Part": {indices: []}, "Region": {indices: []}, "ImageMap": {indices: []}, "Zone": {indices: []}, "Place": {indices: ["zone", "name"]}};
	var tables = {};
	for (table in tablesneeded) {
		tables[table] = db.getCollection(table);
		if (tables[table] === null) {
			tables[table] = db.addCollection(table, {indices: tablesneeded[table].indices});
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
