<template>
	<section v-if="zone">
		<imageheader :image="zone.images.landscape" :names="zone.name" :right="'Zone ' + zone.number" />
		<player :file="zone.audio.file" field="zone_code" :value="zone.code" :wave="false" />
		<gmap field="zone_code" :value="zone.code" />
		<h3>{{$tc('speaker', 2) | initialcase}}</h3>
		<v-layout row wrap>
			<v-flex xs12 sm6 md4 class="pa-2">
				<template v-for="speaker in zone.speakers.filter(speaker => speaker.code != 'hugh_young')">
					<speaker :code="speaker.code" :key="speaker.code" />
				</template>
			</v-flex>
		</v-layout>
		<h3>{{$tc('location', 1) | initialcase}}</h3>
		<v-layout row wrap>
			<v-flex xs12 sm6 md4 class="pa-2">
				<island :code="zone.island.code" />
			</v-flex>
			<v-flex xs12 sm6 md4 class="pa-2">
				<region :code="zone.region.code" />
			</v-flex>
		</v-layout>
	</section>
</template>

<script>
	import gql from 'graphql-tag';
	import imageheader from '@/components/headers/image.vue';
	import player from '@/components/audio/zone.vue';
	import gmap from '@/components/maps/google/places.vue';
	import island from '@/components/islands/card.vue';
	import region from '@/components/regions/card.vue';
	import speaker from '@/components/speakers/card.vue';

	export default {
		components: {
			imageheader,
			player,
			gmap,
			island,
			region,
			speaker,
		},
		apollo: {
			zone: {
				query: gql`query zone($code: String) {
					zone(filter: {code: $code}) {
            _id
						code
						number
						name {
							en
							mi
						}
						region {
							_id
							code
						}
						island {
							_id
							code
						}
						audio {
							file
						}
						images {
							landscape
						}
						speakers {
							_id
							code
							name {
								en
								mi
							}
						}
					}
				}`,
				variables() {
					return {
						code: this.$route.params.zone,
					}
				},
			},
		},
		head() {
			return {
				title: (this.zone ? this.localeName(this.zone.name) : null),
			};
		},
	};
</script>

<style scoped>
	v-parallax {
		border-radius: 20px;
	}
</style>
