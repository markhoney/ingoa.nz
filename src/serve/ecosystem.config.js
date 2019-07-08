module.exports = {
	apps : [
		{
			name: "apollo",
			script: "src/server/apollo/index.js",
		},
		{
			name: "nuxt",
			script: "nuxt",
			args: ["start"],
		},
		{
			name: "caddy",
			script: "caddy",
			args: ["-agree"],
		}
	]
};
