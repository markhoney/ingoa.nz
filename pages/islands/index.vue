<template>
  <section>
    <h1>{{$tc('island', 2) | titlecase}}</h1>
		<islands :islands="islands"/>
  </section>
</template>

<script>
import islands from '~/components/islands.vue'

export default {
	components: {
    islands
  },
  async asyncData ({app}) {
    return {islands: await app.$axios.$get('/api/islands')}
  },
  head () {
    return {
      title: 'Islands'
    }
  }
}
</script>
