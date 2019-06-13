<template>
	<ul>
		<li v-for="zone in zones" :key="zone.code">
			<nuxt-link :to="localePath({name: 'zone-zone', params: {zone: zone.code}})">{{localeNames(zone.name)}}</nuxt-link>
		</li>
	</ul>
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
