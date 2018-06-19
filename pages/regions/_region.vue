<template>
  <section>
    <h1 class="display-2 mt-5">{{region.name}}</h1>
		<h2 class="display-1 mb-4" v-if="region.tereo != region.name">{{region.tereo}}</h2>
		<h3 class="display-1 mt-5 mb-4">{{$tc('zone', 2) | titlecase}}</h3>
		<zones :zones="region.zones"/>
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
    const {region} = await axios.get('/api/regions/' + context.params.region + '/zones');
    return {region: region};
  },
  head () {
    return {
      title: "Region"
    }
  }
}
</script>
