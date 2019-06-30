<template>
	<section>
		<p>
			<a name="top" />
			<nuxt-link :to="localePath({name: 'old'})">HOME</nuxt-link>
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
							<br>(<nuxt-link :to="localePath({name: 'old'})">Background</nuxt-link>)
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
				<template v-for="map in maps">
					<tr :key="map.code">
						<td :id="'m' + map.code" colspan="3"><imagemap :key="map.code" :code="map.code" style="margin: 20px;" /></td>
						<td>&nbsp;</td>
					</tr>
					<tr :key="'header' + map.code">
						<td align="right"><a name="m1" />ZONE</td>
						<td>&nbsp;</td>
						<td>SPEAKERS</td>
						<td>SELECTED<br>NAMES</td>
					</tr>
					<template v-for="region in map.regions">
						<tr :key="map.code + region.code">
							<td align="right">&nbsp;</td>
							<td valign="bottom"><b style="text-transform: uppercase;">{{localeTitle(region.title)}}</b></td>
							<td>&nbsp;</td>
							<td>&nbsp;</td>
						</tr>
						<tr v-for="zone in region.zones" :key="map.code + region.code + zone.code">
							<td align="right"><a :name="zone.number" />{{zone.number}}</td>
							<td><nuxt-link :to="localePath({name: 'old-zone', params: {zone: zone.code}})">{{localeTitle(zone.title)}}</nuxt-link></td>
							<td><template v-for="(speaker, index) in zone.speakers.filter(speaker => speaker.code != 'hugh_young')">{{localeTitle(speaker.title)}}<template v-if="index < zone.speakers.length - 1">, </template></template></td>
							<td><span v-for="(name, index) in zone.featured" :key="index">{{maoriTitle(name.title)}}<br></span></td>
						</tr>
					</template>
				</template>
			</tbody>
		</table>
	</section>
</template>

<script>
	import gql from 'graphql-tag';
	import imagemap from '@/components/maps/image/map.vue';

	export default {
		layout: 'old',
		components: {
			imagemap,
		},
		apollo: {
			maps: gql`{
				maps {
					_id
					code
					title {
						en
						mi
					}
					regions {
						_id
						code
						title {
							en
							mi
						}
						zones {
							_id
							code
							number
							title {
								en
								mi
							}
							speakers {
								_id
								code
								title {
									en
									mi
								}
							}
							featured {
								_id
								code
								names {
									title {
										en
										mi
									}
								}
							}
						}
					}
				}
			}`,
		}
	};
</script>
