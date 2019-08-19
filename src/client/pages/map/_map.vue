<template>
	<section v-if="$route.params.map" class="pa-2 my-5 elevation-4">
		<!--<h3 class="display-1 mt-5 mb-4">{{$tc('map', 1) | titlecase}}</h3>-->
		<imagemap field="slug" :value="$route.params.map" hash class="text-xs-center" />
		<h3 class="display-1 mt-5 mb-4">{{$tc('sector', 2) | titlecase}}</h3>
		<sectors field="map.slug" :value="$route.params.map" />
	</section>
</template>

<script>
	import imagemap from '@/components/maps/image/map.vue';
	import sectors from '@/components/sectors/cards.vue';

	const param = "map";

	export default {
		components: {
			imagemap,
			sectors
		},
		apollo: {
			map: {
				query() {
					return this.$gql`query map($field: String, $value: String) {
						map(filter: [{field: $field, value: $value}]) {
							_id
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
			map: function(data) {
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
