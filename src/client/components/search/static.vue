<template>
	<v-autocomplete :items="suggestions" v-model="search" prepend-icon="search" />
</template>

<script>
	import gql from 'graphql-tag';

	export default {
		data() {
			return {
				search: ''
			}
		},
		apollo: {
			islands: gql`{
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
			}`,
			regions: gql`{
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
			}`,
			zones: gql`{
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
			}`,
			maps: gql`{
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
			}`,
			speakers: gql`{
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
			}`,
			groups: gql`{
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
			}`,
			features: gql`{
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
			}`,
			tribes: gql`{
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
			}`,
			placenames: gql`{
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
			}`,
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
			}
		},
		watch: {
			search: function(search) {
				this.$router.push({path: search});
			}
		},
	};
</script>
