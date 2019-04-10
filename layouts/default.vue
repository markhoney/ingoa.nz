<template>
	<v-app>
		<drawer />
		<toolbar />
		<v-content>
			<v-container fill-height>
				<v-layout justify-center>
					<router-view />
				</v-layout>
			</v-container>
		</v-content>
		<mainfooter />
	</v-app>
</template>

<script>
import toolbar from '@/components/headers/toolbar.vue';
import drawer from '@/components/menu/drawer.vue';
import mainfooter from '@/components/menu/footer.vue';

export default {
	components: {
		toolbar,
		drawer,
		mainfooter,
	},
	/*head: {
		script: [
			{
				src: 'https://unpkg.com/wavesurfer.js/dist/wavesurfer.min.js',
				//src: '@/node_modules/wavesurfer.js/dist/wavesurfer.min.js',
			},
			{
				src: 'https://unpkg.com/wavesurfer.js/dist/plugin/wavesurfer.regions.min.js',
				//src: '@/node_modules/wavesurfer.js/dist/plugin/wavesurfer.regions.min.js',
			},
		],
	},*/
	data() {
		return {
		};
	},
	/*mounted () {
			this.$store.dispatch('getMenu');
			this.$store.dispatch('getSuggestions');
		},*/
};
</script>

<style>
html {
	font-family: Helvetica, Tahoma, Verdana, Arial, sans-serif;
}

a {
	text-decoration: none;
}

#wave audio {
	margin-top: 2em;
}

.parallax.parallax__content {
	padding: 0 !important;
}
</style>
