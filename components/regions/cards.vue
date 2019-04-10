<template>
	<v-layout row wrap>
		<v-flex v-for="region in regions" :key="region.code" xs12 sm6 md4 class="pa-2">
			<region :code="region.code"/>
		</v-flex>
	</v-layout>
</template>

<script>
	import gql from 'graphql-tag';
	import region from '@/components/regions/card.vue';

	export default {
		components: {
			region,
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
						zones {
							_id
							code
							name {
								en
								mi
							}
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
	};
</script>
