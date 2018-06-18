<template>
  <section>
    <h1>Zone {{zone.id}}</h1>
		<h2>{{zone.name}}</h2>
		<WavePlayer :file="zone.file" :places="zone.places" />
  </section>
</template>

<script>
import axios from '~/plugins/axios'
import WavePlayer from '~/components/WavePlayer.vue'

export default {
	components: {
    WavePlayer
  },
  async asyncData (context) {
    const {data} = await axios.get('/api/zone/' + context.params.code);
    return {zone: data};
  },
  head () {
    return {
      title: 'Zone'
    }
  }
}
</script>
