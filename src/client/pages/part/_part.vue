<template>
	<section v-if="part">
		<h2>{{this.localeCurrent(this.part.title)}}</h2>
	</section>
</template>

<script>

	export default {
		apollo: {
			part: {
				query() {
					return this.$gql`query part($field: String, $value: String) {
						part(filter: [{field: $field, value: $value}]) {
							_id
							title {
								en
								mi
							}
						}
					}`;
				},
				variables() {
					return {
						field: "slug",
						value: this.$route.params.part,
					};
				},
				watchLoading (isLoading, countModifier) {
					this.$eventbus.$emit("loading", countModifier);
				},
			},
		},
		head() {
			return {
				title: (this.part ? this.localeCurrent(this.part.title) + ' (' + this.$tc('part') + ')' : ''),
			};
		},
	};
</script>
