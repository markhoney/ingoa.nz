<template>
	<section v-if="island">
		<imageheader :image="island.images.landscape" :title="island.title" />
		<wikipedia v-if="island.notes.wikipedia" :text="island.notes.wikipedia" :link="island.links.wikipedia" source="Wikipedia" />
		<p class="ma-5" v-html="island.notes.description" />
		<player :file="island.audio.file" field="island._id" :value="island._id" common />
		<imagemap v-for="map in island.maps" :key="map._id" :field="'slug.' + $i18n.locale" :value="map.slug[$i18n.locale]" hash />
	</section>
</template>

<script>
	import imageheader from '@/components/base/headers/image.vue';
	import wikipedia from '@/components/base/textboxes/quote.vue';
	import player from '@/components/audio/placenames.vue';
	import imagemap from '@/components/maps/image/map.vue';
	import gql from 'graphql-tag';

	export default {
		components: {
			imageheader,
			wikipedia,
			player,
			imagemap,
		},
		/*async asyncData ({app, route, store}) {
			let {data} = await app.apolloProvider.defaultClient.query({
				query: gql`query island($field: String, $value: String) {
					island(filter: [{field: $field, value: $value}]) {
						_id
						title {
							en
							mi
						}
						slug {
							en
							mi
						}
					}
				}`,
				variables: {
					field: "slug",
					value: route.params.island,
				},
			});
			store.dispatch('i18n/setRouteParams', {en: {island: data.island.slug.en}, mi: {island: data.island.slug.mi}});
		},*/
		data() {
			return {
				type: "island",
			};
		},
		apollo: {
			island: {
				query() {
					return this.$gql`query island($field: String, $value: String) {
						island(filter: [{field: $field, value: $value}]) {
							_id
							title {
								en
								mi
							}
							slug {
								en
								mi
							}
							images {
								landscape
							}
							audio {
								file
							}
							maps {
								_id
								slug {
									en
									mi
								}
							}
							links {
								wikipedia
							}
							notes {
								wikipedia
								description
							}
						}
					}`;
				},
				/*prefetch: ({route}) => {
					return {
						field: "slug",
						value: route.params.island,
					};
				},*/
				variables() {
					return {
						field: "slug",
						value: this.$route.params[this.type],
					};
				},
				result({data, loading, networkStatus}) {
					console.log(data);
					this.$store.dispatch('i18n/setRouteParams', {en: {[this.type]: data[this.type].slug.en}, mi: {[this.type]: data[this.type].slug.mi}});
				},
				watchLoading(isLoading, countModifier) {
					this.$store.commit('loading', countModifier);
				},
			},
		},
		/*watch: {
			island: function(island) {
				this.$store.dispatch('i18n/setRouteParams', {en: {island: island.slug.en}, mi: {island: island.slug.mi}});
			}
		},*/
		head() {
			return {
				title: (this[this.type] ? this.localeCurrent(this[this.type].title) + ' (' + this.$tc(this.type) + ')' : ''),
			};
		},
	};
</script>
