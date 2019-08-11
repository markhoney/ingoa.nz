<template>
	<h2>{{$route.params.placename}}</h2>
</template>

<script>
	const param = "placename";

	export default {
		apollo: {
			placename: {
				query() {
					return this.$gql`query placename($field: String, $value: String) {
						placename(filter: [{field: $field, value: $value}]) {
							_id
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
						zone: this.zone,
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
			zone: function() {
				return this.$route.params.zone;
			},
		},
		watch: {
			placename: function(data) {
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