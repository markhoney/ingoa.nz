<template>
	<section>
		<v-layout row wrap v-for="island in islands.filter(island => island.maps.length)" :key="island._id" class="elevation-2 mb-2">
			<v-flex xs12>
				<imageheader :image="island.images.landscape" :title="island.title" :to="{name: 'island-island', params: {island: localeCurrent(island.slug)}}" />
			</v-flex>
			<v-flex v-for="map in island.maps" :key="map._id" xs12 sm6 md4 class="pa-2">
				<imagemap :id="map._id" />
			</v-flex>
		</v-layout>
	</section>
</template>

<script>
	import gql from 'graphql-tag';
	import imageheader from '@/components/headers/image.vue';
	import imagemap from '@/components/maps/image/map.vue';

	export default {
		components: {
			imageheader,
			imagemap,
		},
		apollo: {
			islands: gql`{
				islands {
					_id
					slug {
						en
						mi
					}
					title {
						en
						mi
					}
					images {
						landscape
					}
					maps {
						_id
						title {
							en
							mi
						}
					}
				}
			}`,
		},
		head() {
			return {
				title: 'maps',
			};
		},
	};
</script>
