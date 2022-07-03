const siteName = 'Nga Ingoa';

const search = ['Island', 'Zone', ''];

function getNames(name) {
	return [
		name.locale?.en,
		name.locale?.mi,
		name.ascii?.mi,
		name.double?.mi,
		name.plural?.en,
		name.full?.en,
		name.transliteration?.en,
	].filter(Boolean);
}

module.exports = {
	siteName,
	// siteUrl: '',
	// siteDescription: '',
	siteUrl: 'https://ingoa.nz',
	plugins: [
		'~/src/data/gridsome-source-ingoa.js',
		{
			use: 'gridsome-plugin-flexsearch',
			options: {
				searchFields: ['names'],
				collections: search.map((collection) => ({
					typeName: collection,
					indexName: collection,
					fields: ['name'],
					transform: (collection) => ({
						...collection,
						names: [...new Set([
							...getNames(collection),
							...collection.names?.map((name) => getNames(name)).flat(),
							...collection.places?.map((place) => getNames(place)).flat(),
						])],
					}),
				})),
			},
		},
		{
			use: 'gridsome-plugin-feed',
			options: {
				contentTypes: search,
				feedOptions: {
					title: siteName,
					// description: '',
				},
				nodeToFeedItem: (node) => ({
					title: node.title,
					// date: node.date || node.fields.date,
					content: node.description,
				}),
			},
		},
		{
			use: '@gridsome/plugin-sitemap',
			options: {
				config: {
					'/**': {
						changefreq: 'monthly',
						priority: 0.5,
					},
				},
			},
		},
		{
			use: 'gridsome-plugin-pwa',
			options: {
				title: siteName,
				disableServiceWorker: true,
				serviceWorkerPath: '',
				shortName: siteName,
				cachedFileTypes: 'js,css',
				themeColor: '#e32929',
				backgroundColor: '#ffffff',
				icon: 'src/favicon.png',
			},
		},
		{
			use: "gridsome-plugin-i18n",
			options: {
				locales: [
					'en-nz',
					'mi-nz',
				],
				pathAliases: { // path segment alias for each locales
					'en-nz': 'en',
					'mi-nz': 'mi',
				},
				messages: {
					'en-nz': require('./src/locales/en.json'),
					'mi-nz': require('./src/locales/mi.json'),
				},
				fallbackLocale: 'en-nz',
				defaultLocale: 'en-nz',
				// enablePathGeneration: false,
				// routes: require('./src/routes.js')
			},
		},
	],
	templates: {
		Island: '/:id',
		Part: '/:id',
		Zone: [
			{
				path: '/zone/:id',
				component: './src/templates/Zone.vue',
			},
			{
				name: 'old',
				path: '/old/:id',
				component: './src/templates/OldZone.vue',
			},
		],
	},
};
