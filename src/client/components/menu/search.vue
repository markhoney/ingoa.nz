<template>
	<v-autocomplete :items="suggestions" v-model="search" prepend-icon="search" />
</template>

<script>
	import gql from 'graphql-tag';
	import search from '@/components/menu/search.vue';

	export default {
		data() {
			return {
				search: ''
			}
		},
		apollo: {
			placenames: {
				query: gql`query search($value: String) {
					search(filter: {value: $value}) {
				}`,
				variables() {
					return {
						value: search,
					}
				},
			},
		},
		watch: {
			search: function(search) {
				this.$router.push({path: search});
			}
		},
	};
</script>
