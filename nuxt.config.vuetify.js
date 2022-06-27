const pkg = require('./package');

//const {execute, makePromise} = require('apollo-link');
//const {createHttpLink} = require('apollo-link-http');
//const fetch = require('node-fetch');
//const gql = require('graphql-tag');

require('dotenv').config();

const host = process.env.HOST || 'localhost';
const graph = 'http://' + host + ':4000/graphql';

module.exports = {
	env: {
		graphServer: graph,
		graphClient: (process.env.BASE_URL && !process.env.BASE_URL.includes(host) ? process.env.BASE_URL + '/graphql' : graph),
		dev: process.env.NODE_ENV !== 'production',
		googleMapsAPI: process.env.GOOGLE_API_KEY,
	},
	mode: 'universal',
	srcDir: 'src/client/',
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
		'~/assets/style/app.styl'
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
		]
	},

	generate: {
		//dir: 'docs',
		//routes: require('./routes'),
		routes: function() {
			return require('./routes');
		}
	},

	plugins: [
		'@/plugins/filters',
		'@/plugins/mixins',
		'@/plugins/googlemaps',
	],

	modules: [
		'@nuxtjs/apollo',
		'@nuxtjs/pwa',
		'@nuxtjs/sitemap',
		'@nuxtjs/webpackmonitor',
		'@nuxtjs/robots',
		'@nuxtjs/vuetify',
		//['@nuxtjs/localtunnel', {subdomain: 'ingoa'}],
		//['@nuxtjs/feed', {}],
		/*['@nuxtjs/google-analytics', {
			id: 'UA-45273295-4'
		}],*/
		'nuxt-leaflet',
		'nuxt-trailingslash-module',
		[
			'nuxt-i18n',
			{
				strategy: 'prefix_except_default',
				defaultLocale: 'en',
				lazy: true,
				langDir: 'locales/',
				locales: require('./src/client/locales/locales.json'),
				parsePages: false,
				pages: require('./src/client/locales/pages.js'),
				vuex: false,
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
		transpile: [/^vue2-google-maps($|\/)/],
		loaders: {
			stylus: {
				import: ['~assets/style/variables.styl']
			}
		},
		extractCSS: true,
		optimizeCSS: true,
		/*babel: {
			presets({isServer}) {
				return [
					[
						require.resolve('@nuxt/babel-preset-app'),
						{
							targets: isServer ? {node: '10'} : {ie: '11'},
							corejs: {version: 3}
						}
					]
				]
			}
		}*/
	}
};
