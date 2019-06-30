<template>
	<v-autocomplete no-filter :items="autocomplete" :search-input.sync="input" v-model="selected" prepend-icon="search" />
</template>

<script>
	import gql from 'graphql-tag';
	import search from '@/components/menu/search.vue';
	//import {setTimeout} from 'timers';

	export default {
		data() {
			return {
				input: '',
				term: '',
				selected: '',
			}
		},
		apollo: {
			search: {
				query: gql`query search($term: String) {
					search(filter: {term: $term}) {
						type
						code
						name
						zone_code
					}
				}`,
				variables() {
					return {
						term: this.term,
					}
				},
			},
		},
		computed: {
			autocomplete: function() {
				if (this.results) {
					return this.results.map(result => {
						return {
							value: "/" + [type, zone_code, code].join("/"),
							text: result.name,
						};
					});
				}
			},
		},
		watch: {
			input: function(input) {
				console.log("Searching...");
				//this.$router.push({path: input});
				clearTimeout(this.$timeout);
				this.$timeout = setTimeout(() => {
					console.log("Searched!");
					this.term = input;
				}, 500);
			},
			selected: function(selected) {
				this.$router.push({path: selected});
			}
		},
	};
</script>
