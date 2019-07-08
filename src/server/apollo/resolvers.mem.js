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
			place(obj, args) {
				return getRecord(db.placename, args);
			},
			name(obj, args) {
				return getRecord(db.placename, args);
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
				if (!record.name.includes(term)) return false;
			}
			count++;
			return true;
		});
	}
	return [];
}

function getAutocomplete(collection, search) {
	if (search && search.filter && search.filter.lang && search.filter.term && search.filter.term.length >= 3) return collection[search.filter.lang].filter(record => record.name.includes(search.filter.term));
	return [];
}

function getRecord(collection, args) {
	if (args.filter) {
		if (args.filter._id) return collection.find(record => record._id == args.filter._id);
		//if (args.filter.code) return collection.find(record => record.code == args.filter.code);
		//if (args.filter.slug) return collection.find(record => record.slug[args.filter.lang] == args.filter.slug);
		if (args.filter.slug) return collection.find(record => record.slug.mi == args.filter.slug || record.slug.en == args.filter.slug);
	}
	return [];
}

function getRecords(collection, args) {
	//if (args.filter) collection = collection.filter(record => record[args.filter.field] == args.filter.value);
	if (args.filter) collection = collection.filter(record => get(record, args.filter.field + (args.filter.field.includes("slug") ? "." + args.filter.lang : "")) == args.filter.value);
	if (args.sort && args.sort.field) {
		collection = sortBy(collection, args.sort.field || '_id');
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
