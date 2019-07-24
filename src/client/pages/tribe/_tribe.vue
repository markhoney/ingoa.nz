<template>
	<section v-if="tribe">
		<h2>{{this.localeCurrent(this.tribe.title)}}</h2>
	</section>
</template>

<script>

	export default {
		apollo: {
			tribe: {
				query() {
					return this.$gql`query tribe($field: String, $value: String) {
						tribe(filter: [{field: $field, value: $value}]) {
							_id
							title {
								en
								mi
							}
							slug {
								en
								mi
							}
						}
					}`;
				},
				variables() {
					return {
						field: "slug",
						value: this.$route.params.tribe,
					};
				},
				watchLoading (isLoading, countModifier) {
					this.$store.commit('loading', countModifier);
				},
			},
		},
		watch: {
			tribe: function(tribe) {
				this.$store.commit('i18n/setRouteParams', {en: {tribe: tribe.slug.en}, mi: {tribe: tribe.slug.mi}});
			},
		},
		head() {
			return {
				title: (this.tribe ? this.localeCurrent(this.tribe.title) + ' (' + this.$tc('tribe') + ')' : ''),
			};
		},
	};
</script>
