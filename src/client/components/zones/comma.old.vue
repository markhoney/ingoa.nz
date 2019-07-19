<template>
	<p><slot />
		<nuxt-link v-for="(zone, index) in zones" :key="zone._id" :to="localePath({name: 'zone-zone', params: {zone: localeCurrent(zone.slug)}})" no-prefetch>
			{{localeCurrent(zone.title)}}<template v-if="index != (zones.length - 1)">, </template>
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
				query: gql`query zones($field: String, $value: String, $lang: String) {
					zones(filter: [{field: $field, value: $value}], lang: $lang) {
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
		}
	};
</script>
