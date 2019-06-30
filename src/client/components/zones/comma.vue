<template>
	<p><slot />
		<nuxt-link v-for="(zone, index) in zones" :key="zone.code" :to="localePath({name: 'zone-zone', params: {zone: zone.code}})" no-prefetch>
			{{localeTitle(zone.title)}}<template v-if="index != (zones.length - 1)">, </template>
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
			zones: {
				query: gql`query zones($field: String, $value: String) {
					zones(filter: {field: $field, value: $value}) {
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
						value: this.value
					}
				},
			},
		}
	};
</script>
