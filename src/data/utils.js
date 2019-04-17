var exports = module.exports = {};

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

//return name.toLowerCase().replace(/ /g, '_').replace(/\//g, '-').replace(/\(/g, '').replace(/\)/g, '').replace(/ʰ/g, 'h').replace(/ā/g, 'a').replace(/ē/g, 'e').replace(/ī/g, 'i').replace(/ō/g, 'o').replace(/ū/g, 'u');

exports.replace = function(word, letters) {
	for (var letter in letters) {
		word = word.split(letter).join(letters[letter]);
	}
	return word;
};

exports.escapeRegex = function(str) {
	if (str) {
		return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$]/g, "\\$&"); //eslint-disable-line
	}
};

exports.italiciseH = function(name) {
	if (name) {
		return exports.replace(name, {
			'ᴴ': '_H_',
			'ʰ': '_h_'
		});
	}
};

exports.htmlItalics = function(name) {
	if (name) {
		return exports.replace(name, italics);
	}
};

exports.removeMacrons = function(name) {
	if (name) {
		return exports.replace(name, Object.assign({}, macrons, superscripts));
	}
};

exports.createCode = function(name) {
	if (name) {
		return exports.replace(name, Object.assign({}, macrons, superscripts, punctuation)).toLowerCase();
		//return exports.replace(name.en || name.mi, Object.assign({}, macrons, superscripts, punctuation)).toLowerCase();
	}
};

exports.createCodeNew = function(name) {
	return exports.replace(name.en || name.mi, Object.assign({}, macrons, superscripts, punctuation)).toLowerCase();
};

exports.createSlug = name => {
	return {
		en: utils.createCode(name.en === island.name.mi ? null : island.name.en),
		mi: utils.createCode(name.mi),
	};
};

exports.cleanobj = function(o) {
	for (var k in o) {
		if (typeof o[k] === 'object') {
			exports.cleanobj(o[k]);
		};
		if (['-', ' ', '', undefined, null].indexOf(o[k]) > -1 || (typeof (o[k]) === 'object' && Object.keys(o[k]).length === 0)) {
			delete o[k];
		}
	}
	return o;
};

exports.sentenceCase = function(sentence) {
	if (sentence) {
		return sentence.charAt(0).toUpperCase() + sentence.slice(1);
	}
};

exports.unique = function(arr) {
	return arr.filter((value, index, self) => ((typeof value === 'object') ? index === self.findIndex((t) => (t._id === value._id)) : self.indexOf(value) === index));
};
