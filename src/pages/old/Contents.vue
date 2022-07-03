<template>
	<old>
		<p>
			<a name="top" />
			<g-link to="/old">HOME</g-link>
		</p>
		<p>Compiled by Hugh Young</p>
		<table style="margin: auto; margin-bottom: 20px;" cellpadding="5" border="0" bgcolor="#ffffff">
			<tbody>
				<tr>
					<td>
							<a href="#m1">Lower North Island</a>, Zones 1-59, recorded 1984-5
							<br><a href="#m2">Central North Island</a>, Zones 60-73, recorded 1986-8 and 74-108, 1988-91
							<br><a href="#m3">Auckland and Northland</a>, Zones 109-139, recorded 1988-91
							<br><a href="#m4">Northern and Eastern South Island</a>, Zones 140-157, recorded 1991-4
							<br><a href="#m5">Southern and Western South Island</a>, Zones 158-177, recorded 1991-4
							<br>(<g-link to="/old">Background</g-link>)
					</td>
				</tr>
			</tbody>
		</table>
		<table class="stat" align="center" border="0" cellpadding="3" bgcolor="#ffffff" style="margin: auto;">
			<tbody>
				<tr>
					<td align="right"><a name="m1" />ZONE</td>
					<td>&nbsp;</td>
					<td>SPEAKERS</td>
					<td>SELECTED<br>NAMES</td>
				</tr>
				<tr>
					<td align="right">&nbsp;</td>
					<td valign="bottom">&nbsp;</td>
					<td><i>Many of the speakers are no longer with us.<br>Their voices are taonga.<br>Please treat them with respect.</i></td>
					<td>&nbsp;</td>
				</tr>
				<tr>
					<td align="right">0</td>
					<td><a href="text/000.html" target="_blank">Introduction</a></td>
					<td>Wiremu Parker</td>
					<td><a href="names/aotearoa.wma" target="_blank">Aotearoa</a><br><a href="names/te-ika-a-maui.wma" target="_blank">Te Ika a Māui</a></td>
				</tr>
				<tr>
					<td colspan="4">Click on the map to jump to a zone.</td>
				</tr>
				<template v-for="map in $clean($page.maps)">
					<tr :key="map.id">
						<td :id="'m' + map.id" colspan="3"><!--<imagemap :map="map" :key="map.id" field="id" :value="map.id" style="margin: 20px;" />--></td>
						<td>&nbsp;</td>
					</tr>
					<tr :key="'header' + map.id">
						<td align="right"><a name="m1" />ZONE</td>
						<td>&nbsp;</td>
						<td>SPEAKERS</td>
						<td>SELECTED<br>NAMES</td>
					</tr>
					<template v-for="sector in map.sectors">
						<tr :key="map.id + sector.id">
							<td align="right">&nbsp;</td>
							<td valign="bottom"><b style="text-transform: uppercase;">{{sector.name && sector.name.locale.en}}</b></td>
							<td>&nbsp;</td>
							<td>&nbsp;</td>
						</tr>
						<tr v-for="zone in sector.zones" :key="map.id + sector.id + zone.id">
							<td align="right"><a :name="zone.number" />{{zone.number}}</td>
							<td><g-link :to="'/old/' + zone.id">{{zone.name.locale.en}}</g-link></td>
							<td><template v-for="(speaker, index) in zone.speakers.filter(speaker => speaker.id !== 'sp_37')">{{speaker.name.locale.en}}<template v-if="index < zone.speakers.length - 1">, </template></template></td>
							<td><span v-for="(name, index) in $clean($page.featured).filter((featured) => featured.zone.id === zone.id)" :key="index">{{name.locale.mi}}<br></span></td>
						</tr>
					</template>
				</template>
			</tbody>
		</table>
	</old>
</template>

<page-query>
	{
		maps: allMap {
			edges {
				node {
					id
					name {
						locale {
							en
							mi
						}
					}
					sectors: belongsTo(filter: {typeName: {eq: Sector}}) {
						edges {
							node {
								...on Sector {
									id
									name {
										locale {
											en
											mi
										}
									}
									zones: belongsTo(filter: {typeName: {eq: Zone}}) {
										edges {
											node {
												...on Zone {
													id
													slug {
														en
														mi
													}
													number
													name {
														locale {
															en
															mi
														}
													}
													speakers {
														id
														name {
															locale {
																mi
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
		featured: allPlacename(filter: {featured: {eq: true}}) {
			edges {
				node {
					id
					zone {
						id
					}
					names {
						name {
							locale {
								en
								mi
							}
						}
					}
				}
			}
		}
	}
</page-query>

<script>
	// import imagemap from '@/components/maps/image/map.vue';
	import Old from '~/layouts/Old.vue';
	export default {
		// components: {imagemap, Old},
	};
</script>
