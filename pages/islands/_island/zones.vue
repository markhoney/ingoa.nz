<template>
  <section class="container">
    <h1 class="display-2 mt5 mb4">{{$tc('zone', 2) | titlecase}}</h1>
		<zones :regions="island.regions"/>
   </section>
</template>

<script>
import axios from '~/plugins/axios'
import zones from '~/components/zones.vue'

export default {
	components: {
		zones
  },
  async asyncData (context) {
    const {data} = await axios.get('/api/islands/' + context.params.island + '?depth=2')
    return {island: data}
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
