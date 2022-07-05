const changeCase = require('change-case');
// const pluralise = require('pluralize');
// const {}

const locale = {
	en: require('./en.json'),
	mi: require('./mi.json'),
};

function getPlural(text) {
	return text.split('|').pop().trim();
}

function getSingular(text) {
	return text.split('|').shift().trim();
}

const routes = {en: [], mi: []};
for (const key in locale.en.type) {
	// const types = pluralise.plural(key);
	const type = getSingular(locale.en.type[key]).replace(' ', '');
	const types = getPlural(locale.en.type[key]).replace(' ', '');
	routes.en.push({
		path: `/en/${types}/`,
		component: `./src/pages/${changeCase.sentenceCase(types)}.vue`,
	});
	routes.en.push({
		path: `/en/${types}/:id`,
		component: `./src/templates/${changeCase.sentenceCase(type)}.vue`,
	});
	routes.mi.push({
		path: `/mi/${locale.mi.type[key].replace(' ', '')}/`,
		component: `./src/pages/${changeCase.sentenceCase(types)}.vue`,
	});
	routes.mi.push({
		path: `/mi/${locale.mi.type[key].replace(' ', '')}/:id`,
		component: `./src/templates/${changeCase.sentenceCase(type)}.vue`,
	});
}

routes.en.push({
	path: '/en/',
	component: './src/pages/Index.vue',
});
routes.mi.push({
	path: '/mi/',
	component: './src/pages/Index.vue',
});

routes['en-nz'] = routes.en;
delete routes.en;

routes['mi-nz'] = routes.mi;
delete routes.mi;

console.log(routes);

module.exports = routes;
