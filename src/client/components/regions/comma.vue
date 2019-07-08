<template>
	<p><slot />
		<nuxt-link v-for="(region, index) in regions" :key="region._id" :to="localePath({name: 'region-region', params: {region: localeCurrent(region.slug)}})" no-prefetch>
			{{localeCurrent(region.title)}}<template v-if="index != (region.length - 1)">, </template>
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
				query: gql`query regions($field: String, $value: String, $lang: String) {
					regions(filter: {field: $field, value: $value, lang: $lang}) {
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
