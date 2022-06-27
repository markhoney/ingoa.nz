const {readFileSync, writeFileSync} = require('fs');
require('dotenv').config();
const {google} = require('googleapis');

async function getSheet(spreadsheetId, tab) {
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

module.exports = {getSheet};
