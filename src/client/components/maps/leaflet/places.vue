<template>
	<div id="map-wrap" style="height: 80vh; width: 100%;">
		<no-ssr>
			<l-map :bounds="bounds" style="z-index: 0;"><!-- :maxBounds="[[-34.45, 166.51], [-46.64, 178.52]]" -->
				<l-control-layers position="topright" />
				<l-tile-layer name="Streets" url="http://{s}.tile.osm.org/{z}/{x}/{y}.png" />
				<!--<l-tile-layer name="Topographical" url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png" />-->
				<!--<l-tile-layer name="LINZ" :url="'http://tiles-a.data-cdn.linz.govt.nz/services;key=' + key + '/tiles/v4/layer=LAYER_ID/EPSG:3857/{z}/{x}/{y}.png'" />-->
				<l-marker v-for="place in places" :key="place._id" :lat-lng="place.location.position">
					{{place}}
					<l-popup>
						<nuxt-link :to="localePath({name: 'placename-zone-placename', params: {zone: localeCurrent(place.placename.zone.slug), placename: localeCurrent(place.placename.slug)}})">
							{{localeCurrent(place.title)}}
						</nuxt-link>
						<br>
						Feature: <nuxt-link :to="localePath({name: 'feature-feature', params: {feature: localeCurrent(place.feature.slug)}})">
							{{localeCurrent(place.feature.title)}}
						</nuxt-link>
					</l-popup>
				</l-marker>
			</l-map>
		</no-ssr>
	</div>
</template>

<script>

	export default {
		props: {
			cluster: {
				type: Boolean,
				default: false,
			},
			field: String,
			value: String,
		},
		apollo: {
			placenames: {
				query() {
					return this.$gql`query placenames($field: String, $value: String) {
						placenames(filter: [{field: $field, value: $value}]) {
							_id
							slug {
								en
								mi
							}
							zone {
								slug {
									en
									mi
								}
							}
							places {
								_id
								title {
									en
									mi
								}
								location {
									position {
										lat
										lng
									}
								}
								feature {
									slug {
										en
										mi
									}
									title {
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
					this.$eventbus.$emit("loading", countModifier);
				},
			},
		},
		data() {
			return {
				key: process.env.LINZ_API_KEY
			};
		},
		computed: {
			places: function() {
				if (this.placenames) return this.placenames.filter(placename => placename.places).map(placename => placename.places.map(place => {
					return {
						...place,
						placename: placename,
					};
				})).flat().filter(place => place.location && place.location.position);
			},
			bounds: function() { //[[left, top], [right, bottom]]
				if (this.places) {
					return this.places.reduce((bounds, place) => {
						if (place.location.position.lat > bounds[0][0]) bounds[0][0] = place.location.position.lat;
						if (place.location.position.lng > bounds[0][1]) bounds[0][1] = place.location.position.lng;
						if (place.location.position.lat < bounds[1][0]) bounds[1][0] = place.location.position.lat;
						if (place.location.position.lng < bounds[1][1]) bounds[1][1] = place.location.position.lng;
						return bounds;
					}, [[-90, -180], [90, 180]]);
				}
			},
		},
	};
</script>
