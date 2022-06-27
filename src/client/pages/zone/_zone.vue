<template>
	<section v-if="zone">
		<imageheader :image="zone.images.landscape" :title="zone.name.locale" :right="caseInitial($tc('zone', 1)) + ' ' + zone.number" />
		<wikipedia v-if="zone.notes && zone.notes.wikipedia" :text="localeCurrent(zone.notes.wikipedia)" :link="localeCurrent(zone.areas[0].links.wikipedia)" source="Wikipedia" />
		<!--<mapplaces field="zone._id" :value="zone._id" />-->
		<player :file="zone.audio.file" field="zone._id" :value="zone._id" />
		<h3 class="headline">{{$tc('speaker', 2) | initialcase}}</h3>
		<v-layout row wrap>
			<v-flex xs12 sm6 md4 class="pa-2">
				<template v-for="speaker in zone.speakers.filter(speaker => speaker._id !== 'sp_37')">
					<speaker field="_id" :value="speaker._id" :key="speaker._id" />
				</template>
			</v-flex>
		</v-layout>
		<h3>{{$tc('location', 1) | initialcase}}</h3>
		<v-layout row wrap>
			<v-flex xs12 sm6 md4 class="pa-2">
				<island field="_id" :value="zone.sector.island._id" single />
			</v-flex>
			<v-flex xs12 sm6 md4 class="pa-2">
				<sector field="_id" :value="zone.sector._id" single />
			</v-flex>
		</v-layout>
	</section>
</template>

<script>
	import imageheader from '@/components/base/headers/image.vue';
	import wikipedia from '@/components/base/textboxes/quote.vue';
	import player from '@/components/audio/placenames.vue';
	import mapplaces from '@/components/maps/leaflet/places.vue';
	import island from '@/components/islands/card.vue';
	import sector from '@/components/sectors/card.vue';
	import speaker from '@/components/speakers/card.vue';

	const param = "zone";

	export default {
		components: {
			imageheader,
			wikipedia,
			player,
			mapplaces,
			island,
			sector,
			speaker,
		},
		apollo: {
			zone: {
				query() {
					return this.$gql`query zone($field: String, $value: String) {
						zone(filter: [{field: $field, value: $value}]) {
							_id
							number
							name {
								locale {
									en
									mi
								}
							}
							slug {
								en
								mi
							}
							areas {
								links {
									wikipedia {
										en
										mi
									}
								}
							}
							links {
								wikipedia {
									en
									mi
								}
							}
							notes {
								wikipedia {
									en
									mi
								}
							}
							sector {
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
								name {
									locale {
										en
										mi
									}
								}
							}
						}
					}`;
				},
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
			field: function() {
				return "slug." + this.$i18n.locale;
			},
			value: function() {
				return this.$route.params[param];
			},
		},
		watch: {
			zone: function(data) {
				this.$store.dispatch('i18n/setRouteParams', {en: {[param]: data.slug.en}, mi: {[param]: data.slug.mi}});
			},
		},
		head() {
			return {
				title: (this[param] ? this.localeCurrent(this[param].name.locale) + ' (' + this.$tc(param) + ')' : ''),
			};
		},
	};
</script>
