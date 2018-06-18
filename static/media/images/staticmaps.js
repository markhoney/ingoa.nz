const fs = require('fs');
const db = require('../../../db/loki.js');
db(function(db) {
const request = require('request');

function download(uri, filename) {
  request.head(uri, function(err, res, body) {
    request(uri).pipe(fs.createWriteStream(filename));
  });
};

const baseURL = "https://maps.googleapis.com/maps/api/staticmap?size=640x400&scale=2&maptype=satellite&key=AIzaSyCFyKQuNDJvm4BIqhV_hgcb5JQV8kVYE-Q&center=";

db.tables.Island.find().forEach(function(island) {
	download(baseURL + island.name + ",New+Zealand", 'island/' + island.code + '-landscape.png');
});
db.tables.Region.find().forEach(function(region) {
	download(baseURL + region.name + ",New+Zealand", 'region/' + region.code + '-landscape.png');
});
db.tables.Zone.find().forEach(function(zone) {
	download(baseURL + zone.name + ",New+Zealand", 'zone/' + zone.code + '-landscape.png');
});
db.conn.close();
});

