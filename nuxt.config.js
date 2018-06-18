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
	plugins: ['~plugins/filters.js'],
	modules: [
		'@nuxtjs/pwa',
		'@nuxtjs/vuetify',
		['nuxt-i18n', {
      locales: [{
				code: 'en',
				name: 'English',
				image: '~/assets/img/language/en.svg',
				svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30"><clipPath id="a"><path d="M30 15h30v15zv15H0zH0V0zV0h30z"/></clipPath><path d="M0 0v30h60V0z" fill="#00247d"/><path d="M0 0l60 30m0-30L0 30" stroke="#fff" stroke-width="6"/><path d="M0 0l60 30m0-30L0 30" clip-path="url(#a)" stroke="#cf142b" stroke-width="4"/><path d="M30 0v30M0 15h60" stroke="#fff" stroke-width="10"/><path d="M30 0v30M0 15h60" stroke="#cf142b" stroke-width="6"/></svg>',
				file: 'en.js'
			},
			{
				code: 'mi',
				name: 'Māori',
				image: '~/assets/img/language/mi.svg',
				svg: '<svg xmlns="http://www.w3.org/2000/svg" width="auto" height="auto" viewBox="0 0 108 60"><path fill="#FFF" d="M0 0h1080v600H0"/><path d="M0 80h300a135 135 0 0 1 0 270h780V0H0"/><path fill="#d40000" d="M0 190h300a80 80 0 0 1 0 160 55 55 0 0 0 0-110 110 110 0 0 0 0 220h780v140H0"/></svg>',
				file: 'mi.js'
			}],
			strategy: 'prefix_except_default',
			defaultLocale: 'en',
			lazy: true,
			langDir: 'lang/'
    }]
	]
}
