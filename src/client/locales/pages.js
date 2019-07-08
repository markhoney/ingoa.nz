const mi = require('./mi.json');

export default function() {
	return {
		"index": {
			"en": "/",
			"mi": "/"
		},
		"about": {
			"en": "/about",
			"mi": "/" + mi.about
		},
		"island": {
			"en": "/island",
			"mi": "/" + mi.island
		},
		"island/_island": {
			"en": "/island/:island",
			"mi": "/" + mi.island + "/:island"
		},
		"part": {
			"en": "/part",
			"mi": "/" + mi.part
		},
		"part/_part": {
			"en": "/part/:part",
			"mi": "/" + mi.part + "/:part"
		},
		"map": {
			"en": "/map",
			"mi": "/" + mi.map
		},
		"map/_map": {
			"en": "/map/:map",
			"mi": "/" + mi.map + "/:map"
		},
		"region": {
			"en": "/region",
			"mi": "/" + mi.region
		},
		"region/_region": {
			"en": "/region/:region",
			"mi": "/" + mi.region + "/:region"
		},
		"zone": {
			"en": "/zone",
			"mi": "/" + mi.zone
		},
		"zone/_zone": {
			"en": "/zone/:zone",
			"mi": "/" + mi.zone + "/:zone"
		},
		"tribe": {
			"en": "/tribe",
			"mi": "/" + mi.tribe
		},
		"tribe/_tribe": {
			"en": "/tribe/:tribe",
			"mi": "/" + mi.tribe + "/:tribe"
		},
		"speaker": {
			"en": "/speaker",
			"mi": "/" + mi.speaker
		},
		"speaker/_speaker": {
			"en": "/speaker/:speaker",
			"mi": "/" + mi.speaker + "/:speaker"
		},
		"feature": {
			"en": "/feature",
			"mi": "/" + mi.feature
		},
		"feature/_feature": {
			"en": "/feature/:feature",
			"mi": "/" + mi.feature + "/:feature"
		},
		"group": {
			"en": "/group",
			"mi": "/" + mi.group
		},
		"group/_zone/_group": {
			"en": "/group/:zone/:group",
			"mi": "/" + mi.group + "/:zone/:group"
		},
		"placename": {
			"en": "/placename",
			"mi": "/" + mi.placename
		},
		"placename/_zone/_placename": {
			"en": "/placename/:zone/:placename",
			"mi": "/" + mi.placename + "/:zone/:placename"
		},
		"place": {
			"en": "/place",
			"mi": "/" + mi.place
		},
		"place/_zone/_place": {
			"en": "/place/:zone/:place",
			"mi": "/" + mi.place + "/:zone/:place"
		},
		"name": {
			"en": "/name",
			"mi": "/" + mi.name
		},
		"name/_zone/_name": {
			"en": "/name/:zone/:name",
			"mi": "/" + mi.name + "/:zone/:name"
		},
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
	}
}