<template>
	<section v-if="speaker">
		<h2>{{this.localeCurrent(this.speaker.title)}}</h2>
	</section>
</template>

<script>
	import gql from 'graphql-tag';

	export default {
		apollo: {
			speaker: {
				query: gql`query speaker($slug: String, $lang: String) {
					speaker(filter: {slug: $slug, lang: $lang}) {
						_id
						title {
							en
							mi
						}
					}
				}`,
				variables() {
					return {
						slug: this.$route.params.speaker,
						lang: this.$i18n.locale,
					}
				},
			},
		},
		head() {
			return {
				title: (this.speaker ? this.localeCurrent(this.speaker.title) : ''),
			};
		},
	};
</script>
