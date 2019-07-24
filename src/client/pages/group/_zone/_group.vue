<template>
	<section v-if="group">
		<h2>{{this.localeCurrent(group.title)}}</h2>
		<wikipedia v-if="group.notes && group.notes.wikipedia" :text="group.notes.wikipedia" :link="group.links.wikipedia" source="Wikipedia" />
		<places :data="group.places" />
	</section>
</template>

<script>
	import places from '@/components/places/list.vue';
	import wikipedia from '@/components/base/textboxes/quote.vue';

	export default {
		components: {
			places,
			wikipedia,
		},
		apollo: {
			group: {
				query() {
					return this.$gql`query group($field: String, $value: String, $zone: String) {
						group(filter: [{field: $field, value: $value}, {field: "zone.slug", value: $zone}]) {
							_id
							title {
								en
								mi
							}
							slug {
								en
								mi
							}
							links {
								wikipedia
							}
							notes {
								wikipedia
							}
							places {
								_id
								title {
									en
									mi
								}
								placename {
									slug {
										en
										mi
									}
									zone {
										title {
											en
											mi
										}
										slug {
											en
											mi
										}
									}
									part {
										title {
											en
											mi
										}
										slug {
											en
											mi
										}
									}
									island {
										title {
											en
											mi
										}
										slug {
											en
											mi
										}
									}
									names {
										title {
											en
											mi
										}
									}
								}
							}
						}
					}`;
				},
				variables() {
					return {
						field: "slug",
						value: this.$route.params.group,
						zone: this.$route.params.zone,
					};
				},
				watchLoading (isLoading, countModifier) {
					this.$store.commit('loading', countModifier);
				},
			},
		},
		watch: {
			group: function(group) {
				this.$store.commit('i18n/setRouteParams', {en: {group: group.slug.en}, mi: {group: group.slug.mi}});
			}
		},
		head() {
			return {
				title: (this.group ? this.localeCurrent(this.group.title) + ' (' + this.$tc('group') + ')' : ''),
			};
		},
	};
</script>
