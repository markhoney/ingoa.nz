module.exports = {
	apps : [
		{
			name: "build",
			cwd: "/app",
			script: "./node_modules/.bin/nuxt",
			args: ["build"],
			env: {
				NODE_ENV: "production",
			},
			autorestart: false,
		},
		{
			name: "nuxt",
			cwd: "/app",
			script: "./node_modules/.bin/nuxt",
			args: ["start"],
			env: {
				NODE_ENV: "production",
				//NODE_OPTIONS: "--max-old-space-size=4096",
			}
		},
		{
			name: "caddy",
			script: "/usr/bin/caddy",
			args: ["-agree", "-conf", "/etc/Caddyfile", "-log", "stdout", "-email", "mark@honeychurch.org"],
		}
	]
};
