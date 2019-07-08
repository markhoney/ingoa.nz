<template>
	<section v-if="map">
		<h2 :id="map.code" class="display-1 mb-0 text-xs-center">
			<nuxt-link :to="localePath({name: 'map-map', params: {map: localeCurrent(map.slug)}})">{{localeCurrent(map.title)}}</nuxt-link>
		</h2>
		<h3 class="headline mb-0 text-xs-center mb-3">{{localeOther(map.title)}}</h3>
		<img :src="map.images.portrait" :alt="localeBoth(map.title)" :id="map._id" :usemap="'#map-' + map.code">
		<map :name="'map-' + map.code">
			<template v-for="region in map.regions">
				<template v-for="zone in region.zones">
					<nuxt-link v-for="(area, index) in zone.maplink.mapareas" :to="localePath({name: 'zone-zone', params: {zone: localeCurrent(zone.slug)}})" :key="zone._id + index"
						:shape="area.shape" :coords="area.coords.map(coord => parseInt(coord)).join(',')" :title="localeBoth(zone.title)" tag="area" />
					<!--:alt="localeBoth(zone.title)" -->
				</template>
			</template>
			<template v-for="link in map.maplinks">
				<nuxt-link v-for="(area, index) in link.mapareas"
					:to="localePath(hash ? {name: 'island-island', params: {island: localeCurrent(map.island.slug)}, hash: '#' + localeCurrent(link.map.slug)} : {name: 'island-island', params: {island: localeCurrent(map.island.slug)}})"
					:key="[link.map._id, index].join('-')" :shape="area.shape" :coords="area.coords.map(coord => parseInt(coord)).join(',')" :title="localeBoth(link.map.title)" tag="area" />
			</template>
		</map>
		<p class="text-xs-center">{{$t('imagemap')}}</p>
	</section>
</template>

<script>
	import gql from 'graphql-tag';

	export default {
		props: {
			id: String,
			slug: String,
			hash: {
				type: Boolean,
				default: false,
			},
		},
		head: {
			script: [{src: 'https://unpkg.com/image-map/dist/image-map.min.js'}],
		},
		apollo: {
			map: {
				query: gql`query map($id: String, $slug: String, $lang: String) {
					map(filter: {_id: $id, slug: $slug, lang: $lang}) {
						_id
						slug {
							en
							mi
						}
						title {
							en
							mi
						}
						dates {
							start
							end
						}
						regions {
							_id
							zones {
								_id
								slug {
									en
									mi
								}
								title {
									en
									mi
								}
								maplink {
									mapareas {
										shape
										coords
									}
								}
							}
						}
						island {
							slug {
								en
								mi
							}
						}
						maplinks {
							map {
								_id
								title {
									en
									mi
								}
							}
							mapareas {
								shape
								coords
							}
						}
						images {
							portrait
						}
					}
				}`,
				variables() {
					return {
						id: this.id,
						slug: this.slug,
						lang: this.$i18n.locale,
					}
				},
			},
		},
		mounted() {
			this.$nextTick(() => {
				if (process.client) {
					window.onNuxtReady(app => {
						ImageMap('img[usemap]');
					});
				}
			});
		},
	};
</script>

<style scoped>
	img {
		display: block;
		max-width: 100%;
		margin: 0 auto;
	}
</style>
