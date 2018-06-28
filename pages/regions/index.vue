<template>
  <section>
    <h1 class="display-2">{{$tc('region', 2) | titlecase}}</h1>
		<template v-for="island in islands">
			<v-subheader class="display-1 mt-5 mb-3" :key="island.code">
				<nuxt-link :to="localePath({name: 'islands-island', params: {island: island.code}})">
					{{localeName(island.names)}}
				</nuxt-link>
			</v-subheader>
			<v-subheader class="display-1 mb-4" :key="island.name.mi" v-if="localeBothNames(island.names)">
				{{localeAltName(island.names)}}
			</v-subheader>
			<regions :regions="island.regions" :key="island.code" />
		</template>
  </section>
</template>

<script>
import regions from '~/components/regions.vue'

export default {
	components: {
    regions
  },
  async asyncData ({app}) {
    return {islands: await app.$axios.$get('/api/islands?depth=1')}
  },
  head () {
    return {
      title: 'Regions'
    }
  }
}
</script>
