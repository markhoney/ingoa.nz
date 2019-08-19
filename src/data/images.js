const fs = require('fs');
const path = require('path');
const request = require('request');
const cheerio = require('cheerio');
const imagepath = path.join(__dirname, '..', 'client', 'static', 'img');

function localeEnglish(locale) {
	//Return the locale in English if it exists, or in Māori otherwise
	if (locale) return locale.en || locale.mi;
}

function download(uri, cachepath) {
	if (!fs.existsSync(cachepath)) {
		request.head(uri, function(error) {
			if (!error) {
				request(uri).pipe(fs.createWriteStream(cachepath));
			} else {
				console.log(error);
			}
		});
	}
}

function getMapImages() {
	const baseURL = 'https://maps.googleapis.com/maps/api/staticmap?size=640x400&scale=2&maptype=satellite&key=' + process.env.GOOGLE_API_KEY + '&center=';
	['island', 'region', 'sector', 'district', 'zone'].forEach(type => {
		db[type].forEach(function(record) {
			download(baseURL + localeEnglish(record.name.locale) + ',New+Zealand', path.join(imagepath, type, localeEnglish(record.slug) + '-landscape.png'));
		});
	});
}

function getMaraeImages() {
	for (const record of db.group) {
		if (record.links && record.links.maorimaps) {
			const cachepath = path.join(__dirname, '..', '..', 'cache', 'maorimaps', 'en', record.links.maorimaps.replace("https://maorimaps.com/marae/", "") + '.html');
			if (fs.existsSync(cachepath)) {
				const $ = cheerio.load(fs.readFileSync(cachepath));
				download($('.tgf-slide-item img').attr("src").split("?")[0], path.join(imagepath, 'group', localeEnglish(record.slug) + '-landscape.png'));
			}
		}
	}
}

console.log("Loading Database...");
const db = require('../server/db/memory');
console.log("Getting Map Images...");
getMapImages();
console.log("Getting Marae Images...");
getMaraeImages();
