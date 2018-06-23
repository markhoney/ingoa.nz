<template>
  <section>
    <h1 class="display-2 mt-5">{{localeName(island.names)}}</h1>
		<h2 class="display-1 mb-4">{{localeAltName(island.names)}}</h2>
		<p v-html="island.description"></p>
		<imagemaps :imagemaps="island.imagemaps"/>
		<h3 class="display-1 mt-5 mb-4">{{$tc('region', 2) | titlecase}}</h3>
		<regions :regions="island.regions"/>
  </section>
</template>

<script>
import axios from '~/plugins/axios'
import regions from '~/components/regions.vue'
import imagemaps from '~/components/imagemaps.vue'

export default {
	components: {
		regions,
		imagemaps

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
