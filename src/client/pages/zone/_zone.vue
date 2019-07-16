<template>
	<section v-if="zone">
		<imageheader :image="zone.images.landscape" :title="zone.title" :right="caseInitial($tc('zone', 1)) + ' ' + zone.number" />
		<wikipedia v-if="zone.notes.wikipedia" :text="zone.notes.wikipedia" :link="zone.links.wikipedia" source="Wikipedia" />
		<player :file="zone.audio.file" field="zone._id" :value="zone._id" />
		<mapplaces field="zone._id" :value="zone._id" />
		<h3>{{$tc('speaker', 2) | initialcase}}</h3>
		<v-layout row wrap>
			<v-flex xs12 sm6 md4 class="pa-2">
				<template v-for="speaker in zone.speakers.filter(speaker => speaker._id != 'sp_37')">
					<speaker :id="speaker._id" :key="speaker._id" />
				</template>
			</v-flex>
		</v-layout>
		<h3>{{$tc('location', 1) | initialcase}}</h3>
		<v-layout row wrap>
			<v-flex xs12 sm6 md4 class="pa-2">
				<island :id="zone.region.island._id">
					<h2>{{$tc('island', 1) | uppercase}}</h2>
				</island>
			</v-flex>
			<v-flex xs12 sm6 md4 class="pa-2">
				<region :id="zone.region._id" />
			</v-flex>
		</v-layout>
	</section>
</template>

<script>
	import gql from 'graphql-tag';
	import imageheader from '@/components/base/headers/image.vue';
	import wikipedia from '@/components/base/textboxes/quote.vue';
	import player from '@/components/audio/zone.vue';
	import mapplaces from '@/components/maps/leaflet/places.vue';
	import island from '@/components/islands/card.vue';
	import region from '@/components/regions/card.vue';
	import speaker from '@/components/speakers/card.vue';

	export default {
		components: {
			imageheader,
			wikipedia,
			player,
			mapplaces,
			island,
			region,
			speaker,
		},
		apollo: {
			zone: {
				query: gql`query zone($slug: String, $lang: String) {
					zone(find: {slug: $slug}, lang: $lang) {
            _id
						number
						title {
							en
							mi
						}
						links {
							wikipedia
						}
						notes {
							wikipedia
						}
						region {
							_id
							island {
								_id
							}
						}
						audio {
							file
						}
						images {
							landscape
						}
						speakers {
							_id
							title {
								en
								mi
							}
						}
					}
				}`,
				variables() {
					return {
						slug: this.$route.params.zone,
						lang: this.$i18n.locale,
					}
				},
			},
		},
		head() {
			return {
				title: (this.zone ? this.localeCurrent(this.zone.title) + ' (' + this.$tc('zone') + ')' : null),
			};
		},
	};
</script>

<style scoped>
</style>
