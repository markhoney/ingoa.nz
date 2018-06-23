<template>
  <section>
		<h2 class="display-2">{{localeName(zone.names)}}</h2>
		<h3 class="display-1 mb-5">{{localeAltName(zone.names)}}</h3>
		<AudioPlayer :file="zone.audio" :places="zone.places" />
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
    const {data} = await axios.get('/api/zones/' + context.params.zone + '?depth=1');
    return {zone: data};
  },
  head () {
    return {
      title: 'Zone'
    }
  }
}
</script>
