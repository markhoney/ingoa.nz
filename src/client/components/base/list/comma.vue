<template>
	<p><slot />
		<template v-for="(item, index) in data">
			<nuxt-link :key="item._id" :to="item.link" no-prefetch>{{item.title}}</nuxt-link><template v-if="index <= data.length - 3">, </template><template v-else-if="index == data.length - 2">{{terminator || ", "}}</template>
		</template>
	</p>
</template>

<script>
	export default {
		props: {
			data: Array,
			terminator: {
				type: String,
				value: ", ",
			},
		},
	};
</script>
