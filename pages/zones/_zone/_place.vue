<template>
  <section>
		<h2 class="display-2">{{localeName(zone.names)}}</h2>
		<h3 class="display-1 mb-5">{{localeAltName(zone.names)}}</h3>
		<NamePlayer :file="zone.audio" :places="zone.places" />
  </section>
</template>

<script>
import NamePlayer from '~/components/NamePlayer.vue'

export default {
	components: {
    NamePlayer
  },
  async asyncData ({app}) {
    return {zone: app.$axios.$get('/api/zones/' + app.context.params.zone + '/names/' + app.context.params.name)};
  },
  head () {
    return {
      title: 'Zone'
    }
  }
}
</script>
