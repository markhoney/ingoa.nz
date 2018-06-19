<template>
  <section>
    <h1>{{$tc('island', 2) | titlecase}}</h1>
			<v-layout>
			<v-flex xs12 sm6 md4 v-for="island in islands" v-bind:key="island.code" class="pa-2">
				<island :island="island"/>
			</v-flex>
		</v-layout>
  </section>
</template>

<script>
import axios from '~/plugins/axios'
import island from '~/components/island.vue'

export default {
	components: {
    island
  },
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
