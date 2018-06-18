const fs = require('fs');
const path = require('path');
const readline = require('readline');
const _ = require('underscore');

const sourcepath = 'source/timecodes';

const output = fs.createWriteStream(path.join(sourcepath, 'output', 'all.tsv'));
const intros = fs.createWriteStream(path.join(sourcepath, 'output', 'intros.tsv'));
output.once('open', function(fd) {
	fs.readdir(path.join(sourcepath, 'input'), function(err, files) {
		if (err) {
			console.error("Could not list the directory contents", err);
			process.exit(1);
		}
		files.forEach(function(file, index) {
			if (file.indexOf(".txt") > -1) {
				const zone = file.split(".", 1)[0]
				const input = readline.createInterface({input: fs.createReadStream(path.join(sourcepath, 'input', file))});
				var count = 0;
				input.on('line', function(line) {
					if (count == 0) {
						intros.write(line + "	" + zone + "\n");
					} else {
						output.write(line + "	" + zone + "\n");
					}
					count++;
				});
			}
		});
	});
});
//stream.end();
