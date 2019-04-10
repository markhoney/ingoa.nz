<template>
	<section v-if="zone">
		<p><nuxt-link :to="localePath({name: 'old'})">Index</nuxt-link></p>
		<p><nuxt-link :to="localePath({name: 'old-contents'})">Contents</nuxt-link></p>
		<p v-if="zone.previous"><nuxt-link :to="localePath({name: 'old-zone', params: {zone: zone.previous.code}})">Previous zone</nuxt-link></p>
		<table style="margin: auto;">
			<tbody>
				<tr>
					<td width="75">&nbsp;</td>
					<td>
						<h2>Ng&#257; Ingoa o Aotearoa</h2>
						<h1>Zone {{zone.number}} - {{localeName(zone.name)}}</h1>
					</td>
				</tr>
			</tbody>
		</table>
		<table cellpadding="5" border="0" bgcolor="#ffffff" style="margin: auto;">
			<tbody>
				<tr>
					<td colspan="2">
						<a :href="zone.audio.file" target="_blank">
							Zone {{zone.number}} - spoken by
							<template v-for="(speaker, index) in zone.speakers.filter(speaker => speaker.code !== 'hugh_young')">
								{{localeName(speaker.name)}}<template v-if="index < zone.speakers.length - 2">, </template>
							</template>
						</a>
					</td>
				</tr>
				<template v-for="placename in zone.placenames">
					<tr v-for="(name, index) in placename.names" :key="index">
						<td>{{localeName(name.name)}}</td>
						<td><template v-for="place in placename.places">{{localeName(place.feature.name)}}&nbsp;&nbsp;&nbsp;&nbsp;</template></td>
					</tr>
				</template>
			</tbody>
		</table>
		<p v-if="zone.next"><nuxt-link :to="localePath({name: 'old-zone', params: {zone: zone.next.code}})">Next zone</nuxt-link></p>
	</section>
</template>

<script>
	import gql from 'graphql-tag';
	import player from '@/components/audio/player/link.vue';

	export default {
		layout: 'old',
		components: {
			player,
		},
		apollo: {
			zone: {
				query: gql`query zone($code: String) {
					zone(filter: {code: $code}) {
						_id
						code
						number
						previous {
							_id
							code
						}
						next {
							_id
							code
						}
						name {
							en
							mi
						}
						audio {
							file
						}
						images {
							landscape
						}
						speakers {
							_id
							code
							name {
								en
								mi
							}
						}
						placenames {
							names {
								_id
								name {
									en
									mi
								}
							}
							places {
								_id
								feature {
									_id
									name {
										en
										mi
									}
								}
							}
						}
					}
				}`,
				variables() {
					return {
						code: this.$route.params.zone,
					}
				},
			},
		},
	};
</script>

<style scoped>
	td {
		padding: 5px;
	}
</style>
