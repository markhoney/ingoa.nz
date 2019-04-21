<template>
	<div id="map-wrap" style="height: 100vh">
		<no-ssr>
			<l-map :zoom=13 :center="[47.413220, -1.219482]">
				<l-tile-layer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"></l-tile-layer>
				<l-marker :lat-lng="[47.413220, -1.219482]"></l-marker>
			</l-map>
		</no-ssr>
	</div>
</template>

<script>
	import gql from 'graphql-tag';

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
				query: gql`query placenames($field: String, $value: String) {
					placenames(filter: {field: $field, value: $value}) {
						_id
						code
						zone_code
						places {
							_id
							name {
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
								name {
									en
									mi
								}
							}
						}
					}
				}`,
				variables() {
					return {
						field: this.field,
						value: this.value
					}
				},
			},
		},
		data() {
			return {
			};
		},
	};
</script>
