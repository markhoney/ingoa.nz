<template>
	<ul>
		<li v-for="zone in zones" :key="zone._id">
			<nuxt-link :to="localePath({name: 'zone-zone', params: {zone: localeCurrent(zone.slug)}})">{{localeBoth(zone.title)}}</nuxt-link>
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
				query: gql`query zones($field: String, $value: String, $lang: String) {
					zones(filter: {field: $field, value: $value, lang: $lang}) {
						_id
						slug {
							en
							mi
						}
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
