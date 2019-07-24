<template>
	<section>
		<div v-for="region in regions" :key="region._id">
			<h2>{{localeCurrent(region.title)}}</h2>
			<zone field="region._id" :value="region._id" />
		</div>
	</section>
</template>

<script>
	import zone from '@/components/zones/list.vue';
	export default {
		components: {
			zone,
		},
		apollo: {
			regions: {
				query() {
					return this.$gql`query regions {
						regions {
							_id
							title {
								en
								mi
							}
						}
					}`;
				},
				watchLoading (isLoading, countModifier) {
					this.$store.commit('loading', countModifier);
				},
			},
		},
	};
</script>
