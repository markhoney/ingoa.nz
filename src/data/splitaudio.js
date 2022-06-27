const MediaSplit = require('media-split');
const fs = require('fs');
const path = require("path");
const ffmpeg = require('ffmpeg-static').path;
const {execSync} = require('child_process');

console.log("Loading data...");
const db = require('../server/db/memory');

function secondsToTimecode(seconds) {
	return Math.floor(seconds / 60).toString().padStart(2, "0") + ":" + (seconds % 60).toFixed(3).padStart(6, "0");
}

function splitMP3(placenames, type, id) {
	const bookmarks = placenames.map(placename => placename.names).flat().filter(name => name.spoken).sort((a, b) => a.spoken.start - b.spoken.start);
	if (bookmarks.length) {
		bookmarks.forEach(bookmark => {
			const input = path.join(__dirname, '..', 'client', 'static', 'audio', type, id + '.mp3');
			const output = path.join(__dirname, '..', 'client', 'static', 'audio', 'placename', bookmark._id + '.mp3');
			if (fs.existsSync(input) && !fs.existsSync(output)) {
				const start = secondsToTimecode(Math.max(0, bookmark.spoken.start - 0.1));
				const end = secondsToTimecode(bookmark.spoken.end + 0.1);
				const metadata = [
					{field: "track", value: bookmark.placename.number},
					{field: "artist", value: bookmark.spoken.speaker.name.locale.mi},
					{field: "title", value: bookmark.name.locale.mi + " (" + (bookmark.placename.zone ? bookmark.placename.zone.name.locale.en || bookmark.placename.zone.name.locale.mi : (bookmark.placename.part ? bookmark.placename.part.name.locale.en || bookmark.placename.part.name.locale.mi : bookmark.placename.island.name.locale.en || bookmark.placename.island.name.locale.mi)) + ")"},
					{field: "album", value: "Ngā Ingoa o Aotearoa: An oral dictionary of Māori placenames"},
					{field: "disc", value: (bookmark.placename.zone ? bookmark.placename.zone.number : (bookmark.placename.part ? bookmark.placename.part.number : bookmark.placename.island.number))},
					{field: "language", value: (bookmark.name.locale.en === "Intro" ? "eng" : "mri")}
				];
				const meta = metadata.reduce((meta, data) => meta + `-metadata ${data.field}="${data.value}" `, "");
				const command = `${ffmpeg} -hide_banner -loglevel quiet -i ${input} -ss ${start} -to ${end} ${meta} -c copy ${output}`;
				//console.log(command, '\n');
				execSync(command);
			}
		});
	}
}

console.log("Splitting MP3s...");
db.island.forEach(island => {
	splitMP3(island.placenames, 'island', island._id);
});
db.part.forEach(part => {
	splitMP3(part.placenames, 'part', part._id);
});
db.zone.forEach(zone => {
	splitMP3(zone.placenames, 'zone', zone._id);
});
