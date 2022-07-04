const siteName = 'Ngā Ingoa';

const collections = ['Island', 'Part', 'Map', 'Region', 'Sector', 'District', 'Zone', 'Group', 'Feature', 'Iwi', 'Placename', 'Speaker'];

function getItemsNames(items) {
	if (!items) return [];
	return items.map((item) => getNames(item.name)).flat();
}

function getNames(name) {
	if (!name) return [];
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
	titleTemplate: `%s | ${siteName}`,
	plugins: [
		'~/src/data/gridsome-source-ingoa.js',
		{
			use: 'gridsome-plugin-flexsearch',
			options: {
				searchFields: ['namelist'],
				collections: collections.map((collection) => ({
					typeName: collection,
					indexName: collection,
					fields: ['name'],
					transform: (node) => ({
						...node,
						namelist: [...new Set([
							...getNames(node.name),
							...getItemsNames(node.names),
							...getItemsNames(node.places),
						])],
					}),
				})),
			},
		},
		{
			use: 'gridsome-plugin-feed',
			options: {
				contentTypes: collections,
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
		...collections.reduce((templates, type) => ({...templates, [type]: `/${type.toLowerCase()}s/:id`}), {}),
	},
};
