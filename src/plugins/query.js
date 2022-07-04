module.exports = {
	clean($page) {
		for (const field of Object.keys($page)) {
			if ($page[field] instanceof Object && Object.getPrototypeOf($page[field]) == Object.prototype) {
				module.exports.clean($page[field]);
			} else if (field === 'edges') {
				$page = $page.edges.map((edge) => edge.node);
			}
		}
		return $page;
	},
	simplify($page) {
		if (!$page) return [];
		return module.exports.clean(Object.values($page)[0]);
	},
	type($page) {
		if (!$page) return;
		return Object.keys($page)[0].replace('all', '').toLowerCase();
	},
};
