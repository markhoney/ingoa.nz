<template>
  <section>
    <h1 class="display-2 mt-5">{{localeName(region.names)}}</h1>
		<h2 class="display-1 mb-4" v-if="localeBothNames(region.names)">{{localeAltName(region.names)}}</h2>
		<h3 class="display-1 mt-5 mb-4">{{$tc('zone', 2) | titlecase}}</h3>
		<zones :zones="region.zones"/>
  </section>
</template>

<script>
import zones from '~/components/zones.vue'

export default {
	components: {
    zones
  },
  async asyncData ({app}) {
    return {region: await app.$axios.$get('/api/regions/' + app.context.params.region + '?depth=1')};
  },
  head () {
    return {
      title: "Region"
    }
  }
}
</script>
