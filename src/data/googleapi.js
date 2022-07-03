const {existsSync, readFileSync, writeFileSync} = require('fs');
require('dotenv').config();
const {google} = require('googleapis');

async function cacheSheet(tabName, overwrite = false) {
}

async function getData(spreadsheetId, tab) {
	const sheets = google.sheets({
		version: 'v4',
		auth: process.env.GOOGLE_API_KEY,
	});
	const sheet = await sheets.spreadsheets.values.get({
		spreadsheetId,
		range: tab + '!A1:ZZ10000',
	});
	const titles = sheet.data.values.shift();
	return sheet.data.values.map((row) => titles.reduce((rows, title, index) => {
		return {...rows, [title]: row[index]};
	}, {}));
}

async function getSheet(id, tab, cacheFolder = './cache/google/', overwrite = false) {
	const filepath = cacheFolder + tab + '.json';
	if (!overwrite && existsSync(filepath)) return JSON.parse(readFileSync(filepath));
	const data = await getData(id, tab);
	writeFileSync(filepath, JSON.stringify(data));
	return data;
}

module.exports = {getSheet};
