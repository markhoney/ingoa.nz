<template>
	<ul>
		<li v-for="item in $q.simplify($page)" :key="item.id">
			<g-link :to="$tp(`/${$tc('type.' + type, 2)}/${item.id}`)">{{$tf.first(item.name.locale)}}</g-link>
			<template v-if="$tf.complete(item.name.locale)"> ({{$tf.other(item.name.locale)}})</template>
		</li>
	</ul>
</template>

<page-query>
	{
		allIwi(sortBy: "id", order: ASC) {
			edges {
				node {
					id
					name {
						locale {
							mi
						}
					}
				}
			}
		}
	}
</page-query>

<script>
	export default {
		computed: {
			type() {
				return this.$q.type(this.$page);
			}
		},
		metaInfo () {
			return {
				title: this.$case.sentenceCase(this.$tc('type.' + this.type, 2)),
			}
		},
	};
</script>
