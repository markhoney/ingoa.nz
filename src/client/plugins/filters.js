import Vue from 'vue';

function locale(locale) {
	return locale;
}

function altLocale(locale) {
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
	/*if (!text) return null;
	if (text === '') return '';
	return text.replace(/\b\w+/g, function(s) {
		return s.charAt(0).toUpperCase() + s.substr(1).toLowerCase();
	});*/
	return text.toLowerCase().split(' ').map(function(word) {
    return word.replace(word[0], word[0].toUpperCase());
  }).join(' ');
});

Vue.filter('maori', (title) => { // Return the name in Maori if it exists, or in English otherwise
	return title.mi;
});

Vue.filter('english', (title) => { // Return the name in Maori if it exists, or in English otherwise
	return title.en;
});

Vue.filter('locale', (title, locale) => { // Return the name in the currently selected i18n language if it exists, otherwise return the other name
	return title[locale] || title[altLocale(locale)];
});

Vue.filter('alt', (title, locale) => { // If both translations of the name exist, return the name in the language that isn't currently selected in i18n, otherwise return a blank placeholder
	if (title.en && title.mi) return title[altLocale(locale)];
});

Vue.filter('both', (title) => { // Return the name in the currently selected language, followed by the name in the alternative language in brackets, if it exists
	if (title.en && title.mi) {
		return title[locale] + (title[altLocale(locale)] ? ' (' + title[altLocale(locale)] + ')' : '');
	}
	return title[locale] || title[altLocale(locale)];
});
