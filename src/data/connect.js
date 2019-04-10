/*eslint-disable no-console*/

//var googleMapsClient = require('@google/maps').createClient({key: ''});
const utils = require('./utils.js');
const db = require('./nedb')(true);
/*const geocoder = require('node-geocoder')({
	provider: 'openstreetmap',
	email: 'mark@honeychurch.org'
});*/

function gazetteerplace(zone, placename, place) {
	db.async.gazetteer.find({
		name: utils.removeMacrons(placename.places[place].name),
		district: zone.location.gazetteer
	}, function (err, docs) {
		if (err) {
			console.log(err);
		} else {
			if (docs.length === 1) {
				db.async.places.insert({
					_id: placename.places[place],
					zone: {
						_id: placename.zone._id
					},
					number: placename.number,
					name: {
						mi: placename.places[place].name
					},
					source: 'gazetteer',
					location: {
						name: {
							mi: docs[0].name
						},
						kind: docs[0].kind,
						position: docs[0].location.position
					}
				});
			} else {
				console.log('No Gazetteer Place:', placename.places[place].name);
			}
		}
	});
}

/*
function googleplace(zone, placename, place) {
	var address = utils.removeMacrons(placename.places[place].name) + ', ' + utils.removeMacrons(zone.name.en || zone.name.mi) + ', New Zealand';
	googleMapsClient.geocode({
		address: address
	}, function(err, response) {
		if (err) {
			console.log(err);
		} else {
			if (response.json.results.length > 0) {
				db.async.places.insert({
					_id: placename.places[place],
					zone: placename.zone,
					number: placename.number,
					name: placename.places[place].name,
					source: 'googlemaps',
					location: response.json.results[0]
				});
			} else {
				console.log('No Google Place:', address);
			}
		}
	});
}

function osmplace(zone, placename, place) {
	var address = utils.removeMacrons(placename.places[place].name) + ', ' + utils.removeMacrons(zone.name.en || zone.name.mi) + ', New Zealand';
	geocoder.geocode(address).then(function(location) {
		if (location.length > 0) {
			db.async.places.insert({
				_id: placename.places[place],
				zone: {
					_id: placename.zone._id
				},
				number: placename.number,
				name: {
					mi: placename.places[place].name
				},
				source: 'openstreetmap',
				location: location[0]
			});
		} else {
			console.log('No OSM Place:', address);
			/*db.async.places.insert({
				_id: placename.places[place],
				zone: placename.zone,
				number: placename.number,
				name: placename.places[place].name,
			});*/
/*}
	}).catch(function(err) {
		console.log(err);
	});
}
*/

function matchplaces() {
	db.async.places.find({}, function (err, docs) {
		if (err) {
			console.log(err);
		} else {
			var places = {};
			docs.forEach(function (place) {
				places[place._id] = place.name;
			});
			db.async.zones.find({}, function (err, docs) {
				if (err) {
					console.log(err);
				} else {
					docs.forEach(function (zone) {
						db.async.placenames.find({
							'zone._id': zone._id
						}, function (err, docs) {
							if (err) {
								console.log(err);
							} else {
								docs.forEach(function (placename) {
									if ('places' in placename) {
										for (var place in placename.places) {
											var id = placename._id + '-' + place;
											if (!(id in places)) {
												gazetteerplace(zone, placename, place, id);
												//osmplace(zone, placename, place, id);
												//googleplace(zone, placename, place, id);
											}
										}
									}
								});
							}
						});
					});
				}
			});
		}
	});
}

function updateGroup(group, place) {
	db.async.placenames.find({
		_id: group.places[place].placename._id
	}, function (err, docs) {
		if (err) {
			console.log(err);
		} else if (docs.length === 1) {
			docs[0].places[group.places[place].id].group = group.primary.name;
			db.async.placenames.update({
				_id: docs[0]._id
			}, {
				$set: {
					places: docs[0].places
				}
			});
		} else {
			console.log('More than one placename');
		}
	});
}

function matchgroups() {
	//'Subtribe',
	//'Locality',
	/*var features = [
		'Marae',
		'Pā',
		'Whare nui',
		'Meeting house',
		'Whare rūnanga',
		'Whare mate',
		'Whare puni',
		'Whare moe',
		'Sleeping house',
		'Church',
		'Whare kai',
		'Dining hall',
		'Flagpole',
		'College',
		'Township',
		'Arts & crafts centre',
		'Clinic'
	];*/
	var features = [
		193,
		249,
		195,
		192,
		291,
		156,
		60,
		277,
		309,
		163,
		143,
		142,
		114,
		55,
		129,
		139,
		306,
		304,
		37,
		48,
		46,
		49,
		167,
		166,
		165,
		9,
		126,
		252,
		276,
		52,
		89,
		53,
		38,
		267,
		73,
		68,
		256,
		305,
		307,
		308,
		251,
		76,
		141,
		187,
		88,
		158
	];
	db.async.zones.find({}, function (err, docs) {
		if (err) {
			console.log(err);
		} else {
			docs.forEach(function (zone) {
				db.async.placenames.find({
					'zone._id': zone._id
				}, function (err, docs) {
					if (err) {
						console.log(err);
					} else {
						var groups = {};
						docs.forEach(function (placename) {
							if ('places' in placename) {
								for (var place in placename.places) {
									if ('groups' in placename.places[place]) {
										for (var group in placename.places[place].groups) {
											//console.log(placename.places[place].groups[group]);
											if ('_id' in placename.places[place].groups[group].group) {
												var id = placename.places[place].groups[group].group._id;
												if (!(id in groups)) groups[id] = {
													_id: id,
													feature: {
														_id: 156,
														name: {
															en: 'Marae'
														}
													},
													places: []
												};
												groups[id].places.push(Object.assign(placename.places[place], {
													zone: {
														_id: zone._id
													},
													placename: {
														_id: placename._id
													},
													id: place
												}));
											} else {

											}
										}
									}
								}
							}
						});
						//console.log(groups);
						for (var group in groups) {
							//console.log(groups[group].places);
							/*if (groups[group].length === 1) {
								console.log(group);
							}*/
							/*for (var feature in groups[group]) {
								if (!(features.includes(groups[group][feature].feature))) {
									console.log(groups[group][feature].feature);
								}
							}*/
							if (groups[group].places.map(a => a.feature._id).some(function (v) {
									return features.indexOf(v) >= 0;
								})) {
								features.find(function (feature) {
									var place = groups[group].places.find(function (place) {
										return place.feature._id === feature;
									});
									if (place) {
										groups[group].primary = place;
									}
									return place;
								});
								if ('primary' in groups[group]) {
									//console.log(groups[group].primary);
									console.log(group + '|' + groups[group].primary.name.en); //+ '|' + groups[group].primary.group._id
									for (var place in groups[group].places) {
										updateGroup(groups[group], place);
									}
								} else {
									console.log('No Group name:', group);
								}
							} else {
								/*for (var place in groups[group].places) {
									console.log(groups[group].places[place].placename._id, '-', groups[group].places[place].name, '-', groups[group].places[place].feature.name.en);
								}*/
							}
						}
					}
				});
			});
		}
	});
}

function matchMeaning(placename) {
	var names = [];
	placename.names.forEach(function (name) {
		/*name.name.forEach(function(language) {
			names.push(language);
		});*/
		for (var language in name.name) {
			names.push(name.name[language]);
		}
	});
	utils.unique(names).forEach(async function (name) {
		/*db.async.meanings.find({'names.mi': names[name]}, function(err, docs) {
			if (err) {
				console.log(err);
			} else {
				if (docs.length === 1) {
					db.async.placenames.update({_id: placename._id}, {$set: {meaning: {
						description: docs[0].meaning,
						components: docs[0].components
					}}});
				}
			}
		});*/
		let docs = await db.sync.meanings.find({
			'names.mi': name
		});
		if (docs && docs.length === 1) {
			db.async.placenames.update({
				_id: placename._id
			}, {
				$set: {
					meaning: {
						description: docs[0].meaning,
						components: docs[0].components
					}
				}
			});
		}
	});
}

function matchMeanings() {
	db.async.placenames.find({}, function (err, docs) {
		if (err) {
			console.log(err);
		} else {
			docs.forEach(function (placename) {
				matchMeaning(placename);
			});
		}
	});
}

function speakerzones() {
	var speakerzones = {};
	var zonespeakers = {};
	db.async.placenames.find({}).sort({
		'zone._id': 1,
		'id': 1
	}).exec(function (err, docs) {
		if (err) {
			console.log(err);
		} else {
			docs.forEach(function (placename) {
				placename.names.forEach(function (name) {
					if ('spoken' in name && 'speaker' in name.spoken) {
						if (!(name.spoken.speaker._id in speakerzones)) speakerzones[name.spoken.speaker._id] = [];
						if (!(placename.zone._id in zonespeakers)) zonespeakers[placename.zone._id] = [];
						speakerzones[name.spoken.speaker._id].push({
							_id: placename.zone._id
						});
						if (name.spoken.speaker._id !== 37) {
							zonespeakers[placename.zone._id].push({
								_id: name.spoken.speaker._id
							});
						}
					}
				});
			});
			db.async.speakers.find({}, function (err, docs) {
				if (err) {
					console.log(err);
				} else {
					docs.forEach(function (speaker) {
						if (speaker._id in speakerzones) {
							db.async.speakers.update({
								_id: speaker._id
							}, {
								$set: {
									zones: utils.unique(speakerzones[speaker._id])
								}
							});
						} else {
							console.log("No Zones for Speaker:", speaker._id);
						}
					});
				}
			});
			db.async.zones.find({}, function (err, docs) {
				if (err) {
					console.log(err);
				} else {
					docs.forEach(function (zone) {
						if (zone._id in zonespeakers) {
							db.async.zones.update({
								_id: zone._id
							}, {
								$set: {
									speakers: utils.unique(zonespeakers[zone._id])
								}
							});
						} else {
							console.log("No Speakers for Zone:", zone._id);
						}
					});
				}
			});
		}
	});
}

function iwizones() {
	var iwizones = {};
	db.async.iwi.find({}, function (err, docs) {
		if (err) {
			console.log(err);
		} else {
			docs.forEach(function (iwi) {
				iwizones[iwi._id] = {
					zones: []
				};
			});
			db.async.zones.find({}, function (err, docs) {
				if (err) {
					console.log(err);
				} else {
					docs.forEach(function (zone) {
						if ('iwi' in zone) {
							zone.iwi.forEach(function (iwi) {
								if ('_id' in iwi && iwi._id in iwizones) {
									iwizones[iwi._id].zones.push({
										_id: zone._id
									});
								} else {
									console.log("No Iwi for Zone:", zone._id);
								}
							});
						}
					});
					db.async.iwi.find({}, function (err, docs) {
						if (err) {
							console.log(err);
						} else {
							docs.forEach(function (iwi) {
								if (iwi._id in iwizones) {
									//iwi.zones = iwizones[iwi.name.mi];
									db.async.iwi.update({
										_id: iwi._id
									}, {
										$set: {
											zones: iwizones[iwi._id].zones
										}
									});
								} else {
									console.log("No Zones for Iwi:", iwi._id);
								}
							});
						}
					});
				}
			});
		}
	});
}

function placenamesee() {
	db.async.placenames.find({
		see: {
			$exists: true
		}
	}).sort({
		'zone._id': 1,
		'id': 1
	}).exec(function (err, docs) {
		if (err) {
			console.log(err);
		} else {
			docs.forEach(function (placename) {
				placename.see.forEach(function (see) {
					if ('names' in see.placename) {
						db.async.placenames.find({
							'zone._id': see.placename.zone._id,
							'names.0.name.mi': see.placename.name.mi
						}).sort({
							'zone._id': 1,
							'id': 1
						}).exec(function (err, docs) {
							if (err) {
								console.log(err);
							} else {
								if (docs.length === 1) {
									delete see.placename.zone;
									delete see.placename.names;
									see.placename._id = docs[0]._id;
								} else {
									console.log('See linking:', placename._id, ' - ', docs.length, 'matches');
								}
							}
						});
					}
				});
				db.async.placenames.update({
					_id: placename._id
				}, {
					$set: {
						placename
					}
				});
			});
		}
	});
}

function placefeatures() {
	db.async.features.find({}, function (err, docs) {
		if (err) {
			console.log(err);
		} else {
			var features = docs.reduce((result, feature) => { //Make an empty object to store the zones and places for each Kind
				result[feature.name.en] = {
					_id: feature._id,
					zones: [],
					places: []
				};
				return result;
			}, {});
			db.async.features.find({}, function (err, docs) {
				if (err) {
					console.log(err);
				} else {
					var featureplurals = docs.filter(v => 'plural' in v).reduce((result, feature) => { //Make a lookup object for plurals of features
						result[feature.plural] = {
							_id: feature._id,
							singular: feature.name.en
						};
						return result;
					}, {});
					db.async.placenames.find({}, function (err, docs) {
						if (err) {
							console.log(err);
						} else {
							docs.forEach(function (placename) {
								if ('places' in placename) {
									placename.places.forEach(function (place) {
										['Former ', 'Historic ', 'Future ', 'Proposed ', 'Deserted ', 'Ancient '].forEach(function (featurevariant) {
											if (place.feature.name.en.startsWith(featurevariant)) {
												place.feature.name.en = utils.sentenceCase(place.feature.name.en.slice(featurevariant.length));
												place.feature.variant = featurevariant.trim();
											}
										});
										if (place.feature.name.en in features || place.feature.name.en in featureplurals) {
											if (place.feature.name.en in featureplurals) {
												place.feature.plural = place.feature.name.en;
												place.feature.name.en = featureplurals[place.feature.name.en].singular;
											}
											place.feature._id = features[place.feature.name.en]._id;
											features[place.feature.name.en].zones.push({
												_id: placename.zone._id
											});
											features[place.feature.name.en].places.push({
												_id: placename._id
											});
											//delete place.feature.name;
										} else {
											console.log(place);
											console.log('No Feature for Place:', place.name.en, '-', place.feature.name.en);
										}
									});
									db.async.placenames.update({
										_id: placename._id
									}, {
										$set: {
											places: placename.places
										}
									});
								} else {
									//console.log('No Places in Placename:', placename.name.mi);
								}
							});
						}
						db.async.features.find({}, function (err, docs) {
							if (err) {
								console.log(err);
							} else {
								docs.forEach(function (feature) {
									if (feature.name.en in features) {
										//db.async.features.update({_id: feature._id}, {$set: {zones: utils.unique(features[feature.name.en].zones), places: features[feature.name.en].places}});
									} else {
										console.log("No Features for Place:", feature.name.en);
									}
								});
							}
						});
					});
				}
			});
		}
	});
}

function filterObject(obj, fields) {
	var newobj = {};
	fields.forEach(function (field) {
		newobj[field] = obj[field];
	});
	return newobj;
}

function addMenu(table, fields) {
	db.async[table].find({}, function (err, docs) {
		if (err) {
			console.log(err);
		} else {
			var items = docs.map(row => {
				return filterObject(row, ['_id', 'names', 'code'].concat(fields));
			});
			db.async.menus.insert({
				_id: table,
				items: items
			});
		}
	});
}

function menuItems() {
	var menu = {};
	menu.islands = addMenu('islands');
	menu.regions = addMenu('regions', ['island', 'part']); //, 'map'
	menu.zones = addMenu('zones', ['region', 'speakers']);
	//menu.maps = addMenu('map', ['island', 'part', 'maplinks']);
	menu.parts = addMenu('parts', ['island']);
	menu.speakers = addMenu('speakers', ['zones']);
	menu.features = addMenu('features');
	menu.iwi = addMenu('iwi');
	menu.groups = addMenu('groups');
	/*for (var item in menu) {
		db.async.menu.insert({_id: item, items: menu[item]});
	}*/
	//db.async.menus.insert({_id: 0, menu: menu});
}

function addSuggestions(type, title) {
	var suggestions = [];
	db.async[type].find({}, function (err, docs) {
		if (err) {
			console.log(err);
		} else {
			docs.forEach(function (datum) {
				['en', 'mi'].forEach(function (lang) {
					if (lang in datum.name) {
						db.async.suggestions.insert({
							text: datum.name[lang] + ' (' + title + ')',
							name: datum.name[lang],
							type: type
						});
					}
				});
			});
		}
	});
	return suggestions;
}

function suggestions() {
	addSuggestions('islands', 'Island');
	addSuggestions('parts', 'Part');
	addSuggestions('regions', 'Region');
	addSuggestions('zones', 'Zone');
	db.async.placenames.find({}, function (err, docs) {
		if (err) {
			console.log(err);
		} else {
			docs.forEach(function (placename) {
				//place.placenames.foreach(function(name) {
				for (var name in placename.names) {
					name = placename.names[name];
					db.async.suggestions.insert({
						text: name.name.mi + ' (Name)',
						name: name.name.mi,
						type: 'names'
					});
				}
				if ('features' in placename) {
					placename.features.forEach(function (feature) {
						db.async.suggestions.insert({
							text: feature.name + ' (Place)',
							name: feature.name,
							type: 'places'
						});
					});
				}
			});
		}
	});
	db.async.speakers.find({}, function (err, docs) {
		if (err) {
			console.log(err);
		} else {
			docs.forEach(function (speaker) {
				db.async.suggestions.insert({
					text: speaker.name + ' (Speaker)',
					name: speaker.name,
					type: 'speakers'
				});
				//var fullname = utils.cleanArray([speaker.name.full.title, speaker.name.full.first, (speaker.name.full.nick ? '(' + speaker.name.full.nick + ')' : null), speaker.name.full.middle, speaker.name.full.last, speaker.name.full.suffix]).join(' ');
				var fullname = [speaker.name.full.title, speaker.name.full.first, (speaker.name.full.nick ? '(' + speaker.name.full.nick + ')' : null), speaker.name.full.middle, speaker.name.full.last, speaker.name.full.suffix].filter(a => a).join(' ');
				db.async.suggestions.insert({
					text: fullname + ' (Speaker)',
					name: fullname,
					type: 'speakers'
				});
			});
		}
	});
	//return suggestions;
	//return utils.unique(suggestions);
	//db.async.suggestions.insert(utils.unique(suggestions));
}


function connectAll() {
	speakerzones();
	iwizones();
	matchMeanings();
	suggestions();
	menuItems();
	placenamesee();
	matchgroups();
	placefeatures();
	matchplaces();
}

connectAll();
