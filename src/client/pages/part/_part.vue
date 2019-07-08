<template>
	<section v-if="part">
		<h2>{{this.localeCurrent(this.part.title)}}</h2>
	</section>
</template>

<script>
	import gql from 'graphql-tag';

	export default {
		apollo: {
			part: {
				query: gql`query part($slug: String, $lang: String) {
					part(filter: {slug: $slug, lang: $lang}) {
						_id
						title {
							en
							mi
						}
					}
				}`,
				variables() {
					return {
						slug: this.$route.params.part,
						lang: this.$i18n.locale,
					}
				},
			},
		},
		head() {
			return {
				title: (this.part ? this.localeCurrent(this.part.title) : ''),
			};
		},
	};
</script>
