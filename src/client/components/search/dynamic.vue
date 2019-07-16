<template>
	<v-autocomplete no-filter :items="autocomplete" :search-input.sync="input" v-model="selected" prepend-icon="search" />
</template>

<script>
	import gql from 'graphql-tag';
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
					search(term: $term) {
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
				if (this.search) {
					return this.search.map(result => {
						return {
							value: "/" + [result.type, result.zone_code, result.code].join("/"),
							text: result.name,
						};
					});
				}
			},
		},
		watch: {
			input: function(input) {
				clearTimeout(this.$timeout);
				this.$timeout = setTimeout(() => {
					this.term = input;
				}, 500);
			},
			selected: function(selected) {
				this.$router.push({path: selected});
			}
		},
	};
</script>
