<template>
	<section v-if="part">
		<h2>{{this.localeCurrent(this.part.name.locale)}}</h2>
	</section>
</template>

<script>

	const param = "part";

	export default {
		apollo: {
			part: {
				query() {
					return this.$gql`query part($field: String, $value: String) {
						part(filter: [{field: $field, value: $value}]) {
							_id
							name {
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
			part: function(data) {
				this.$store.dispatch('i18n/setRouteParams', {en: {[param]: data.slug.en}, mi: {[param]: data.slug.mi}});
			},
		},
		head() {
			return {
				title: (this[param] ? this.localeCurrent(this[param].name.locale) + ' (' + this.$tc(param) + ')' : ''),
			};
		},
	};
</script>
