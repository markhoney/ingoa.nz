<template>
	<section v-if="island">
		<imageheader :image="island.images.landscape" :names="island.name" />
		<p class="ma-5" v-html="island.description" />
		<player :file="island.audio.file" field="island_id" :value="island._id" :common="true" :wave="false" />
		<imagemap v-for="map in island.maps" :key="map.code" :code="map.code" :hash="true" />
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
				query: gql`query island($code: String) {
					island(filter: {code: $code}) {
						_id
						code
						name {
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
							code
						}
					}
				}`,
				variables() {
					return {
						code: this.$route.params.island,
					}
				},
			},
		},
		head() {
			return {
				title: (this.island ? this.localeName(this.island.name) : ''),
			};
		},
	};
</script>
