<template>
	<p><slot />
		<nuxt-link v-for="(region, index) in regions" :key="region.code" :to="localePath({name: 'region-region', params: {region: region.code}})" no-prefetch>
			{{localeName(region.name)}}<template v-if="index != (region.length - 1)">, </template>
		</nuxt-link>
	</p>
</template>

<script>
	import gql from 'graphql-tag';

	export default {
		props: {
			field: String,
			value: String,
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
						value: this.value
					}
				},
			},
		}
	};
</script>
