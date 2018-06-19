<template>
  <section>
    <h1>{{$tc('island', 2) | titlecase}}</h1>
		<islands :islands="islands"/>
  </section>
</template>

<script>
import axios from '~/plugins/axios'
import islands from '~/components/islands.vue'

export default {
	components: {
    islands
  },
  async asyncData () {
    const {islands} = await axios.get('/api/islands')
    return {islands: islands}
  },
  head () {
    return {
      title: 'Islands'
    }
  }
}
</script>
