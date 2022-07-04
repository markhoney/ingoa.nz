module.exports = function (i18n) {
	return {
		get locale() {
			//Return the code for the language that is not currently selected in i18n
			return i18n.locale.slice(0, 2);
		},
		get all() {
			//Return an array of locale codes
			return i18n.availableLocales.map((locale) => locale.slice(0, 2));
		},
		opposite(locale) {
			//Return the code for the language that is not currently selected in i18n
			if (this.all.length !== 2) return;
			return this.all.find((loc) => loc !== locale);
		},
		get alt() {
			//Return the code for the language that is not currently selected in i18n
			// return this.all.find((locale) => locale !== i18n.locale);
			return this.opposite(this.locale);
		},
		complete(locales) {
			//Return true if the locale exists in both languages
			if (locales) return locales.en && locales.mi;
		},
		named(locales, locale, fallback) {
			if (!locales) return;
			if (locales[locale]) return locales[locale];
			if (locales[this.opposite(locale)]) {
				if (fallback === false) return;
				return locales[this.opposite(locale)];
			}
			return fallback;
		},
		mi(locales, fallback) {
			//Return the locale in Māori if it exists, or in English otherwise
			// return locales?.mi || fallback && locales.en;
			return this.named(locales, 'mi', fallback);
		},
		en(locales, fallback) {
			//Return the locale in English if it exists, or in Māori otherwise
			// return locales?.en || fallback && locales.mi;
			return this.named(locales, 'en', fallback);
		},
		current(locales, fallback) {
			//Return the locale in the currently selected i18n language if it exists, otherwise return the other locale
			return this.named(locales, this.locale, fallback);
		},
		other(locales, fallback) {
			//If both translations of the locale exist, return the locale in the language that isn't currently selected in i18n, otherwise return a blank placeholder
			return this.named(locales, this.alt, fallback);
		},
		first(locales) {
			//Return the locale in the currently selected i18n language if it exists, otherwise return the other locale
			return this.named(locales, this.locale);
		},
		both(locales, prefix = ' (', suffix = ')', fallback = '') {
			//Return the locale in the currently selected language, followed by the locale in the alternative language in brackets, if it exists
			if (locales && this.complete(locales)) {
				return locales[this.locale] + (locales[this.alt] ? prefix + locales[this.alt] + suffix : fallback);
			}
			return locales[this.locale] || locales[this.alt];
		},
	};
};
