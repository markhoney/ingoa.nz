<template>
	<ul>
		<li v-for="zone in zones" :key="zone._id">
			<nuxt-link :to="localePath({name: 'zone-zone', params: {zone: localeCurrent(zone.slug)}})">{{localeBoth(zone.title)}}</nuxt-link>
		</li>
	</ul>
</template>

<script>
	export default {
		props: {
			field: String,
			value: String,
		},
		apollo: {
			zones: {
				query() {
					return this.$gql`query zones($field: String, $value: String) {
						zones(filter: [{field: $field, value: $value}]) {
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

<style scoped>
	ul {
		height: 100px;
		display: flex;
		flex-direction: column;
		flex-wrap: wrap;
	}
</style>
