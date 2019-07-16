<template>
	<h2>{{$route.params.placename}}</h2>
</template>

<script>
	// Need to differentiate zone, island and part in the incoming "zone" URL parameter by reading the ID prefix (e.g. zo_, is_ or pa_).
	export default {
		apollo: {
			placename: {
				query: gql`query placename($slug: String, $lang: String) {
					placename(find: {slug: $slug}, lang: $lang) {
						_id
						title {
							en
							mi
						}
					}
				}`,
				variables() {
					return {
						slug: this.$route.params.placename,
						lang: this.$i18n.locale,
					}
				},
			},
		},
		head() {
			return {
				title: (this.placename ? this.localeCurrent(this.placename.title) + ' (' + this.$tc('placename') + ')' : ''),
			};
		},
	};
</script>