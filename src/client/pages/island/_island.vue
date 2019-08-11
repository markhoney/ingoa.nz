<template>
	<section v-if="island">
		<imageheader :image="island.images.landscape" :title="island.title.locale" />
		<wikipedia v-if="island.notes.wikipedia" :text="localeCurrent(island.notes.wikipedia)" :link="localeCurrent(island.links.wikipedia)" source="Wikipedia" />
		<p class="ma-5" v-html="localeCurrent(island.notes.description)" />
		<player :file="island.audio.file" field="island._id" :value="island._id" common />
		<imagemap v-for="map in island.maps" :key="map._id" field="_id" :value="map._id" hash />
	</section>
</template>

<script>
	import imageheader from '@/components/base/headers/image.vue';
	import wikipedia from '@/components/base/textboxes/quote.vue';
	import player from '@/components/audio/placenames.vue';
	import imagemap from '@/components/maps/image/map.vue';

	const param = "island";

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
								locale {
									en
									mi
								}
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
								description {
									en
									mi
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
				watchLoading(isLoading, countModifier) {
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
			island: function(data) {
				this.$store.dispatch('i18n/setRouteParams', {en: {[param]: data.slug.en}, mi: {[param]: data.slug.mi}});
			},
		},
		head() {
			return {
				title: (this[param] ? this.localeCurrent(this[param].title.locale) + ' (' + this.$tc(param) + ')' : ''),
			};
		},
	};
</script>
