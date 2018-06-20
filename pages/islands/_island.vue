<template>
  <section>
    <h1 class="display-2 mt-5">{{island.name}}</h1>
		<h2 class="display-1 mb-4" v-if="island.tereo != island.name">{{island.tereo}}</h2>
		<p v-html="island.description"></p>
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
    regions
  },
  async asyncData (context) {
    //const island = await axios.get('/api/islands/' + context.params.island + '/regions');
    const imagemaps = await axios.get('/api/imagemaps/' + context.params.island + '/regions');
    return {island: island.data};
  },
  head () {
    return {
      title: 'Island'
    }
  }
}
</script>
