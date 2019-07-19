const {get, sortBy} = require('lodash'); // find, filter, 

module.exports = function(db) {

	return {
		Query: {
			islands(obj, args) {
				return getRecords(db.island, args);
			},
			island(obj, args) {
				return getRecord(db.island, args);
			},
			parts(obj, args) {
				return getRecords(db.part, args);
			},
			part(obj, args) {
				return getRecord(db.part, args);
			},
			maps(obj, args) {
				return getRecords(db.map, args);
			},
			map(obj, args) {
				return getRecord(db.map, args);
			},
			regions(obj, args) {
				return getRecords(db.region, args);
			},
			region(obj, args) {
				return getRecord(db.region, args);
			},
			districts(obj, args) {
				return getRecords(db.district, args);
			},
			district(obj, args) {
				return getRecord(db.district, args);
			},
			zones(obj, args) {
				return getRecords(db.zone, args);
			},
			zone(obj, args) {
				return getRecord(db.zone, args);
			},
			speakers(obj, args) {
				return getRecords(db.speaker, args);
			},
			speaker(obj, args) {
				return getRecord(db.speaker, args);
			},
			groups(obj, args) {
				return getRecords(db.group, args);
			},
			group(obj, args) {
				return getRecord(db.group, args);
			},
			features(obj, args) {
				return getRecords(db.feature, args);
			},
			feature(obj, args) {
				return getRecord(db.feature, args);
			},
			tribes(obj, args) {
				return getRecords(db.tribe, args);
			},
			tribe(obj, args) {
				return getRecord(db.tribe, args);
			},
			placenames(obj, args) {
				return getRecords(db.placename, args);
			},
			placename(obj, args) {
				return getRecord(db.placename, args);
			},
			places(obj, args) {
				return getRecords(db.place, args);
			},
			place(obj, args) {
				return getRecord(db.place, args);
			},
			names(obj, args) {
				return getRecords(db.name, args);
			},
			name(obj, args) {
				return getRecord(db.name, args);
			},
			search(obj, args) {
				return getSearch(db.search, args);
			},
			autocomplete(obj, args) {
				return getAutocomplete(db.search, args);
			},
			total() {
				return db.total;
			},
		},
	};
};

function getSearch(collection, search) {
	if (search) {
		let count = 0;
		return collection.filter(record => {
			if (count >= 10) return false;
			for (const term of search.split(" ")) {
				if (!record.text.includes(term)) return false;
			}
			count++;
			return true;
		});
	}
	return [];
}

function getAutocomplete(collection, search) {
	if (search && search.lang && search.term && search.term.length >= 3) return collection[search.lang].filter(record => record.text.includes(search.term));
	return [];
}

function getRecord(collection, args) {
	if (args.find) {
		if (args.find._id) return collection.find(record => record._id == args.find._id);
		if (args.find.slug) return collection.find(record => {
			const match = [record.slug.mi, record.slug.en].includes(args.find.slug);
			if (args.find.id) {
				return (match && [record.zone.slug.en, record.zone.slug.mi, record.part.slug.en, record.part.slug.mi, record.island.slug.en, record.island.slug.mi].includes(args.find.id));
			}
			return match;
		});
	}
	if (args.filter && args.filter.length) {
		const filters = args.filter.reduce((filters, filter) => {
			filters[filter.field] = filter.value;
			return filters;
		}, {});
		return collection.find(record => {
			for (let filter of args.filter) {
				if (filter.field.endsWith("slug") || filter.field.endsWith("title")) {
					if (!(get(record, filter.field + ".en") == filter.value || get(record, filter.field + ".mi") == filter.value)) return false;
				}
				if (!get(record, filter.field) == filter.value) return false;
			}
			return true;
		});
	}
	return [];
}

function getRecords(collection, args) {
	//if (args.filter) collection = collection.filter(record => record[args.filter.field] == args.filter.value);
	if (args.filter && args.filter.length) {
		args.filter.forEach(filter => {
			if (filter.field && filter.value) {
				collection = collection.filter(record => get(record, filter.field + (filter.field.endsWith("slug") ? "." + args.lang : "")) == filter.value);
			}
		});
	}
	if (args.sort && args.sort.field) {
		collection = sortBy(collection, [args.sort.field, '_id']);
		if ( args.sort.order == -1) collection.reverse();
	}
	if (args.pagination) {
		const pagination = [];
		if (args.pagination.start) {
			pagination.push(args.pagination.start);
			if (args.pagination.size) pagination.push(pagination[0] + args.pagination.size);	
		} else if (args.pagination.page && args.pagination.size) {
				pagination.push(args.pagination2.size * args.pagination.page);
				pagination.push(pagination[0] + args.pagination.size);
		} else {
			pagination.push(0);
			pagination.push(args.pagination.size);
		}
		collection = collection.slice(...pagination);
	}
	return collection;
}
