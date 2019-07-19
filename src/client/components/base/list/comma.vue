<template>
	<p><slot />
		<nuxt-link v-for="(item, index) in data" :key="item._id" :to="item.link" no-prefetch>
			{{item.title}}<template v-if="index != (data.length - 1)">, </template>
		</nuxt-link>
	</p>
</template>

<script>
	export default {
		props: {
			data: Array,
		},
	};
</script>
