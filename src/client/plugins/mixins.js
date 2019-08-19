import Vue from 'vue';

Vue.mixin({
	methods: {
		caseUpper(text) {
			if (!text) return null;
			if (text === '') return '';
			return text.toUpperCase();
		},
		caseLower(text) {
			if (!text) return null;
			if (text === '') return '';
			return text.toLowerCase();
		},
		caseInitial(text) {
			if (!text) return null;
			if (text === '') return '';
			return text[0].toUpperCase() + text.slice(1);
		},
		caseTitle(text) {
			return text.toLowerCase().split(' ').map(function(word) {
				return word.replace(word[0], word[0].toUpperCase());
			}).join(' ');
		},
		locale() {
			//Return the code for the language that is currently selected in i18n
			return this.$i18n.locale;
		},
		localeAlt() {
			//Return the code for the language that is not currently selected in i18n
			return this.$i18n.locales.filter(locale => locale.code !== this.$i18n.locale)[0].code;
			//if (this.locale() === 'en') return 'mi';
			//return 'en';
		},
		locales() {
			//Return an array of locale codes
			return $i18n.locales.map(locale => locale.code);
		},
		localeSlug() {
			//Return the slug field name in the currently selected i18n language
			return "slug." + this.locale();
		},
		localeMaori(locale) {
			//Return the locale in Māori if it exists, or in English otherwise
			if (locale) return locale.mi || locale.en;
		},
		localeEnglish(locale) {
			//Return the locale in English if it exists, or in Māori otherwise
			if (locale) return locale.en || locale.mi;
		},
		localeCurrentOnly(locale, blank = "") {
			//Return the locale in the currently selected i18n language if it exists, otherwise return nothing
			if (locale) return locale[this.locale()] || blank;
		},
		localeCurrent(locale) {
			//Return the locale in the currently selected i18n language if it exists, otherwise return the other locale
			if (locale) return locale[this.locale()] || locale[this.localeAlt()];
		},
		localeOther(locale, blank = "") {
			//If both translations of the locale exist, return the locale in the language that isn't currently selected in i18n, otherwise return a blank placeholder
			if (locale && locale.en && locale.mi) return locale[this.localeAlt()];
			return blank;
		},
		localeBoth(locale) {
			//Return the locale in the currently selected language, followed by the locale in the alternative language in brackets, if it exists
			if (locale && this.localeBothExist(locale)) {
				return locale[this.locale()] + (locale[this.localeAlt()] ? ' (' + locale[this.localeAlt()] + ')' : '');
			}
			return locale[this.locale()] || locale[this.localeAlt()];
		},
		localeBothExist(locale) {
			//Return true if the locale exists in both languages
			if (locale) return locale.en && locale.mi;
		},
	},
});
