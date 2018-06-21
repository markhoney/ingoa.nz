import Vue from 'vue'

Vue.mixin({
  methods: {
		localeAlt () {
			if (this.$i18n.locale == 'en') return 'mi';
			return 'en';
		},
    localeName (name) {
			return name[this.$i18n.locale] || name[this.localeAlt()];
		},
		localeAltName (name, blank) {
			if (name.en && name.mi) return name[this.localeAlt()];
			return blank;
		},
    localeNames (name) {
			if (this.localeBothNames(name)) {
				return name[this.$i18n.locale] + " (" + name[this.localeAlt()] + ")";
			}
			return name[this.$i18n.locale] || name[this.localeAlt()]
		},
		localeBothNames (name) {
			return name.en && name.mi;
		}
  }
})
