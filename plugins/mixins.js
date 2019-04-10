import Vue from 'vue';

Vue.mixin({
	methods: {
		localeAlt() {
			//Return the code for the language that isn't currently selected in i18n
			if (this.$i18n.locale === 'en') return 'mi';
			return 'en';
		},
		maoriName(name) {
			//Return the name in Maori if it exists, or in English otherwise
			if (name) return name.mi || name.en;
		},
		englishName(name) {
			//Return the name in Maori if it exists, or in English otherwise
			if (name) return name.en || name.mi;
		},
		localeName(name) {
			//Return the name in the currently selected i18n language if it exists, otherwise return the other name
			if (name) return name[this.$i18n.locale] || name[this.localeAlt()];
		},
		localeCode(code) {
			//Return the code in the currently selected i18n language if it exists, otherwise return the other code
			if (code) return code[this.$i18n.locale] || code[this.localeAlt()];
		},
		localeAltName(name, blank) {
			//If both translations of the name exist, return the name in the language that isn't currently selected in i18n, otherwise return a blank placeholder
			if (name && name.en && name.mi) return name[this.localeAlt()];
			return blank;
		},
		localeNames(name) {
			//Return the name in the currently selected language, followed by the name in the alternative language in brackets, if it exists
			if (name && this.localeBothNames(name)) {
				return name[this.$i18n.locale] + (name[this.localeAlt()] ? ' (' + name[this.localeAlt()] + ')' : '');
			}
			return name[this.$i18n.locale] || name[this.localeAlt()];
		},
		localeBothNames(name) {
			//Return true if the name exists in both languages
			if (name) return name.en && name.mi;
		},
	},
});
