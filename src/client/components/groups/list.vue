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
					return this.$gql`query groups($field: String, $value: String) {
						groups(filter: [{field: $field, value: $value}]) {
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
							zone {
								_id
								slug {
									en
									mi
								}
							}
							notes {
								wikipedia {
									en
									mi
								}
								description {
									en
									mi
								}
							}
						}
					}`;
				},
				update: response => response.groups,
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
			groups: function() {
				return this.data || this.remote;
			},
			items: function() {
				if (this.groups) {
					return this.groups.map(group => {
						return {
							_id: group._id,
							title: {
								text: this.localeCurrent(group.name.locale),
								link: this.localePath({name: 'group-zone-group', params: {zone: this.localeCurrent(group.zone.slug), group: this.localeCurrent(group.slug)}}),
							},
							subtitle: {
								text: (group.notes ? this.localeCurrentOnly(group.notes.wikipedia) || this.localeCurrentOnly(group.notes.description) : ""),
							}
						};
					});
				}
			},
		},
	};
</script>
