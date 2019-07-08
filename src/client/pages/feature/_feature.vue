<template>
	<section v-if="feature">
		<h2>{{this.localeCurrent(this.feature.title)}}</h2>
	</section>
</template>

<script>
	import gql from 'graphql-tag';

	export default {
		apollo: {
			feature: {
				query: gql`query feature($slug: String, $lang: String) {
					feature(filter: {slug: $slug, lang: $lang}) {
						_id
						title {
							en
							mi
						}
					}
				}`,
				variables() {
					return {
						slug: this.$route.params.feature,
						lang: this.$i18n.locale,
					}
				},
			},
		},
		head() {
			return {
				title: (this.feature ? this.localeCurrent(this.feature.title) : ''),
			};
		},
	};
</script>
