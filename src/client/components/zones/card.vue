<template>
	<v-card v-if="zone">
		<nuxt-link :to="localePath({name: 'zone-zone', params: {zone: localeCurrent(zone.slug)}})">
			<v-img :src="zone.images.landscape" height="160" alt="" />
		</nuxt-link><!-- height="180px" -->
		<v-card-title primary-title>
			<div>
				<h3 class="headline mb-0">
					<nuxt-link :to="localePath({name: 'zone-zone', params: {zone: localeCurrent(zone.slug)}})">
						{{localeCurrent(zone.title.locale)}}
					</nuxt-link>
				</h3>
				<h3>{{localeOther(zone.title.locale)}}</h3>
			</div>
		</v-card-title>
	</v-card>
</template>

<script>

	export default {
		props: {
			id: String,
			data: Object,
		},
		apollo: {
			remote: {
				skip() {
					return (this.data ? true : false);
				},
				query() {
					return this.$gql`query zone($id: String) {
						zone(filter: [{_id: $id}]) {
							_id
							slug {
								en
								mi
							}
							title {
								locale {
									en
									mi
								}
							}
							images {
								landscape
							}
						}
					}`;
				},
				update: response => response.island,
				variables() {
					return {
						id: this.id,
					};
				},
				watchLoading (isLoading, countModifier) {
					this.$store.commit('loading', countModifier);
				},
			},
		},
		computed: {
			zone: function() {
				return this.data || this.remote;
			},
		},
	};
</script>
