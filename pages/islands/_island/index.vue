<template>
  <section>
    <h1 class="display-2 mt-5">{{localeName(island.names)}}</h1>
		<h2 class="display-1 mb-4">{{localeAltName(island.names)}}</h2>
		<p v-html="island.description"></p>
		<player :file="island.zone.audio" :places="island.zone.places" :speakers="island.zone.speakers" :common="true" :wave="false" />
		<template v-for="imagemap in island.imagemaps">
			<imagemap :key="imagemap.code" :imagemap="imagemap" :regions="island.regions.filter(region => region.location.imagemap.map == imagemap.id)"/>
		</template>
  </section>
</template>

<script>
import imagemap from '~/components/imagemap_regions.vue'
import player from '~/components/audio_zone.vue'

export default {
	components: {
		imagemap,
		player
  },
  async asyncData ({app}) {
    return {island: await app.$axios.$get('/api/islands/' + app.context.params.island + '?depth=2')};
  },
  head () {
    return {
      title: 'Island'
    }
  }
}
</script>
