<template>
	<v-app>
		<loading />
		<drawer />
		<toolbar />
		<!--<progressbar />-->
		<v-main>
			<v-container fill-height>
				<v-layout justify-center>
					<router-view />
				</v-layout>
			</v-container>
		</v-main>
		<mainfooter />
	</v-app>
</template>

<script>
	import toolbar from '@/components/base/headers/toolbar.vue';
	import loading from '@/components/base/loading/overlay.vue';
	//import progressbar from '@/components/base/loading/linear.vue';
	import drawer from '@/components/menu/drawer.vue';
	import mainfooter from '@/components/base/footer.vue';


	export default {
		components: {
			toolbar,
			loading,
			//progressbar,
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
