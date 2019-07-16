<template>
	<section v-if="tribe">
		<h2>{{this.localeCurrent(this.tribe.title)}}</h2>
	</section>
</template>

<script>
	import gql from 'graphql-tag';

	export default {
		apollo: {
			tribe: {
				query: gql`query tribe($slug: String, $lang: String) {
					tribe(find: {slug: $slug}, lang: $lang) {
						_id
						title {
							en
							mi
						}
					}
				}`,
				variables() {
					return {
						slug: this.$route.params.tribe,
						lang: this.$i18n.locale,
					}
				},
			},
		},
		head() {
			return {
				title: (this.tribe ? this.localeCurrent(this.tribe.title) : ''),
			};
		},
	};
</script>
