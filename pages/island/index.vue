<template>
  <section>
    <h1>{{$tc('island', 2) | titlecase}}</h1>
		<v-flex xs12 sm6 offset-sm3>
      <v-card v-for="island in islands" v-bind:key="island.code">
        <nuxt-link :to="localePath({name: 'island-code', params: {code: island.code}})"><v-card-media :src="island.banner" height="180px"></v-card-media></nuxt-link>
        <v-card-title primary-title>
          <div>
            <h3 class="headline mb-0"><nuxt-link :to="localePath({name: 'island-code', params: {code: island.code}})">{{island.name}}</nuxt-link></h3>
						<h3>{{island.tereo}}</h3>
            <div><p v-html="island.description"></p></div>
          </div>
        </v-card-title>
        <v-card-actions>
          <v-btn flat color="orange"><nuxt-link :to="localePath({name: 'island-code', params: {code: island.code}})">{{$tc('detail', 2) | titlecase}}</nuxt-link></v-btn>
          <v-btn flat color="orange">Regions</v-btn>
          <v-btn flat color="orange">Zones</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </section>
</template>
<script>
import axios from '~/plugins/axios'

export default {
  async asyncData () {
    const {data} = await axios.get('/api/island')
    return {islands: data}
  },
  head () {
    return {
      title: 'Islands'
    }
  }
}
</script>
