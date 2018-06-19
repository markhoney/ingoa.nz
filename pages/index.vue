<template>
  <section>
		<p style="font-style: italic;" v-html="$t('about')"></p>
		<p v-html="$t('instructions')"></p>
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
      title: 'Home'
    }
  }
}
</script>
