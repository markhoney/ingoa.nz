<template>
	<section v-if="zone">
		<p><nuxt-link :to="localePath({name: 'old'})">Index</nuxt-link></p>
		<p><nuxt-link :to="localePath({name: 'old-contents'})">Contents</nuxt-link></p>
		<p v-if="zone.previous"><nuxt-link :to="localePath({name: 'old-zone', params: {zone: localeCurrent(zone.previous.slug)}})">Previous zone</nuxt-link></p>
		<table style="margin: auto;">
			<tbody>
				<tr>
					<td width="75">&nbsp;</td>
					<td>
						<h2>Ngā Ingoa o Aotearoa</h2>
						<h1>Zone {{zone.number}} - {{localeCurrent(zone.title.locale)}}</h1>
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
							<template v-for="(speaker, index) in zone.speakers.filter(speaker => speaker._id !== 'sp_37')">
								{{localeCurrent(speaker.title.locale)}}<template v-if="index < zone.speakers.length - 2">, </template>
							</template>
						</a>
					</td>
				</tr>
				<tr>
					<td colspan="2">
						<audio controls>
							<source :src="zone.audio.file" type="audio/mpeg" preload="auto">
						</audio>
					</td>
				</tr>
				<tr v-for="placename in zone.placenames" :key="placename._id">
					<td>{{placename.names.map(name => localeCurrent(name.title.locale)).join(", ")}}</td>
					<td><template v-for="place in placename.places">{{localeCurrent(place.feature.title.locale)}}&nbsp;&nbsp;&nbsp;&nbsp;</template></td>
				</tr>
			</tbody>
		</table>
		<p v-if="zone.next"><nuxt-link :to="localePath({name: 'old-zone', params: {zone: localeCurrent(zone.next.slug)}})">Next zone</nuxt-link></p>
	</section>
</template>

<script>
	import player from '@/components/base/audio/link.vue';

	export default {
		layout: 'old',
		components: {
			player,
		},
		apollo: {
			zone: {
				query() {
					return this.$gql`query zone($id: String) {
						zone(filter: [{_id: $id}]) {
							_id
							number
							previous {
								_id
								slug {
									en
									mi
								}
							}
							next {
								_id
								slug {
									en
									mi
								}
							}
							title {
								locale {
									en
									mi
								}
							}
							audio {
								file
							}
							images {
								landscape
							}
							speakers {
								_id
								title {
									locale {
										en
										mi
									}
								}
							}
							placenames {
								names {
									_id
									title {
										locale {
											en
											mi
										}
									}
								}
								places {
									_id
									feature {
										_id
										title {
											locale {
												en
												mi
											}
										}
									}
								}
							}
						}
					}`;
				},
				variables() {
					return {
						id: this.$route.params.zone,
					};
				},
				watchLoading (isLoading, countModifier) {
					this.$store.commit('loading', countModifier);
				},
			},
		},
	};
</script>

<style scoped>
	td {
		padding: 5px;
	}
	audio {
		width: 100%;
	}
</style>
