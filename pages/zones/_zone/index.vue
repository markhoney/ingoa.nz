<template>
  <section>
		<!--<h2 class="display-2">{{localeName(zone.names)}}</h2>
		<h3 class="display-1 mb-5">{{localeAltName(zone.names)}}</h3>-->
		<v-parallax :src="zone.image.landscape" height="150" style="border-radius: 20px;" class="px-3">
			<h2 class="display-2">{{localeName(zone.names)}}</h2>
			<h3 class="display-1 mb-5">{{localeAltName(zone.names)}}</h3>
			<h2 class="text-xs-right display-2">Zone {{zone.id}}</h2>
		</v-parallax>
		<player :file="zone.audio" :places="zone.places" :speakers="zone.speakers"  :wave="true" />
		<h3>{{$tc('speaker', 2) | initialcase}}</h3>
		<v-layout row wrap>
			<v-flex xs12 sm6 md4 class="pa-2">
				<template v-for="speaker in zone.speakers">
					<speaker v-if="speaker.code != 'hugh_young'" :speaker="speaker" :key="speaker.code"/>
				</template>
			</v-flex>
		</v-layout>
		<h3>{{$tc('location', 1) | initialcase}}</h3>
		<v-layout row wrap>
			<v-flex xs12 sm6 md4 class="pa-2">
				<island :island="zone.region.island"/>
			</v-flex>
			<v-flex xs12 sm6 md4 class="pa-2">
				<region :region="zone.region"/>
			</v-flex>
		</v-layout>
  </section>
</template>

<script>
import player from '~/components/audio_zone.vue'
import island from '~/components/island_card.vue'
import region from '~/components/region_card.vue'
import speaker from '~/components/speaker_card.vue'

export default {
	components: {
		player,
		island,
		region,
		speaker
  },
  async asyncData ({app}) {
    return {zone: await app.$axios.$get('/api/zones/' + app.context.params.zone + '?depth=1')};
  },
  head () {
    return {
      title: 'Zone'
    }
  }
}
</script>
<style scoped>
v-parallax {
	 border-radius: 20px;
}
</style>
