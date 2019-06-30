<template>
	<v-autocomplete cache-items :items="items" :search-input.sync="input" v-model="selected" prepend-icon="search" />
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
			autocomplete: {
				query: gql`query autocomplete($term: String) {
					autocomplete(filter: {term: $term}) {
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
			items: function() {
				if (this.autocomplete) {
					return this.autocomplete.map(result => {
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
				if (input && input.length >= 3) this.term = input.slice(0, 3);
			},
			selected: function(selected) {
				this.$router.push({path: selected});
			}
		},
	};
</script>
