<template>
	<v-autocomplete cache-items :items="autocomplete" :search-input.sync="input" v-model="selected" prepend-icon="search" label="Search" />
</template>

<script>
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
				query() {
					return this.$gql`query autocomplete($term: String, $lang: String) {
						autocomplete(term: $term, lang: $lang) {
							text
							value
						}
					}`;
				},
				variables() {
					return {
						term: this.term,
						lang: this.$i18n.locale,
					};
				},
				watchLoading (isLoading, countModifier) {
					this.$store.commit('loading', countModifier);
				},
			},
		},
		watch: {
			input: function(input) {
				if (input && input.length >= 3) this.term = input.slice(0, 3);
			},
			selected: function(selected) {
				this.$router.push({path: selected});
			},
		},
	};
</script>
