const pkg = require('./package');
const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin');

const {execute, makePromise} = require('apollo-link');
const {createHttpLink} = require('apollo-link-http');
const fetch = require('node-fetch');
const gql = require('graphql-tag');

require('dotenv').config({path: './.secrets.env'});

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
	serverMiddleware: [
		{path: '/graphql', handler: '../server/apollo/middleware.js'},
	],
	css: [
		'@/assets/style/app.styl'
	],
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
		//routes: require('./routes'),
		routes: function() {
			return makePromise(execute(createHttpLink({uri: 'http://localhost:4000/graphql', fetch: fetch}), {query: gql`{
				islands {
					code
				}
				regions {
					code
				}
				zones {
					code
				}
				speakers {
					code
				}
				groups {
					code
				}
				features {
					code
				}
				ngaiwi {
					code
				}
#				placenames {
#					code
#				}
			}`})).then(response => {
				const staticRoutes = [
					"about",
					"region",
					"island",
					"map",
					"zone",
					"speaker",
					"feature",
					"group",
					"iwi",
					"old",
					"old/contents",
				];
				return [
					...staticRoutes,
					...response.data.islands.map(island => '/island/' + island.code),
					...response.data.regions.map(region => '/region/' + region.code),
					...response.data.zones.map(zone => '/zone/' + zone.code),
					...response.data.zones.map(zone => '/old/' + zone.code),
					...response.data.speakers.map(speaker => '/speaker/' + speaker.code),
					...response.data.groups.map(group => '/group/' + group.code),
					...response.data.features.map(feature => '/feature/' + feature.code),
					...response.data.ngaiwi.map(iwi => '/iwi/' + iwi.code),
					//...response.data.placenames.map(placename => '/placename/' + placename.code),
				];
			}).catch(error => console.log(`received error ${error}`));
		}
	},

	plugins: [
		'@/plugins/vuetify',
		'@/plugins/filters',
		'@/plugins/mixins',
		'@/plugins/googlemaps',
		//'@/plugins/gql.js'
	],

	modules: [
		'@nuxtjs/apollo',
		'@nuxtjs/pwa',
		'@nuxtjs/sitemap',
		'@nuxtjs/webpackmonitor',
		'@nuxtjs/robots',
		//['@nuxtjs/localtunnel', {subdomain: 'ingoa'}],
		//['@nuxtjs/feed', {}],
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
				locales: require('./src/client/locales/locales.json'),
				parsePages: false,
				pages: require('./src/client/locales/pages.json'),
			},
		],
	],

	apollo: {
		includeNodeModules: true,
		clientConfigs: {
			default: '@/plugins/apollo.js'
		},
	},

	vuetify: {
		treeShake: true,
		css: false,
	},

	build: {
		transpile: ['vuetify/lib', /^vue2-google-maps($|\/)/],
		plugins: [new VuetifyLoaderPlugin()],
		loaders: {
			stylus: {
				import: ['~assets/style/variables.styl']
			}
		},
		extractCSS: true,
		optimizeCSS: true,
		extend(config, ctx) {
		},
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
