<template>
	<section v-if="group">
		<h2>{{this.localeCurrent(this.group.title)}}</h2>
	</section>
</template>

<script>
	import gql from 'graphql-tag';

	export default {
		apollo: {
			group: {
				query: gql`query group($slug: String, $lang: String) {
					group(filter: {slug: $slug, lang: $lang}) {
						_id
						title {
							en
							mi
						}
					}
				}`,
				variables() {
					return {
						slug: this.$route.params.group,
						lang: this.$i18n.locale,
					}
				},
			},
		},
		head() {
			return {
				title: (this.group ? this.localeCurrent(this.group.title) : ''),
			};
		},
	};
</script>
