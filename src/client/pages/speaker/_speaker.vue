<template>
	<section v-if="speaker">
		<h2>{{this.localeCurrent(this.speaker.title)}}</h2>
		<div v-if="speaker.notes">
			<p v-if="speaker.notes.description">{{speaker.notes.description}}</p>
			<p v-if="speaker.notes.recording">{{speaker.notes.recording}}</p>
		</div>
		<p>{{this.localeCurrent(this.speaker.title)}} spoke for the following Zones:</p>
		<zones :data="speaker.zones" />
	</section>
</template>

<script>
	import zones from '@/components/zones/cards.vue';

	export default {
		components: {
			zones,
		},
		apollo: {
			speaker: {
				query() {
					return this.$gql`query speaker($field: String, $value: String) {
						speaker(filter: [{field: $field, value: $value}]) {
							_id
							title {
								en
								mi
							}
							zones {
								_id
								slug {
									en
									mi
								}
								title {
									en
									mi
								}
								images {
									landscape
								}
							}
						}
					}`;
				},
				variables() {
					return {
						field: "slug",
						value: this.$route.params.speaker,
					};
				},
				watchLoading (isLoading, countModifier) {
					this.$eventbus.$emit("loading", countModifier);
				},
			},
		},
		head() {
			return {
				title: (this.speaker ? this.localeCurrent(this.speaker.title) + ' (' + this.$tc('speaker') + ')' : ''),
			};
		},
	};
</script>
