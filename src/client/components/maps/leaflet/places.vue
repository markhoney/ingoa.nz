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
				query: gql`query placenames($field: String, $value: String, $lang: String) {
					placenames(filter: {field: $field, value: $value, lang: $lang}) {
						_id
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
								title {
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
						value: this.value,
						lang: this.$i18n.locale,
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
