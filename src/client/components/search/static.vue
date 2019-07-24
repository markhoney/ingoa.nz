<template>
	<v-autocomplete :items="suggestions" v-model="search" prepend-icon="search" />
</template>

<script>

	export default {
		data() {
			return {
				search: ''
			}
		},
		apollo: {
			islands: {
				query() {
					return this.$gql`{
						islands {
							_id
							slug {
								en
								mi
							}
							title {
								en
								mi
							}
						}
					}`;
				},
				watchLoading (isLoading, countModifier) {
					this.$store.commit('loading', countModifier);
				},
			},
			regions() {
				return this.$gql`{
					regions {
						_id
						slug {
							en
							mi
						}
						title {
							en
							mi
						}
					}
				}`;
			},
			zones() {
				return this.$gql`{
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
					}
				}`;
			},
			maps() {
				return this.$gql`{
					maps {
						_id
						slug {
							en
							mi
						}
						title {
							en
							mi
						}
					}
				}`;
			},
			speakers() {
				return this.$gql`{
					speakers {
						_id
						slug {
							en
							mi
						}
						title {
							en
							mi
						}
					}
				}`;
			},
			groups() {
				return this.$gql`{
					groups {
						_id
						slug {
							en
							mi
						}
						title {
							en
							mi
						}
					}
				}`;
			},
			features() {
				return this.$gql`{
					features {
						_id
						slug {
							en
							mi
						}
						title {
							en
							mi
						}
					}
				}`;
			},
			tribes() {
				return this.$gql`{
					tribes {
						_id
						slug {
							en
							mi
						}
						title {
							en
							mi
						}
					}
				}`;
			},
			placenames() {
				return this.$gql`{
					placenames {
						_id
						slug {
							en
							mi
						}
						names {
							_id
							title {
								en
								mi
							}
						}
						places {
							_id
							title {
								en
								mi
							}
						}
					}
				}`;
			},
		},
		computed: {
			suggestions() {
				return [
					...this.islands,
					...this.regions,
					...this.zones,
					...this.maps,
					...this.speakers,
					...this.groups,
					...this.features,
					...this.tribes,
					...this.placenames.map(placename => (placename.names || []).map(name => {
						return {
							...name,
							__typename: 'name',
							slug: placename.slug
						};
					})).flat(),
					...this.placenames.map(placename => (placename.places || []).map(place => {
						return {
							...place,
							__typename: 'place',
							slug: placename.slug
						};
					})).flat(),
				].map(data => {
					return {
						value: '/' + [data.__typename, data.code].join('/'),
						text: this.localeCurrent(data.title) + ' (' + data.__typename + ')'
					};
				});
			},
		},
		watch: {
			search: function(search) {
				this.$router.push({path: search});
			},
		},
	};
</script>
