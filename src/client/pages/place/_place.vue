<template>
	<section>
		<p v-html="island.description" />
		<player
			:file="place.zone.audio"
			:start="place.zone.audio.start"
			:end="place.zone.audio.end"
/>
		<v-layout
			row
			wrap
>
			<v-flex
				xs12
				sm6
				md4
				class="pa-2"
>
				<island :island="place.zone.region.island" />
			</v-flex>
			<v-flex
				xs12
				sm6
				md4
				class="pa-2"
>
				<region :region="place.zone.region" />
			</v-flex>
			<v-flex
				xs12
				sm6
				md4
				class="pa-2"
>
				<zone :zone="place.zone" />
			</v-flex>
		</v-layout>
	</section>
</template>

<script>
	import island from '@/components/islands/card.vue';
	import region from '@/components/regions/card.vue';
	import zone from '@/components/zones/card.vue';
	import speaker from '@/components/speakers/card.vue';
	import player from '@/components/audio/player/name.vue';

	export default {
		components: {
			island,
			region,
			zone,
			speaker,
			player,
		},
		async asyncData({app}) {
			return {
			/*place: await app.$axios.$get(
				'/api/zones/' +
					app.context.params.zone +
					'/places/' +
					app.context.params.place,
				),*/
			};
		},
		head() {
			return {
				title: this.place.name + ', ' + this.localeName(this.place.zone.name),
			};
		},
	};
</script>
