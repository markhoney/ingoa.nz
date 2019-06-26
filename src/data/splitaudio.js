const MediaSplit = require('media-split');
const path = require("path");
const ffmpeg = require('ffmpeg-static').path;

console.log("Loading data...");
const db = require('../server/db/memory');

function secondsToTimecode(seconds) {
	return Math.floor(seconds / 60).toString().padStart(2, "0") + ":" + (seconds % 60).toFixed(3).padStart(6, "0");
}

function splitMP3(placenames, type, id) {
	const bookmarks = placenames.map(placename => placename.names).flat().filter(name => name.spoken).sort((a, b) => a.spoken.start - b.spoken.start);
	if (bookmarks.length) {
		bookmarks.forEach(bookmark => {
			const start = secondsToTimecode(bookmark.spoken.start - 0.1);
			const end = secondsToTimecode(bookmark.spoken.end + 0.1);
			const name = bookmark._id;
			const metadata = {
				track: bookmark.placename.number,
				artist: bookmark.spoken.speaker.name.mi,
				title: bookmark.name.mi,
				album: bookmark.placename.zone.name.en || bookmark.placename.zone.name.mi || bookmark.placename.part.name.en || bookmark.placename.part.name.mi || bookmark.placename.island.name.en || bookmark.placename.island.name.mi,
				disc: bookmark.placename.zone.number || bookmark.placename.part.number || bookmark.placename.island.number,
				language: (bookmark.name.en == "Intro" ? "eng" : "mri")
			};
		});
		const sections = bookmarks.map(bookmark => `[${secondsToTimecode(bookmark.spoken.start - 0.1)} - ${secondsToTimecode(bookmark.spoken.end + 0.1)}] ${bookmark._id}`);
		/*const sections = bookmarks.map(bookmark => {
			return {
				start: secondsToTimecode(bookmark.spoken.start - 0.1),
				end: secondsToTimecode(bookmark.spoken.end + 0.1),
				name: bookmark._id
			};
		});*/
		const metadata = bookmarks.map(bookmark => `track=${bookmark.placename.number},artist=${bookmark.spoken.speaker.name.mi},title=${bookmark.name.mi},album=${bookmark.placename.zone.name.en || bookmark.placename.zone.name.mi}`);
		/*const metadata = bookmarks.map(bookmark => {
			return {
				track: bookmark.placename.number,
				artist: bookmark.spoken.speaker.name.mi,
				title: bookmark.name.mi,
				album: bookmark.placename.zone.name.en || bookmark.placename.zone.name.mi || bookmark.placename.part.name.en || bookmark.placename.part.name.mi || bookmark.placename.island.name.en || bookmark.placename.island.name.mi,
				disc: bookmark.placename.zone.number || bookmark.placename.part.number || bookmark.placename.island.number,
				language: "mri"
			};
		});*/
		/*const metadata = bookmarks.map(bookmark => [
			["track", bookmark.placename.number],
			["artist", bookmark.spoken.speaker.name.mi],
			["title", bookmark.name.mi],
			["album", bookmark.placename.zone.name.en || bookmark.placename.zone.name.mi]
		]);*/
		const input = path.join('..', 'client', 'static', 'audio', type, id + '.mp3');
		const output = path.join('..', 'client', 'static', 'audio', 'placename');
		//console.log(sections);
		console.log(metadata);
		//(new MediaSplit({format: "mp3", sections: sections, input: input, output: output})).parse();
		//const split = new MediaSplit({format: "mp3", sections: sections, input: input, output: output});
		//split.parse();
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
