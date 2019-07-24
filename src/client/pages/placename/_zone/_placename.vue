<template>
	<h2>{{$route.params.placename}}</h2>
</template>

<script>
	// Need to differentiate zone, island and part in the incoming "zone" URL parameter by reading the ID prefix (e.g. zo_, is_ or pa_).
	export default {
		apollo: {
			placename: {
				query() {
					return this.$gql`query placename($field: String, $value: String) {
						placename(filter: [{field: $field, value: $value}]) {
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
						value: this.$route.params.placename,
					};
				},
				watchLoading (isLoading, countModifier) {
					this.$store.commit('loading', countModifier);
				},
			},
		},
		watch: {
			placename: function(placename) {
				this.$store.commit('i18n/setRouteParams', {en: {placename: placename.slug.en}, mi: {placename: placename.slug.mi}});
			},
		},
		head() {
			return {
				title: (this.placename ? this.localeCurrent(this.placename.title) + ' (' + this.$tc('placename') + ')' : ''),
			};
		},
	};
</script>