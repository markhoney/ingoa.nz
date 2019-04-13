const pkg = require('./package');
const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin');

const {execute, makePromise} = require('apollo-link');
const {createHttpLink} = require('apollo-link-http');
const fetch = require('node-fetch');
const gql = require('graphql-tag');

module.exports = {
	mode: 'universal',
	srcDir: 'src/client/',

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

	loading: {color: '#f00'},

	css: [
		'~/assets/style/app.styl'
	],

	router: {
    prefetchLinks: (process.env.NODE_ENV === 'production'),
	},

	generate: {
		//routes: import('./routes')
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
				placenames {
					code
				}
			}`})).then(data => {
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
					...data.islands.map(island => 'island/' + island.code),
					...data.regions.map(region => 'region/' + region.code),
					...data.zones.map(zone => 'zone/' + zone.code),
					...data.zones.map(zone => 'old/' + zone.code),
					...data.speakers.map(speaker => 'speaker/' + speaker.code),
					...data.groups.map(group => 'group/' + group.code),
					...data.features.map(feature => 'feature/' + feature.code),
					...data.ngaiwi.map(iwi => 'iwi/' + iwi.code),
					...data.placenames.map(placename => 'placename/' + placename.code),
				];
			}).catch(error => console.log(`received error ${error}`))
		}		
	},

	plugins: [
		'~/plugins/vuetify',
		'~/plugins/filters',
		'~/plugins/mixins',
		'~/plugins/googlemaps',
		//'~/plugins/gql.js'
	],

	modules: [
		'@nuxtjs/apollo',
		'@nuxtjs/pwa',
		'@nuxtjs/sitemap',
		'@nuxtjs/webpackmonitor',
		'@nuxtjs/robots',
		['@nuxtjs/localtunnel', {subdomain: 'ingoa'}],
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
			default: '~/plugins/apollo.js'
		},
	},

	vuetify: {
		treeShake: true,
	},

	build: {
		transpile: ['vuetify/lib', /^vue2-google-maps($|\/)/],
		plugins: [new VuetifyLoaderPlugin()],
		loaders: {
			stylus: {
				import: ['~assets/style/variables.styl']
			}
		},
		extend(config, ctx) {
		}
	}
};
