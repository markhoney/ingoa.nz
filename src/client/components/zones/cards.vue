<template>
	<v-layout row wrap>
		<v-flex v-for="zone in zones" :key="zone.code" xs12 sm6 md4 class="pa-2">
			<zone :code="zone.code" />
		</v-flex>
	</v-layout>
</template>

<script>
	import gql from 'graphql-tag';
	import zone from '@/components/zones/card.vue';

	export default {
		components: {
			zone,
		},
		props: {
			field: String,
			value: String,
		},
		apollo: {
			zones: {
				query: gql`query zones($field: String, $value: String) {
					zones(filter: {field: $field, value: $value}) {
						_id
						code
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
