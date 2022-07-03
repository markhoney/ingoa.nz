<template>
	<section>
		<template v-for="sector in sectors">
			<h2 class="headline mt5 mb4" :key="sector.code">{{localeBoth(sector.name.locale)}}</h2>
			<zones field="sector._id" :value="sector._id" :cards="false" :key="sector.code" />
		</template>
	</section>
</template>

<script>
	import zones from '@/components/zones/cards.vue';

	export default {
		components: {
			zones
		},
		props: {
			field: String,
			value: String,
		},
		apollo: {
			sectors: {
				query() {
					return this.$gql`query sectors($field: String, $value: String) {
						sectors(filter: [{field: $field, value: $value}]) {
							_id
							code
							name {
								locale {
									en
									mi
								}
							}
						}
					}`;
				},
				variables() {
					return {
						field: this.field,
						value: this.value,
					};
				},
				watchLoading (isLoading, countModifier) {
					this.$store.commit('loading', countModifier);
				},
			},
		},
	};
</script>

<style scoped>
	ul {
		height: 100px;
		display: flex;
		flex-direction: column;
		flex-wrap: wrap;
	}
</style>
