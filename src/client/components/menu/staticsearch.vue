<template>
	<v-autocomplete :items="suggestions" v-model="search" prepend-icon="search" />
</template>

<script>
	import gql from 'graphql-tag';
	import search from '@/components/menu/search.vue';

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
					code
					title {
						en
						mi
					}
				}
			}`,
			regions: gql`{
				regions {
					_id
					code
					title {
						en
						mi
					}
				}
			}`,
			zones: gql`{
				zones {
					_id
					code
					title {
						en
						mi
					}
				}
			}`,
			maps: gql`{
				maps {
					_id
					code
					title {
						en
						mi
					}
				}
			}`,
			speakers: gql`{
				speakers {
					_id
					code
					title {
						en
						mi
					}
				}
			}`,
			groups: gql`{
				groups {
					_id
					code
					title {
						en
						mi
					}
				}
			}`,
			features: gql`{
				features {
					_id
					code
					title {
						en
						mi
					}
				}
			}`,
			ngaiwi: gql`{
				ngaiwi {
					_id
					code
					title {
						en
						mi
					}
				}
			}`,
			placenames: gql`{
				placenames {
					_id
					code
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
					...this.ngaiwi,
					...this.placenames.map(placename => (placename.names || []).map(name => {
						return {
							...name,
							__typename: 'name',
							code: placename.code
						};
					})).flat(),
					...this.placenames.map(placename => (placename.places || []).map(place => {
						return {
							...place,
							__typename: 'place',
							code: placename.code
						};
					})).flat(),
				].map(data => {
					return {
						value: '/' + [data.__typename, data.code].join('/'),
						text: this.localeTitle(data.title) + ' (' + data.__typename + ')'
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
