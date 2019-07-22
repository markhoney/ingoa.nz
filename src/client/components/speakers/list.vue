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
					return this.$gql`query speakers($field: String, $value: String) {
						speakers(filter: [{field: $field, value: $value}]) {
							_id
							slug {
								en
								mi
							}
							title {
								en
								mi
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
					this.$eventbus.$emit("loading", countModifier);
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
								text: this.localeCurrent(speaker.title),
								link: this.localePath({name: 'speaker-speaker', params: {speaker: this.localeCurrent(speaker.slug)}}),
							},
						};
					});
				}
			},
		},
	};
</script>
