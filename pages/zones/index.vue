<template>
  <section class="container">
    <h1>{{$tc('zone', 2) | titlecase}}</h1>
    <ul>
      <li v-for="zone in zones" v-bind:key="zone.code">
        <nuxt-link :to="localePath({name: 'zones-zone', params: {zone: zone.code}})">{{zone.name}}</nuxt-link>
      </li>
    </ul>
  </section>
</template>
<script>
import axios from '~/plugins/axios'

export default {
  async asyncData () {
    const {data} = await axios.get('/api/regions/zones')
    return {zones: data}
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
