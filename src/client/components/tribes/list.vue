<template>
	<searchlist :data="items" />
</template>

<script>
	import searchlist from '@/components/base/list/search.vue';

	export default {
		components: {
			searchlist,
		},
		props: {
			field: String,
			value: String,
			data: Array,
		},
		apollo: {
			remote: {
				skip() {
					return (this.data ? true : false);
				},
				query() {
					return this.$gql`query tribes($field: String, $value: String) {
						tribes(filter: [{field: $field, value: $value}]) {
							_id
							slug {
								en
								mi
							}
							title {
								en
								mi
							}
							links {
								wikipedia
							}
							notes {
								wikipedia
							}
						}
					}`;
				},
				update: response => response.tribes,
				variables() {
					return {
						field: this.field,
						value: this.value,
					};
				},
				watchLoading (isLoading, countModifier) {
					this.$eventbus.$emit("loading", countModifier);
				},
			},
		},
		computed: {
			tribes: function() {
				return this.data || this.remote;
			},
			items: function() {
				if (this.tribes) {
					return this.tribes.map(tribe => {
						return {
							_id: tribe._id,
							title: {
								text: this.localeCurrent(tribe.title),
								link: this.localePath({name: 'tribe-tribe', params: {tribe: this.localeCurrent(tribe.slug)}}),
							},
							subtitle: {
								text: (tribe.notes ? tribe.notes.wikipedia : ""),
							},
						};
					});
				}
			},
		},
	};
</script>
