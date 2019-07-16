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
	import toolbar from '@/components/base/headers/toolbar.vue';
	import drawer from '@/components/menu/drawer.vue';
	import mainfooter from '@/components/base/footer.vue';

	export default {
		components: {
			toolbar,
			drawer,
			mainfooter,
		},
		data() {
			return {
			};
		},
	};
</script>

<style scoped>
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
