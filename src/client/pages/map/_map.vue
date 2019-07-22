<template>
	<section v-if="slug" class="pa-2 my-5 elevation-4">
		<!--<h3 class="display-1 mt-5 mb-4">{{$tc('map', 1) | titlecase}}</h3>-->
		<imagemap field="slug" :value="slug" hash class="text-xs-center" />
		<h3 class="display-1 mt-5 mb-4">{{$tc('region', 2) | titlecase}}</h3>
		<regions field="map.slug" :value="slug" />
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
						}
					}`;
				},
				variables() {
					return {
						field: "slug",
						value: this.slug,
					};
				},
				watchLoading (isLoading, countModifier) {
					this.$eventbus.$emit("loading", countModifier);
				},
			},
		},
		computed: {
			slug: function() {
				return this.$route.params.map;
			},
		},
		head() {
			return {
				title: (this.map ? this.localeCurrent(this.map.title) + ' (' + this.$tc('map') + ')' : ''),
			};
		},
	};
</script>
