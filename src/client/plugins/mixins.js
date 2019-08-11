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
		localeMaori(langs) {
			//Return the langs in Māori if it exists, or in English otherwise
			if (langs) return langs.mi || langs.en;
		},
		localeEnglish(langs) {
			//Return the langs in English if it exists, or in Māori otherwise
			if (langs) return langs.en || langs.mi;
		},
		localeCurrentOnly(langs, blank = "") {
			//Return the langs in the currently selected i18n language if it exists, otherwise return nothing
			if (langs) return langs[this.locale()] || blank;
		},
		localeCurrent(langs) {
			//Return the langs in the currently selected i18n language if it exists, otherwise return the other langs
			if (langs) return langs[this.locale()] || langs[this.localeAlt()];
		},
		localeOther(langs, blank = "") {
			//If both translations of the langs exist, return the langs in the language that isn't currently selected in i18n, otherwise return a blank placeholder
			if (langs && langs.en && langs.mi) return langs[this.localeAlt()];
			return blank;
		},
		localeBoth(langs) {
			//Return the langs in the currently selected language, followed by the langs in the alternative language in brackets, if it exists
			if (langs && this.localeBothExist(langs)) {
				return langs[this.locale()] + (langs[this.localeAlt()] ? ' (' + langs[this.localeAlt()] + ')' : '');
			}
			return langs[this.locale()] || langs[this.localeAlt()];
		},
		localeBothExist(langs) {
			//Return true if the langs exists in both languages
			if (langs) return langs.en && langs.mi;
		},
	},
});
