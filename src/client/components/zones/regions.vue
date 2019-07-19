<template>
	<section>
		<template v-for="region in regions">
			<h2 class="headline mt5 mb4" :key="region.code">{{localeBoth(region.title)}}</h2>
			<zones field="region._id" :value="region._id" :cards="false" :key="region.code" />
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
			regions: {
				query: gql`query regions($field: String, $value: String, $lang: String) {
					regions(filter: [{field: $field, value: $value}], lang: $lang) {
						_id
						code
						title {
							en
							mi
						}
					}
				}`,
				variables() {
					return {
						field: this.field,
						value: this.value,
						lang: this.$i18n.locale,
					}
				},
			},
		},
	}
</script>

<style scoped>
	ul {
		height: 100px;
		display: flex;
		flex-direction: column;
		flex-wrap: wrap;
	}
</style>
