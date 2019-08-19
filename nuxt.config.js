//if (process.env.NODE_ENV != 'production') require('appmetrics-dash').attach({url: '/metrics', title: 'Nuxt.js'});

const pkg = require('./package');

require('dotenv').config();

const host = process.env.HOST || 'localhost';
const graph = 'http://' + host + ':4000/graphql';

module.exports = {
	env: {
		graphServer: graph,
		graphClient: (process.env.BASE_URL && !process.env.BASE_URL.includes(host) ? process.env.BASE_URL + '/graphql' : graph),
		dev: process.env.NODE_ENV !== 'production',
	},
	mode: 'universal',
	srcDir: './src/client/',
	modern: true,
	server: {
		host: host,
		port: process.env.PORT || (process.env.dev ? 8000 : 3000),
	},
	router: {
		prefetchLinks: !process.env.dev,
	},
	/*serverMiddleware: [
		{path: '/graphql', handler: '../server/apollo/middleware.js'},
	],*/
	/*css: [
		'@/assets/style/app.styl'
	],*/
	loading: {color: '#f00'},

	head: {
		//title: pkg.name,
		titleTemplate: '%s | ' + pkg.name,
		meta: [
			{charset: 'utf-8'},
			{name: 'viewport', content: 'width=device-width, initial-scale=1'},
			{hid: 'description', name: 'description', content: pkg.description}
		],
		link: [
			{rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'},
			{
				rel: 'stylesheet',
				href:
					'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons'
			}
		]
	},

	generate: {
		//dir: 'docs',
		routes: require('./src/routes/dynamic'),
	},

	plugins: [
		//'@/plugins/vuetify',
		'@/plugins/filters',
		'@/plugins/mixins',
		//'@/plugins/googlemaps',
		//'@/plugins/eventbus',
		'@/plugins/gql.js',
	],

	devModules: [
		'@nuxtjs/vuetify',
		//['@nuxtjs/localtunnel', {subdomain: 'ingoa'}],
	],

	modules: [
		'@nuxtjs/apollo',
		'@nuxtjs/dotenv',
		'@nuxtjs/pwa',
		//'@nuxtjs/sitemap',
		'@nuxtjs/webpackmonitor',
		'@nuxtjs/robots',
		//['@nuxtjs/feed', {}],
		/*['@nuxtjs/google-analytics', {
			id: 'UA-45273295-4'
		}],*/
		'nuxt-helmet',
		'nuxt-leaflet',
		'nuxt-trailingslash-module',
		[
			'nuxt-i18n',
			{
				strategy: 'prefix_except_default',
				defaultLocale: 'en',
				lazy: true,
				langDir: 'locales/',
				locales: require('./src/client/locales.json'),
				parsePages: false,
				pages: require('./src/routes/pages'),
			},
		],
	],

	apollo: {
		includeNodeModules: true,
		clientConfigs: {
			default: '@/plugins/apollo.js'
		},
	},

	build: {
		//transpile: [/^vue2-google-maps($|\/)/],
		extractCSS: true,
		optimizeCSS: true,
		/*babel: {
			presets({isServer}) {
				return [
					[
						require.resolve('@nuxt/babel-preset-app'),
						{
							buildTarget: isServer ? 'server' : 'client',
							corejs: {version: 3}
						}
					]
				];
			}
		}*/
	}
};
