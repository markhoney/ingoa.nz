
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

var exports = module.exports = {
	case: {
		upper(text) {
			if (!text) return null;
			if (text === '') return '';
			return text.toUpperCase();
		},
		lower(text) {
			if (!text) return null;
			if (text === '') return '';
			return text.toLowerCase();
		},
		initial(text) {
			if (!text) return null;
			if (text === '') return '';
			return text[0].toUpperCase() + text.slice(1);
		},
		title(text) {
			return text.toLowerCase().split(' ').map(function(word) {
				return word.replace(word[0], word[0].toUpperCase());
			}).join(' ');
		},
		sentence(text) {
			return text.charAt(0).toUpperCase() + text.slice(1);
		},
	},
	locale: {
		set() {
			//Return the code for the language that is currently selected in i18n
			return this.$i18n.locale;
		},
		alt() {
			//Return the code for the language that is not currently selected in i18n
			return this.$i18n.locales.filter(locale => locale.code !== this.$i18n.locale)[0].code;
			//if (this.locale() === 'en') return 'mi';
			//return 'en';
		},
		all() {
			//Return an array of locale codes
			return $i18n.locales.map(locale => locale.code);
		},
		slug() {
			//Return the slug field name in the currently selected i18n language
			return "slug." + this.locale();
		},
		maori(locale) {
			//Return the locale in Māori if it exists, or in English otherwise
			if (locale) return locale.mi || locale.en;
		},
		english(locale) {
			//Return the locale in English if it exists, or in Māori otherwise
			if (locale) return locale.en || locale.mi;
		},
		currentOnly(locale, blank = "") {
			//Return the locale in the currently selected i18n language if it exists, otherwise return nothing
			if (locale) return locale[this.locale()] || blank;
		},
		current(locale) {
			//Return the locale in the currently selected i18n language if it exists, otherwise return the other locale
			if (locale) return locale[this.locale()] || locale[this.localeAlt()];
		},
		other(locale, blank = "") {
			//If both translations of the locale exist, return the locale in the language that isn't currently selected in i18n, otherwise return a blank placeholder
			if (locale && locale.en && locale.mi) return locale[this.localeAlt()];
			return blank;
		},
		both(locale) {
			//Return the locale in the currently selected language, followed by the locale in the alternative language in brackets, if it exists
			if (locale && this.localeBothExist(locale)) {
				return locale[this.locale()] + (locale[this.localeAlt()] ? ' (' + locale[this.localeAlt()] + ')' : '');
			}
			return locale[this.locale()] || locale[this.localeAlt()];
		},
		bothExist(locale) {
			//Return true if the locale exists in both languages
			if (locale) return locale.en && locale.mi;
		},
	},
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
			return exports.replace(name, {
				'ᴴ': '_H_',
				'ʰ': '_h_'
			});
		}
	},
	htmlItalics(name) {
		if (name) {
			return exports.replace(name, italics);
		}
	},
	removeMacrons(name) {
		if (name) {
			return exports.replace(name, Object.assign({}, macrons, superscripts));
		}
	},
	longVowelMacrons(name) {
		if (name) {
			return exports.replace(name, Object.assign({}, macronVowels, superscripts));
		}
	},
	double(name) {
		const nomacrons = exports.longVowelMacrons(name);
		if (nomacrons !== name) return nomacrons;
	},
	ascii(name) {
		const nomacrons = exports.removeMacrons(name);
		if (nomacrons !== name) return nomacrons;
	},
	simplify(name) {
		name = exports.removeMacrons(name);
		if (name) {
			return exports.replace(name, simplify).toLowerCase();
		}
	},
	createCode(name) {
		if (name) {
			name = name.split(' | ')[0];
			return exports.replace(name, Object.assign({}, macrons, superscripts, punctuation, simplify)).toLowerCase();
			//return exports.replace(name.en || name.mi, Object.assign({}, macrons, superscripts, punctuation)).toLowerCase();
		}
	},
	createCodeNew(name) {
		return exports.replace(name.en || name.mi, Object.assign({}, macrons, superscripts, punctuation)).toLowerCase();
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
				exports.cleanobj(obj[key]);
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
	cleanPage($page) {
		for (const field of Object.keys($page)) {
			if ($page[field] instanceof Object && Object.getPrototypeOf($page[field]) == Object.prototype) {
				exports.cleanPage($page[field]);
			} else if (field === 'edges') {
				$page = $page.edges.map((edge) => edge.node);
			}
		}
		return $page;
	},
	flattenObj(obj) {
		for (const field of Object.keys(obj)) {
			if (obj[field] instanceof Object && Object.getPrototypeOf($page[field]) == Object.prototype) {
				exports.cleanPage($page[field]);
			} else if (field === 'edges') {
				obj = obj.edges.map((edge) => edge.node);
			}
		}
		return $page;
	},
};

//return name.toLowerCase().replace(/ /g, '_').replace(/\//g, '-').replace(/\(/g, '').replace(/\)/g, '').replace(/ʰ/g, 'h').replace(/ā/g, 'a').replace(/ē/g, 'e').replace(/ī/g, 'i').replace(/ō/g, 'o').replace(/ū/g, 'u');
