module.exports = {
	apps : [
		{
			name: "apollo",
			script: "src/server/apollo/index.js",
			env: {
				NODE_ENV: "production",
			}
		},
		{
			name: "nuxt",
			script: "src/client/index.js",
			env: {
				NODE_ENV: "production",
			}
		},
		{
			name: "caddy",
			script: "caddy",
			args: ["-agree", "-log", "stdout", "-email", "mark@honeychurch.org"],
		}
	]
};
