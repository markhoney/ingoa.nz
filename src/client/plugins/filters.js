import Vue from 'vue';

function locale(locale) {
	return locale;
}

function localeAlt(locale) {
	if (locale === 'en') return 'mi';
	return 'en';
}

Vue.filter('initialcase', function(text) {
	if (!text) return null;
	if (text === '') return '';
	return text[0].toUpperCase() + text.slice(1);
});

Vue.filter('uppercase', function(text) {
	if (!text) return null;
	if (text === '') return '';
	return text.toUpperCase();
});

Vue.filter('lowercase', function(text) {
	if (!text) return null;
	if (text === '') return '';
	return text.toLowerCase();
});

Vue.filter('titlecase', function(text) {
	return text.toLowerCase().split(' ').map(function(word) {
    return word.replace(word[0], word[0].toUpperCase());
  }).join(' ');
});

Vue.filter('maori', (locale) => { // Return the name in Māori if it exists, or in English otherwise
	return locale.mi;
});

Vue.filter('english', (locale) => { // Return the name in Māori if it exists, or in English otherwise
	return locale.en;
});

Vue.filter('locale', (locale, code) => { // Return the name in the currently selected i18n language if it exists, otherwise return the other name
	return locale[code] || locale[localeAlt(code)];
});

Vue.filter('localeAlt', (locale, code) => { // If both translations of the name exist, return the name in the language that isn't currently selected in i18n, otherwise return a blank placeholder
	if (locale.en && locale.mi) return locale[localeAlt(code)];
});

Vue.filter('both', (locale, code) => { // Return the name in the currently selected language, followed by the name in the alternative language in brackets, if it exists
	if (locale.en && locale.mi) {
		return locale[code] + (locale[localeAlt(code)] ? ' (' + locale[localeAlt(code)] + ')' : '');
	}
	return locale[code] || locale[localeAlt(code)];
});
