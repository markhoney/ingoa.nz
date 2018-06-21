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
  async asyncData (context) {
    const data = await context.app.$axios.$get('/api/islands')
    return {islands: data}
  },
  head () {
    return {
      title: 'Islands'
    }
  }
}
</script>
