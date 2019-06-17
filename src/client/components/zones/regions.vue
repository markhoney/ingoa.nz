<template>
	<section>
		<template v-for="region in regions">
			<h2 class="headline mt5 mb4" :key="region.code">{{localeNames(region.name)}}</h2>
			<zones field="region_id" :value="region._id" :cards="false" :key="region.code" />
		</template>
	</section>
</template>

<script>
	import zones from '@/components/zones/zones.vue';

	export default {
		components: {
			zones
		},
		props: {
			field: String,
			value: String
		},
		apollo: {
			regions: {
				query: gql`query regions($field: String, $value: String) {
					regions(filter: {field: $field, value: $value}) {
						_id
						code
						name {
							en
							mi
						}
					}
				}`,
				variables() {
					return {
						field: this.field,
						value: this.value,
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
