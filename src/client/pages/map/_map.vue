<template>
	<section v-if="$route.params.map" class="pa-2 my-5 elevation-4">
		<!--<h3 class="display-1 mt-5 mb-4">{{$tc('map', 1) | titlecase}}</h3>-->
		<imagemap field="slug" :value="$route.params.map" hash class="text-xs-center" />
		<h3 class="display-1 mt-5 mb-4">{{$tc('region', 2) | titlecase}}</h3>
		<regions field="map.slug" :value="$route.params.map" />
	</section>
</template>

<script>
	import imagemap from '@/components/maps/image/map.vue';
	import regions from '@/components/regions/cards.vue';

	export default {
		components: {
			imagemap,
			regions
		},
		apollo: {
			map: {
				query() {
					return this.$gql`query map($field: String, $value: String) {
						map(filter: [{field: $field, value: $value}]) {
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
					}`;
				},
				variables() {
					return {
						field: "slug",
						value: this.$route.params.map,
					};
				},
				watchLoading (isLoading, countModifier) {
					this.$store.commit('loading', countModifier);
				},
			},
		},
		watch: {
			map: function(map) {
				this.$store.commit('i18n/setRouteParams', {en: {map: map.slug.en}, mi: {map: map.slug.mi}});
			}
		},
		head() {
			return {
				title: (this.map ? this.localeCurrent(this.map.title) + ' (' + this.$tc('map') + ')' : ''),
			};
		},
	};
</script>
