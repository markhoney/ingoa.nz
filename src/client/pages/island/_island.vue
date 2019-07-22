<template>
	<section v-if="island">
		<imageheader :image="island.images.landscape" :title="island.title" />
		<wikipedia v-if="island.notes.wikipedia" :text="island.notes.wikipedia" :link="island.links.wikipedia" source="Wikipedia" />
		<p class="ma-5" v-html="island.notes.description" />
		<player :file="island.audio.file" field="island._id" :value="island._id" common />
		<imagemap v-for="map in island.maps" :key="map._id" field="slug" :value="map.slug[$i18n.locale]" hash />
	</section>
</template>

<script>
	import imageheader from '@/components/base/headers/image.vue';
	import wikipedia from '@/components/base/textboxes/quote.vue';
	import player from '@/components/audio/placenames.vue';
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
				query() {
					return this.$gql`query island($field: String, $value: String) {
						island(filter: [{field: $field, value: $value}]) {
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
				variables() {
					return {
						field: "slug",
						value: this.$route.params.island,
					};
				},
				watchLoading (isLoading, countModifier) {
					this.$eventbus.$emit("loading", countModifier);
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
