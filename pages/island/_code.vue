<template>
  <section>
    <h1>{{island.name}}</h1>
		<h2>{{island.tereo}}</h2>
  </section>
</template>

<script>
import axios from '~/plugins/axios'

export default {
  async asyncData (context) {
    const {data} = await axios.get('/api/island/' + context.params.code);
    return {island: data};
  },
  head () {
    return {
      title: 'Island'
    }
  }
}
</script>
