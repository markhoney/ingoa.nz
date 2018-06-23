module.exports = {
  /*
  ** Headers of the page
  */
  head: {
		//title: 'Ngā Ingoa o Aotearoa',
		titleTemplate: '%s | Ngā Ingoa o Aotearoa',
    meta: [
      {charset: 'utf-8'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1'},
      {hid: 'description', meta: 'description', content: 'Ngā Ingoa o Aotearoa: An oral dictionary of Māori placenames'}
    ],
    link: [
      {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'}
    ]
  },
  /*
  ** Global CSS
  */
  css: ['~assets/css/main.css'],
  /*
  ** Add axios globally
  */
  build: {
    vendor: ['axios']
	},
	plugins: [
		'~plugins/filters.js',
		'~/plugins/mixins'
	],
	modules: [
		'@nuxtjs/axios',
		//['@nuxtjs/localtunnel', {subdomain: 'ingoa'}],
		'@nuxtjs/pwa',
		'@nuxtjs/vuetify',
		['nuxt-i18n', {
			parsePages: false,
			strategy: 'prefix_except_default',
			defaultLocale: 'en',
			lazy: true,
			langDir: 'lang/',
			locales: [{
				code: 'en',
				iso: 'en-NZ',
				name: 'English',
				image: '/media/images/language/en.png',
				file: 'en.js'
			},
			{
				code: 'mi',
				iso: 'mi-NZ',
				name: 'Māori',
				image: '/media/images/language/mi.png',
				file: 'mi.js'
			}],
			pages: {
				about: {
					en: '/about',
					mi: '/mo',
				},
				regions: {
					en: '/regions',
					mi: '/whaitua'
				},
				'regions/_region': {
					en: '/regions/:region',
					mi: '/whaitua/:region'
				},
				islands: {
					en: '/islands',
					mi: '/motu'
				},
				'islands/_island': {
					en: '/islands/:island',
					mi: '/motu/:island'
				},
				zones: {
					en: '/zones',
					mi: '/hauni'
				}
			}
    }]
	]
}
