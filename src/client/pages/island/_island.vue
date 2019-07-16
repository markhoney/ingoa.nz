<template>
	<section v-if="island">
		<imageheader :image="island.images.landscape" :title="island.title" />
		<wikipedia v-if="island.notes.wikipedia" :text="island.notes.wikipedia" :link="island.links.wikipedia" source="Wikipedia" />
		<p class="ma-5" v-html="island.notes.description" />
		<player :file="island.audio.file" field="island._id" :value="island._id" :common="true" />
		<imagemap v-for="map in island.maps" :key="map._id" :id="map._id" :hash="true" />
	</section>
</template>

<script>
	import gql from 'graphql-tag';
	import imageheader from '@/components/base/headers/image.vue';
	import wikipedia from '@/components/base/textboxes/quote.vue';
	import player from '@/components/audio/zone.vue';
	import imagemap from '@/components/maps/image/map.vue';

	export default {
		components: {
			imageheader,
			wikipedia,
			player,
			imagemap,
		},
		apollo: {
			island: {
				query: gql`query island($slug: String, $lang: String) {
					island(find: {slug: $slug}, lang: $lang) {
						_id
						title {
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
						}
						links {
							wikipedia
						}
						notes {
							wikipedia
							description
						}
					}
				}`,
				variables() {
					return {
						slug: this.$route.params.island,
						lang: this.$i18n.locale,
					}
				},
			},
		},
		head() {
			return {
				title: (this.island ? this.localeCurrent(this.island.title) + ' (' + this.$tc('island') + ')' : ''),
			};
		},
	};
</script>
