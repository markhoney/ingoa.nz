<template>
	<div>
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="8 8 32 32" style="width: 1rem;" class="cursor-pointer" @click="dark = !dark">
			<title>Switch to {{title}} mode</title>
			<path :fill="color" d="M31.3 25.2a7 7 0 10-14 0 7 7 0 0014 0zm-7 5a5 5 0 110-10 5 5 0 010 10zM23.3 34v6.2a1 1 0 102 0v-6.1a1 1 0 10-2 0zM23.3 10.2v6.2a1 1 0 102 0v-6.2a1 1 0 10-2 0zM34.2 36.5a1 1 0 001.4 0c.4-.4.4-1 0-1.4l-4.3-4.3a1 1 0 10-1.4 1.4l4.3 4.3zM13 14a1 1 0 000 1.3l4.3 4.4a1 1 0 001.5 0c.4-.4.4-1 0-1.5L14.4 14a1 1 0 00-1.4 0zM39.3 24.2h-6.1a1 1 0 100 2h6.1a1 1 0 100-2zM8.3 25.2c0 .6.5 1 1 1h6.2a1 1 0 100-2H9.3a1 1 0 00-1 1zM34.2 14L30 18.1a1 1 0 101.4 1.5l4.3-4.4a1 1 0 10-1.4-1.4zM13.7 36.8c.3 0 .5 0 .7-.3l4.4-4.3a1 1 0 10-1.5-1.4L13 35a1 1 0 00.7 1.7z"/>
		</svg>
	</div>
</template>

<script>
	export default {
		data: () => ({
			dark: false,
		}),
		computed: {
			color() {return this.dark ? '#eeeeee' : '#333333'},
			title() {return this.dark ? 'light' : 'dark'},
		},
		mounted() {
			// document.body.classList.add('dark-mode');
			if (window.localStorage.getItem('theme') === 'dark') this.dark = true;
			else if (window.localStorage.getItem('theme') === 'light') this.dark = false;
			else if (window.matchMedia('(prefers-color-scheme: dark)')) this.dark = true;
			else if (window.matchMedia('(prefers-color-scheme: light)')) this.dark = false;
			else if (window.matchMedia('(light-level: dim)')) this.dark = true;
			else if (window.matchMedia('(light-level: normal)')) this.dark = false;
			else if (window.matchMedia('(light-level: washed)')) this.dark = false;
		},
		watch: {
			dark(dark) {
				if (dark) {
					localStorage.setItem('theme', 'dark');
					document.body.classList.add('dark-mode');
					this.$store.commit('dark', true);
				} else {
					localStorage.setItem('theme', 'light');
					document.body.classList.remove('dark-mode');
					this.$store.commit('dark', false);
				}
			},
		},
	};
</script>
