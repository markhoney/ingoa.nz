<template>
	<section v-if="tribe">
		<h2>{{this.localeCurrent(this.tribe.title.locale)}}</h2>
	</section>
</template>

<script>
	const param = "tribe";

	export default {
		apollo: {
			tribe: {
				query() {
					return this.$gql`query tribe($field: String, $value: String) {
						tribe(filter: [{field: $field, value: $value}]) {
							_id
							title {
								locale {
									en
									mi
								}
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
						field: this.field,
						value: this.value,
					};
				},
				watchLoading (isLoading, countModifier) {
					this.$store.commit('loading', countModifier);
				},
			},
		},
		computed: {
			field: function() {
				return "slug." + this.$i18n.locale;
			},
			value: function() {
				return this.$route.params[param];
			},
		},
		watch: {
			tribe: function(data) {
				this.$store.dispatch('i18n/setRouteParams', {en: {[param]: data.slug.en}, mi: {[param]: data.slug.mi}});
			},
		},
		head() {
			return {
				title: (this[param] ? this.localeCurrent(this[param].title.locale) + ' (' + this.$tc(param) + ')' : ''),
			};
		},
	};
</script>
