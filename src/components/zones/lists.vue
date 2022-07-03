<template>
	<section>
		<div v-for="sector in sectors" :key="sector._id">
			<h2>{{localeCurrent(sector.name.locale)}}</h2>
			<zone field="sector._id" :value="sector._id" />
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
			sectors: {
				query() {
					return this.$gql`query sectors {
						sectors {
							_id
							name {
								locale {
									en
									mi
								}
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
