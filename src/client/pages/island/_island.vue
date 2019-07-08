<template>
	<section v-if="island">
		<imageheader :image="island.images.landscape" :title="island.title" />
		<p class="ma-5" v-html="island.description" />
		<player :file="island.audio.file" field="island._id" :value="island._id" :common="true" />
		<imagemap v-for="map in island.maps" :key="map._id" :id="map._id" :hash="true" />
	</section>
</template>

<script>
	import gql from 'graphql-tag';
	import imageheader from '@/components/headers/image.vue';
	import player from '@/components/audio/zone.vue';
	import imagemap from '@/components/maps/image/map.vue';

	export default {
		components: {
			imageheader,
			player,
			imagemap,
		},
		apollo: {
			island: {
				query: gql`query island($slug: String, $lang: String) {
					island(filter: {slug: $slug, lang: $lang}) {
						_id
						title {
							en
							mi
						}
						description
						images {
							landscape
						}
						audio {
							file
						}
						maps {
							_id
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
				title: (this.island ? this.localeCurrent(this.island.title) : ''),
			};
		},
	};
</script>
