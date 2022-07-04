
const macrons = {
	'Ā': 'A',
	'Ē': 'E',
	'Ī': 'I',
	'Ō': 'O',
	'Ū': 'U',
	'ā': 'a',
	'ē': 'e',
	'ī': 'i',
	'ō': 'o',
	'ū': 'u'
};

const macronVowels = {
	'Ā': 'Aa',
	'Ē': 'Ee',
	'Ī': 'Ii',
	'Ō': 'Oo',
	'Ū': 'Uu',
	'ā': 'aa',
	'ē': 'ee',
	'ī': 'ii',
	'ō': 'oo',
	'ū': 'uu'
};

const superscripts = {
	'ᴴ': 'H',
	'ʰ': 'h'
};

const italics = {
	'_F_': '<em>F</em>',
	'_f_': '<em>f</em>',
	'_G_': '<em>G</em>',
	'_g_': '<em>g</em>',
	'_H_': '<em>H</em>',
	'_h_': '<em>h</em>',
	'_K_': '<em>K</em>',
	'_k_': '<em>k</em>',
	'_L_': '<em>L</em>',
	'_l_': '<em>l</em>'
};

const punctuation = {
	' ': '_',
	'/': '-',
	'(': '',
	')': ''
};

const simplify = {
	' ': '',
	'-': '',
};

module.exports = {
	replace(word, letters) {
		for (var letter in letters) {
			word = word.split(letter).join(letters[letter]);
		}
		return word;
	},
	escapeRegex(str) {
		if (str) {
			return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$]/g, "\\$&"); //eslint-disable-line
		}
	},
	italiciseH(name) {
		if (name) {
			return module.exports.replace(name, {
				'ᴴ': '_H_',
				'ʰ': '_h_'
			});
		}
	},
	htmlItalics(name) {
		if (name) {
			return module.exports.replace(name, italics);
		}
	},
	removeMacrons(name) {
		if (name) {
			return module.exports.replace(name, Object.assign({}, macrons, superscripts));
		}
	},
	longVowelMacrons(name) {
		if (name) {
			return module.exports.replace(name, Object.assign({}, macronVowels, superscripts));
		}
	},
	double(name) {
		const nomacrons = module.exports.longVowelMacrons(name);
		if (nomacrons !== name) return nomacrons;
	},
	ascii(name) {
		const nomacrons = module.exports.removeMacrons(name);
		if (nomacrons !== name) return nomacrons;
	},
	simplify(name) {
		name = module.exports.removeMacrons(name);
		if (name) {
			return module.exports.replace(name, simplify).toLowerCase();
		}
	},
	createCode(name) {
		if (name) {
			name = name.split(' | ')[0];
			return module.exports.replace(name, Object.assign({}, macrons, superscripts, punctuation, simplify)).toLowerCase();
			//return module.exports.replace(name.en || name.mi, Object.assign({}, macrons, superscripts, punctuation)).toLowerCase();
		}
	},
	createCodeNew(name) {
		return module.exports.replace(name.en || name.mi, Object.assign({}, macrons, superscripts, punctuation)).toLowerCase();
	},
	createSlug(name) {
		return {
			en: utils.createCode(name.en === island.name.mi ? null : island.name.en),
			mi: utils.createCode(name.mi),
		};
	},
	getSingle(word) {
		const split = word.split(' | ');
		return word[0];
	},
	getPlural(word) {
		const split = word.split(' | ');
		if (word.length > 1) return word[1];
		return word[0];
	},
	cleanobj(obj) {
		for (const key in obj) {
			if (typeof obj[key] === 'object') {
				module.exports.cleanobj(obj[key]);
				if (Array.isArray(obj[key])) obj[key] = obj[key].filter(Boolean);
			}
			/* if (Array.isArray(obj[key])) for (var i = 0; i < obj[key].length; i++) {
				if (['-', ' ', '', undefined, null].includes(obj[key][i]) || (typeof (obj[key][i]) === 'object' && Object.keys(obj[key][i]).length === 0)) {
					obj[key].splice(i, 1);
					i--;
				}
			} */
			if (['-', ' ', '', undefined, null, NaN].includes(obj[key]) || (typeof (obj[key]) === 'object' && Object.keys(obj[key]).length === 0)) {
				delete obj[key];
				if (Array.isArray(obj)) obj = Object.values(obj);
			}
		}
		return obj;
	},
	unique(arr) {
		return arr.filter((value, index, self) => ((typeof value === 'object') ? index === self.findIndex((t) => (t._id === value._id)) : self.indexOf(value) === index));
	},
	flattenObj(obj) {
		for (const field of Object.keys(obj)) {
			if (obj[field] instanceof Object && Object.getPrototypeOf($page[field]) == Object.prototype) {
				module.exports.cleanPage($page[field]);
			} else if (field === 'edges') {
				obj = obj.edges.map((edge) => edge.node);
			}
		}
		return $page;
	},
	isObj(obj) {
		return obj instanceof Object && Object.getPrototypeOf(obj) == Object.prototype;
	},
};

//return name.toLowerCase().replace(/ /g, '_').replace(/\//g, '-').replace(/\(/g, '').replace(/\)/g, '').replace(/ʰ/g, 'h').replace(/ā/g, 'a').replace(/ē/g, 'e').replace(/ī/g, 'i').replace(/ō/g, 'o').replace(/ū/g, 'u');
