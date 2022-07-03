<template>
	<default>
		<transition name="fade" appear>
			<router-view />
		</transition>
	</default>
</template>

<static-query>
	query {
		metadata {
			siteName
			siteDescription
		}
	}
</static-query>

<script>
	import Default from '~/layouts/Default.vue'
	export default {
		components: {
			Default,
		},
		metaInfo() {
			return {
				title: this.$static.metadata.siteName,
				meta: [
					{
						key: 'description',
						name: 'description',
						content: this.$static.metadata.siteDescription
					},
				],
			};
		},
	};
</script>

<style>
	.fade-enter-active {
		transition: opacity .5s;
	}

	.fade-enter {
		opacity: 0;
	}
</style>
