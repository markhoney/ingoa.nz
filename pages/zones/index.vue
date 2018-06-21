<template>
  <section class="container">
    <h1 class="display-2 mt5 mb4">{{$tc('zone', 2) | titlecase}}</h1>
    <template v-for="region in regions">
			<h2 class="headline mt5 mb4" :key="region.name">{{region.name}}</h2>
			<ul :key="region.name">
				<li v-for="zone in region.zones" v-bind:key="zone.code">
					<nuxt-link :to="localePath({name: 'zones-zone', params: {zone: zone.code}})">{{zone.name}}</nuxt-link>
				</li>
			</ul>
    </template>
  </section>
</template>
<script>
import axios from '~/plugins/axios'

export default {
  async asyncData () {
    const {data} = await axios.get('/api/regions/zones')
    return {regions: data}
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
