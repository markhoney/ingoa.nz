<template>
  <section class="container">
    <h1 class="display-2 mt5 mb4">{{$tc('zone', 2) | titlecase}}</h1>
		<zones :regions="regions"/>
  </section>
</template>

<script>
import axios from '~/plugins/axios'
import zones from '~/components/zones.vue'

export default {
	components: {
    zones
  },
  async asyncData () {
    const {data} = await axios.get('/api/regions?depth=1')
    return {regions: data}
  },
  head () {
    return {
      title: 'Zones'
    }
  }
}
</script>
