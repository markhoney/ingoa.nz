<template>
  <section>
    <h1>{{$tc('region', 2) | titlecase}}</h1>
		<template v-for="island in islands">
			<v-subheader><nuxt-link :to="localePath({name: 'islands-island', params: {island: island.code}})">{{island.name}}</nuxt-link></v-subheader>
			<v-layout row wrap>
				<v-flex xs12 sm6 md4 v-for="region in island.regions" v-bind:key="region.code" class="pa-2">
					<region :region="region"/>
				</v-flex>
			</v-layout>
		</template>
  </section>
</template>

<script>
import axios from '~/plugins/axios'
import region from '~/components/region.vue'

export default {
	components: {
    region
  },
  async asyncData () {
    const {data} = await axios.get('/api/islands/regions')
    return {islands: data}
  },
  head () {
    return {
      title: 'Regions'
    }
  }
}
</script>
