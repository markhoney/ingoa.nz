const app = require('express-nedb-rest')();
for (var collection in db) {
	app.addDatastore(collection, db[collection]);
}

export default app;
