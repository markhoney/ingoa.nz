<template>
	<list :data="items" search />
</template>

<script>
	import list from '@/components/base/list/description.vue';

	export default {
		components: {
			list,
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
							name {
								locale {
									en
									mi
								}
							}
							links {
								wikipedia {
									en
									mi
								}
							}
							notes {
								wikipedia {
									en
									mi
								}
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
					this.$store.commit('loading', countModifier);
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
								text: this.localeCurrent(tribe.name.locale),
								link: this.localePath({name: 'tribe-tribe', params: {tribe: this.localeCurrent(tribe.slug)}}),
							},
							subtitle: {
								text: (tribe.notes ? this.localeCurrent(tribe.notes.wikipedia) : ""),
							},
						};
					});
				}
			},
		},
	};
</script>
