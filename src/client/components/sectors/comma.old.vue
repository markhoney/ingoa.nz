<template>
	<p><slot />
		<nuxt-link v-for="(sector, index) in sectors" :key="sector._id" :to="localePath({name: 'sector-sector', params: {sector: localeCurrent(sector.slug)}})" no-prefetch>
			{{localeCurrent(sector.name.locale)}}<template v-if="index != (sector.length - 1)">, </template>
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
			sectors: {
				query() {
					return this.$gql`query sectors($field: String, $value: String) {
						sectors(filter: [{field: $field, value: $value}]) {
							_id
							slug {
								en
								mi
							}
							name {
								locale {
									en
									mi
								}
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
