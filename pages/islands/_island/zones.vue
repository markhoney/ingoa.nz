<template>
  <section class="container">
    <h1 class="display-2 mt5 mb4">{{$tc('zone', 2) | titlecase}}</h1>
		<zones :regions="island.regions"/>
   </section>
</template>

<script>
import zones from '~/components/zones.vue'

export default {
	components: {
		zones
  },
  async asyncData ({app}) {
    return {island: await app.$axios.$get('/api/islands/' + app.context.params.island + '?depth=2')}
  },
  head () {
    return {
      title: 'Zones'
    }
  }
}
</script>
<style scoped>
ul {
  height: 100px;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
}
</style>
