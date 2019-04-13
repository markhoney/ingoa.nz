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

Vue.filter('titlecase', function(text) {
	if (!text) return null;
	if (text === '') return '';
	return text.replace(/\b\w+/g, function(s) {
		return s.charAt(0).toUpperCase() + s.substr(1).toLowerCase();
	});
});

Vue.filter('maori', (name) => { // Return the name in Maori if it exists, or in English otherwise
	return name.mi;
});

Vue.filter('english', (name) => { // Return the name in Maori if it exists, or in English otherwise
	return name.en;
});

Vue.filter('locale', (name, locale) => { // Return the name in the currently selected i18n language if it exists, otherwise return the other name
	return name[locale] || name[altLocale(locale)];
});

Vue.filter('alt', (name, locale) => { // If both translations of the name exist, return the name in the language that isn't currently selected in i18n, otherwise return a blank placeholder
	if (name.en && name.mi) return name[altLocale(locale)];
});

Vue.filter('both', (name) => { // Return the name in the currently selected language, followed by the name in the alternative language in brackets, if it exists
	if (name.en && name.mi) {
		return name[locale] + (name[altLocale(locale)] ? ' (' + name[altLocale(locale)] + ')' : '');
	}
	return name[locale] || name[altLocale(locale)];
});
