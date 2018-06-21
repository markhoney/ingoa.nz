<template>
  <section>
    <h1>
      {{$t('zone') | titlecase}} {{zone.id}}
    </h1>
		<h2>{{zone.name}}</h2>
		<AudioPlayer :file="zone.file" :places="zone.places" />
  </section>
</template>

<script>
import axios from '~/plugins/axios'
import AudioPlayer from '~/components/AudioPlayer.vue'

export default {
	components: {
    AudioPlayer
  },
  async asyncData (context) {
    const {data} = await axios.get('/api/zones/' + context.params.code);
    return {zone: data};
  },
  head () {
    return {
      title: 'Zone'
    }
  }
}
</script>
