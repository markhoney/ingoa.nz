const en = require('../client/locales/en.json');
const mi = require('../client/locales/mi.json');
const utils = require('../server/db/utils');

function createCode(text) {
	return text.split(" ").join("");
}

module.exports = {
	"index": {
		"en": "/",
		"mi": "/"
	},
	"about": {
		"en": "/" + createCode(en.about),
		"mi": "/" + createCode(mi.about),
	},
	"license": {
		"en": "/" + createCode(en.license),
		"mi": "/" + createCode(mi.license),
	},
	"island": {
		"en": "/" + createCode(en.island),
		"mi": "/" + createCode(mi.island),
	},
	"island/_island": {
		"en": "/" + createCode(en.island) + "/:island",
		"mi": "/" + createCode(mi.island) + "/:island",
	},
	"part": {
		"en": "/" + createCode(en.part),
		"mi": "/" + createCode(mi.part),
	},
	"part/_part": {
		"en": "/" + createCode(en.part) + "/:part",
		"mi": "/" + createCode(mi.part) + "/:part",
	},
	"map": {
		"en": "/" + createCode(en.map),
		"mi": "/" + createCode(mi.map),
	},
	"map/_map": {
		"en": "/" + createCode(en.map) + "/:map",
		"mi": "/" + createCode(mi.map) + "/:map",
	},
	"region": {
		"en": "/" + createCode(en.region),
		"mi": "/" + createCode(mi.region),
	},
	"region/_region": {
		"en": "/" + createCode(en.region) + "/:region",
		"mi": "/" + createCode(mi.region) + "/:region",
	},
	"zone": {
		"en": "/" + createCode(en.zone),
		"mi": "/" + createCode(mi.zone),
	},
	"zone/_zone": {
		"en": "/" + createCode(en.zone) + "/:zone",
		"mi": "/" + createCode(mi.zone) + "/:zone",
	},
	"tribe": {
		"en": "/" + createCode(en.tribe),
		"mi": "/" + createCode(mi.tribe),
	},
	"tribe/_tribe": {
		"en": "/" + createCode(en.tribe) + "/:tribe",
		"mi": "/" + createCode(mi.tribe) + "/:tribe",
	},
	"speaker": {
		"en": "/" + createCode(en.speaker),
		"mi": "/" + createCode(mi.speaker),
	},
	"speaker/_speaker": {
		"en": "/" + createCode(en.speaker) + "/:speaker",
		"mi": "/" + createCode(mi.speaker) + "/:speaker",
	},
	"feature": {
		"en": "/" + createCode(en.feature),
		"mi": "/" + createCode(mi.feature),
	},
	"feature/_feature": {
		"en": "/" + createCode(en.feature) + "/:feature",
		"mi": "/" + createCode(mi.feature) + "/:feature",
	},
	"group": {
		"en": "/" + createCode(en.group),
		"mi": "/" + createCode(mi.group),
	},
	"group/_zone/_group": {
		"en": "/" + createCode(en.group) + "/:zone/:group",
		"mi": "/" + createCode(mi.group) + "/:zone/:group",
	},
	"placename": {
		"en": "/" + createCode(en.placename),
		"mi": "/" + createCode(mi.placename),
	},
	"placename/_zone/_placename": {
		"en": "/" + createCode(en.placename) + "/:zone/:placename",
		"mi": "/" + createCode(mi.placename) + "/:zone/:placename",
	},
	/*"place": {
		"en": "/place",
		"mi": "/" + createCode(mi.place),
	},
	"place/_zone/_place": {
		"en": "/place/:zone/:place",
		"mi": "/" + createCode(mi.place) + "/:zone/:place"
	},
	"name": {
		"en": "/name",
		"mi": "/" + createCode(mi.name),
	},
	"name/_zone/_name": {
		"en": "/name/:zone/:name",
		"mi": "/" + createCode(mi.name) + "/:zone/:name"
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
