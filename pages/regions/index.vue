<template>
  <section>
    <h1 class="display-2">{{$tc('region', 2) | titlecase}}</h1>
		<template v-for="island in islands">
			<v-subheader class="display-1 mt-5 mb-3" :key="island.name"><nuxt-link :to="localePath({name: 'islands-island', params: {island: island.code}})">{{island.name}}</nuxt-link></v-subheader>
			<v-subheader class="display-1 mb-4" :key="island.name" v-if="island.tereo != island.name">{{island.tereo}}</v-subheader>
			<regions :regions="island.regions" :key="island.name" />
		</template>
  </section>
</template>

<script>
import axios from '~/plugins/axios'
import regions from '~/components/regions.vue'

export default {
	components: {
    regions
  },
  async asyncData () {
    const {islands} = await axios.get('/api/islands/regions')
    return {islands: islands}
  },
  head () {
    return {
      title: 'Regions'
    }
  }
}
</script>
