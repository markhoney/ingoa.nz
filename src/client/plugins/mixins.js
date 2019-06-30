import Vue from 'vue';

Vue.mixin({
	methods: {
		localeAlt() {
			//Return the code for the language that isn't currently selected in i18n
			if (this.$i18n.locale === 'en') return 'mi';
			return 'en';
		},
		maoriTitle(title) {
			//Return the title in Maori if it exists, or in English otherwise
			if (title) return title.mi || title.en;
		},
		englishTitle(title) {
			//Return the title in Maori if it exists, or in English otherwise
			if (title) return title.en || title.mi;
		},
		localeTitle(title) {
			//Return the title in the currently selected i18n language if it exists, otherwise return the other title
			if (title) return title[this.$i18n.locale] || title[this.localeAlt()];
		},
		localeCode(code) {
			//Return the code in the currently selected i18n language if it exists, otherwise return the other code
			if (code) return code[this.$i18n.locale] || code[this.localeAlt()];
		},
		localeAltTitle(title, blank) {
			//If both translations of the title exist, return the title in the language that isn't currently selected in i18n, otherwise return a blank placeholder
			if (title && title.en && title.mi) return title[this.localeAlt()];
			return blank;
		},
		localeTitles(title) {
			//Return the title in the currently selected language, followed by the title in the alternative language in brackets, if it exists
			if (title && this.localeBothTitles(title)) {
				return title[this.$i18n.locale] + (title[this.localeAlt()] ? ' (' + title[this.localeAlt()] + ')' : '');
			}
			return title[this.$i18n.locale] || title[this.localeAlt()];
		},
		localeBothTitles(title) {
			//Return true if the title exists in both languages
			if (title) return title.en && title.mi;
		},
	},
});
