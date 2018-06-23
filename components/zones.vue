<template>
	<v-layout v-if="cards" row wrap>
		<v-flex xs12 sm6 md4 v-for="zone in zones" v-bind:key="zone.code" class="pa-2">
			<zone :zone="zone"/>
		</v-flex>
	</v-layout>
	<ul v-else>
		<li v-for="zone in zones" v-bind:key="zone.code">
			<nuxt-link :to="localePath({name: 'zones-zone', params: {zone: zone.code}})">{{localeNames(zone.names)}}</nuxt-link>
		</li>
	</ul>

</template>

<script>
import zone from '~/components/zone_card.vue'

export default {
	props: {
		zones: Array,
		cards: {
			type: Boolean,
			default: true
		}
	},
	components: {
    zone
  }
}
</script>
