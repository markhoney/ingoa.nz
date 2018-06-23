<template>
  <section>
    <h1 class="display-2 mt-5">{{localeName(island.names)}}</h1>
		<h2 class="display-1 mb-4">{{localeAltName(island.names)}}</h2>
		<p v-html="island.description"></p>
		<!--<imagemaps :imagemaps="island.imagemaps"/>-->
		<section v-for="imagemap in island.imagemaps" v-bind:key="imagemap.code" class="pa-2">
			<h2 class="display-1 mb-0">{{localeName(imagemap.names)}}</h2>
			<h3 class="headline mb-0">{{localeAltName(imagemap.names)}}</h3>
			<imagemap :imagemap="imagemap" :hash="true"/>
			<h3 class="display-1 mt-5 mb-4">{{$tc('region', 2) | titlecase}}</h3>
			<regions :regions="island.regions.filter(region => region.location.imagemap.map == imagemap.id)"/>
		</section>
  </section>
</template>

<script>
import axios from '~/plugins/axios'
import regions from '~/components/regions.vue'
//import imagemaps from '~/components/imagemaps.vue'
import imagemap from '~/components/imagemap.vue'
//import region from '~/components/region_card.vue'

export default {
	components: {
		regions,
		imagemap

  },
  async asyncData (context) {
    const {data} = await axios.get('/api/islands/' + context.params.island + '?depth=1');
    return {island: data};
  },
  head () {
    return {
      title: 'Island'
    }
  }
}
</script>
