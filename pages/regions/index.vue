<template>
  <section>
    <h1 class="display-2">{{$tc('region', 2) | titlecase}}</h1>
		<template v-for="island in islands">
			<v-subheader class="display-1 mt-5 mb-3" :key="island.name.en">
				<nuxt-link :to="localePath({name: 'islands-island', params: {island: island.code}})">
					{{localeName(island.name)}}
				</nuxt-link>
			</v-subheader>
			<v-subheader class="display-1 mb-4" :key="island.name.mi" v-if="localeBothNames(island.name)">
				{{localeAltName(island.name)}}
			</v-subheader>
			<regions :regions="island.regions" :key="island.code" />
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
    const {data} = await axios.get('/api/islands?depth=1')
    return {islands: data}
  },
  head () {
    return {
      title: 'Regions'
    }
  }
}
</script>
