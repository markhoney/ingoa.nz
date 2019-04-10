const pkg = require('./package');
const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin');

module.exports = {
	mode: 'universal',
	head: {
		//title: pkg.name,
		titleTemplate: '%s | ' + pkg.name,
		meta: [
			{ charset: 'utf-8' },
			{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
			{ hid: 'description', name: 'description', content: pkg.description }
		],
		link: [
			{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
			{
				rel: 'stylesheet',
				href:
					'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons'
			}
		]
	},
	loading: { color: '#fff' },
	css: [
		'~/assets/style/app.styl'
	],
	router: {
    prefetchLinks: (process.env.NODE_ENV === 'production'),
	},
	plugins: [
		'@/plugins/vuetify',
		'~/plugins/filters',
		'~/plugins/mixins',
		'~/plugins/googlemaps',
		//'~/plugins/gql.js'
	],

	/*
	** Nuxt.js modules
	*/
	modules: [
		'@nuxtjs/apollo',
		'@nuxtjs/axios',
		'@nuxtjs/pwa',
		'@nuxtjs/sitemap',
		['@nuxtjs/google-analytics', {
			id: 'UA-45273295-4'
		}],
		'nuxt-leaflet',
		'nuxt-trailingslash-module',
		[
			'nuxt-i18n',
			{
				strategy: 'prefix_except_default',
				defaultLocale: 'en',
				lazy: true,
				langDir: 'locales/',
				locales: [{
						code: 'en',
						iso: 'en-NZ',
						name: 'English',
						image: '/media/images/language/en.png',
						file: 'en.json',
					},
					{
						code: 'mi',
						iso: 'mi-NZ',
						name: 'Māori',
						image: '/media/images/language/mi.png',
						file: 'mi.json',
					},
				],
				parsePages: false,
				pages: require('./locales/pages.json'),
			},
		],
	],

	apollo: {
		includeNodeModules: true,
		clientConfigs: {
			default: '~/plugins/apollo.js'
		},
	},

	/*
	** Build configuration
	*/
	build: {
		transpile: ['vuetify/lib', /^vue2-google-maps($|\/)/],
		plugins: [new VuetifyLoaderPlugin()],
		loaders: {
			stylus: {
				import: ['~assets/style/variables.styl']
			}
		},
		/*
		** You can extend webpack config here
		*/
		extend(config, ctx) {
		}
	}
}
