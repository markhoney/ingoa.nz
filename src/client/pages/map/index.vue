<template>
	<section>
		<v-layout row wrap v-for="island in islands.filter(island => island.maps.length)" :key="island.code" class="elevation-2 mb-2">
			<v-flex xs12>
				<imageheader :image="island.images.landscape" :names="island.name" :to="{name: 'island-island', params: {island: island.code}}" />
			</v-flex>
			<v-flex v-for="map in island.maps" :key="map.code" xs12 sm6 md4 class="pa-2">
				<imagemap :code="map.code" />
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
					code
					name {
						en
						mi
					}
					images {
						landscape
					}
					maps {
						_id
						code
						name {
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
