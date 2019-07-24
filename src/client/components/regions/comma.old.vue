<template>
	<p><slot />
		<nuxt-link v-for="(region, index) in regions" :key="region._id" :to="localePath({name: 'region-region', params: {region: localeCurrent(region.slug)}})" no-prefetch>
			{{localeCurrent(region.title)}}<template v-if="index != (region.length - 1)">, </template>
		</nuxt-link>
	</p>
</template>

<script>

	export default {
		props: {
			field: String,
			value: String,
		},
		apollo: {
			regions: {
				query() {
					return this.$gql`query regions($field: String, $value: String) {
						regions(filter: [{field: $field, value: $value}]) {
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
					}`;
				},
				variables() {
					return {
						field: this.field,
						value: this.value,
					};
				},
				watchLoading (isLoading, countModifier) {
					this.$store.commit('loading', countModifier);
				},
			},
		},
	};
</script>
