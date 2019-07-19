<template>
	<section v-if="slug" class="pa-2 my-5 elevation-4">
		<!--<h3 class="display-1 mt-5 mb-4">{{$tc('map', 1) | titlecase}}</h3>-->
		<imagemap :slug="slug" hash class="text-xs-center" />
		<h3 class="display-1 mt-5 mb-4">{{$tc('region', 2) | titlecase}}</h3>
		<regions field="map.slug" :value="slug" />
	</section>
</template>

<script>
	import gql from 'graphql-tag';
	import imagemap from '@/components/maps/image/map.vue';
	import regions from '@/components/regions/cards.vue';

	export default {
		components: {
			imagemap,
			regions
		},
		apollo: {
			map: {
				query: gql`query map($slug: String, $lang: String) {
					map(find: {slug: $slug}, lang: $lang) {
						_id
						title {
							en
							mi
						}
					}
				}`,
				variables() {
					return {
						slug: this.$route.params.map,
						lang: this.$i18n.locale,
					};
				},
			},
		},
		computed: {
			slug: function() {
				return this.$route.params.map;
			}
		},
		head() {
			return {
				title: (this.map ? this.localeCurrent(this.map.title) + ' (' + this.$tc('map') + ')' : ''),
			};
		},
	};
</script>
