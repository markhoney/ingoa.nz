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
					return this.$gql`query speakers($field: String, $value: String) {
						speakers(filter: [{field: $field, value: $value}]) {
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
						}
					}`;
				},
				update: response => response.speakers,
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
			speakers: function() {
				return this.data || this.remote;
			},
			items: function() {
				if (this.speakers) {
					return this.speakers.map(speaker => {
						return {
							_id: speaker._id,
							title: {
								text: this.localeCurrent(speaker.name.locale),
								link: this.localePath({name: 'speaker-speaker', params: {speaker: this.localeCurrent(speaker.slug)}}),
							},
						};
					});
				}
			},
		},
	};
</script>
