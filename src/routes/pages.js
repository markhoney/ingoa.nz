const mi = require('../client/locales/mi.json');

function removeSpaces(text) {
	return text.split(" ").join("");
}

module.exports = {
	"index": {
		"en": "/",
		"mi": "/"
	},
	"about": {
		"en": "/about",
		"mi": "/" + removeSpaces(mi.about),
	},
	"license": {
		"en": "/license",
		"mi": "/" + removeSpaces(mi.license),
	},
	"island": {
		"en": "/island",
		"mi": "/" + removeSpaces(mi.island),
	},
	"island/_island": {
		"en": "/island/:island",
		"mi": "/" + removeSpaces(mi.island) + "/:island",
	},
	"part": {
		"en": "/part",
		"mi": "/" + removeSpaces(mi.part),
	},
	"part/_part": {
		"en": "/part/:part",
		"mi": "/" + removeSpaces(mi.part) + "/:part",
	},
	"map": {
		"en": "/map",
		"mi": "/" + removeSpaces(mi.map),
	},
	"map/_map": {
		"en": "/map/:map",
		"mi": "/" + removeSpaces(mi.map) + "/:map",
	},
	"region": {
		"en": "/region",
		"mi": "/" + removeSpaces(mi.region),
	},
	"region/_region": {
		"en": "/region/:region",
		"mi": "/" + removeSpaces(mi.region) + "/:region",
	},
	"zone": {
		"en": "/zone",
		"mi": "/" + removeSpaces(mi.zone),
	},
	"zone/_zone": {
		"en": "/zone/:zone",
		"mi": "/" + removeSpaces(mi.zone) + "/:zone",
	},
	"tribe": {
		"en": "/tribe",
		"mi": "/" + removeSpaces(mi.tribe),
	},
	"tribe/_tribe": {
		"en": "/tribe/:tribe",
		"mi": "/" + removeSpaces(mi.tribe) + "/:tribe",
	},
	"speaker": {
		"en": "/speaker",
		"mi": "/" + removeSpaces(mi.speaker),
	},
	"speaker/_speaker": {
		"en": "/speaker/:speaker",
		"mi": "/" + removeSpaces(mi.speaker) + "/:speaker",
	},
	"feature": {
		"en": "/feature",
		"mi": "/" + removeSpaces(mi.feature),
	},
	"feature/_feature": {
		"en": "/feature/:feature",
		"mi": "/" + removeSpaces(mi.feature) + "/:feature",
	},
	"group": {
		"en": "/group",
		"mi": "/" + removeSpaces(mi.group),
	},
	"group/_zone/_group": {
		"en": "/group/:zone/:group",
		"mi": "/" + removeSpaces(mi.group) + "/:zone/:group",
	},
	"placename": {
		"en": "/placename",
		"mi": "/" + removeSpaces(mi.placename),
	},
	"placename/_zone/_placename": {
		"en": "/placename/:zone/:placename",
		"mi": "/" + removeSpaces(mi.placename) + "/:zone/:placename",
	},
	/*"place": {
		"en": "/place",
		"mi": "/" + removeSpaces(mi.place),
	},
	"place/_zone/_place": {
		"en": "/place/:zone/:place",
		"mi": "/" + removeSpaces(mi.place) + "/:zone/:place"
	},
	"name": {
		"en": "/name",
		"mi": "/" + removeSpaces(mi.name),
	},
	"name/_zone/_name": {
		"en": "/name/:zone/:name",
		"mi": "/" + removeSpaces(mi.name) + "/:zone/:name"
	},*/
	"old": {
		"en": "/old",
		"mi": "/old"
	},
	"old/contents": {
		"en": "/old/contents",
		"mi": "/old/contents"
	},
	"old/_zone": {
		"en": "/old/:zone",
		"mi": "/old/:zone"
	}
};