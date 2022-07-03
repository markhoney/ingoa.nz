const {join} = require('path');
const {readdirSync} = require('fs');

module.exports = async (cached = true, cache = true, path = join(__dirname, 'json')) => {
	if (cached) {
		return readdirSync(path).map((file) => file.endsWith('.json') && file.replace('.json', '')).filter(Boolean).reduce((db, collection) => {
			db[collection] = require(join(path, collection + '.json'));
		}, {});
	} else {
		return await connectData(await importData(cache), cache);
	}
};
