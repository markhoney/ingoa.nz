<template>
	<section v-if="map">
		<h2 :id="map.code" class="display-1 mb-0 text-xs-center">
			<nuxt-link :to="localePath({name: 'map-map', params: {map: map.code}})">{{localeName(map.name)}}</nuxt-link>
		</h2>
		<h3 class="headline mb-0 text-xs-center mb-3">{{localeAltName(map.name)}}</h3>
		<img :src="map.images.portrait" :alt="localeNames(map.name)" :id="map.code" :usemap="'#map-' + map.code">
		<map :name="'map-' + map.code">
			<template v-for="region in map.regions">
				<template v-for="zone in region.zones">
					<nuxt-link v-for="(area, index) in zone.maplink.mapareas" :to="localePath({name: 'zone-zone', params: {zone: zone.code}})" :key="zone.code + index"
						:shape="area.shape" :coords="area.coords.map(coord => parseInt(coord)).join(',')" :title="localeNames(zone.name)" tag="area" />
					<!--:alt="localeNames(zone.name)" -->
				</template>
			</template>
			<template v-for="link in map.maplinks">
				<nuxt-link v-for="(area, index) in link.mapareas"
					:to="localePath(hash ? {name: 'island-island', params: {island: map.island.code}, hash: '#' + link.map.code} : {name: 'island-island', params: {island: map.island.code}})"
					:key="[link.map.code, index].join('-')" :shape="area.shape" :coords="area.coords.map(coord => parseInt(coord)).join(',')" :title="localeNames(link.map.name)" tag="area" />
			</template>
		</map>
		<p class="text-xs-center">{{$t('imagemap')}}</p>
	</section>
</template>

<script>
	import gql from 'graphql-tag';

	export default {
		props: {
			code: String,
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
				query: gql`query map($code: String) {
					map(filter: {code: $code}) {
						_id
						code
						name {
							en
							mi
						}
						dates {
							start
							end
						}
						regions {
							_id
							code
							zones {
								_id
								code
								name {
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
							code
						}
						maplinks {
							map {
								_id
								code
								name {
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
						code: this.code,
					}
				},
			},
		},
		mounted() {
			this.$nextTick(() => {
				if (process.browser) {
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
