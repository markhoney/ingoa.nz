const fs = require('fs');
const path = require('path');
const request = require('request');
const db = require(path.join(__dirname, '../../../db/loki.js'));
db(function(db) {
	function download(uri, filename) {
		request.head(uri, function(err, res, body) {
			if (err) {
				//console.log('Error', err);
			}
			request(uri).pipe(fs.createWriteStream(filename));
		});
	}

	const baseURL = 'https://maps.googleapis.com/maps/api/staticmap?size=640x400&scale=2&maptype=satellite&key=' + process.env.GOOGLE_API_KEY + '&center=';

	db.tables.Island.find().forEach(function(island) {
		if ('location' in island) {
			download(baseURL + island.location.googleplacename + ',New+Zealand', path.join(__dirname, 'island', island.code + '-landscape.png'));
		}
	});
	db.tables.Region.find().forEach(function(region) {
		if ('location' in region) {
			download(baseURL + region.location.googleplacename + ',New+Zealand', path.join(__dirname, 'region', region.code + '-landscape.png'));
		}
	});
	db.tables.Zone.find().forEach(function(zone) {
		if ('location' in zone) {
			download(baseURL + zone.location.googleplacename + ',New+Zealand', path.join(__dirname, 'zone', zone.code + '-landscape.png'));
		}
	});
	db.conn.close();
});

