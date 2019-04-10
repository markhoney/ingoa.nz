<template>
	<v-card v-if="zone">
		<nuxt-link :to="localePath({name: 'zone-zone', params: {zone: zone.code}})">
			<v-img :src="zone.images.landscape" height="160" />
		</nuxt-link><!-- height="180px" -->
		<v-card-title primary-title>
			<div>
				<h3 class="headline mb-0">
					<nuxt-link :to="localePath({name: 'zone-zone', params: {zone: zone.code}})">
						{{localeName(zone.name)}}
					</nuxt-link>
				</h3>
				<h3>{{localeAltName(zone.name)}}</h3>
			</div>
		</v-card-title>
	</v-card>
</template>

<script>
	import gql from 'graphql-tag';

	export default {
		props: {
			code: String,
		},
		apollo: {
			zone: {
				query: gql`query zone($code: String) {
					zone(filter: {code: $code}) {
						_id
						code
						name {
							en
							mi
						}
						images {
							landscape
						}
					}
				}`,
				variables() {
					return {
						code: this.code,
					}
				},
			},
		},
	};
</script>
