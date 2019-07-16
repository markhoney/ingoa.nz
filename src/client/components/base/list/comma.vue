<template>
	<p><slot />
		<nuxt-link v-for="(item, index) in items" :key="item._id" :to="item.link" no-prefetch>
			{{item.title}}<template v-if="index != (items.length - 1)">, </template>
		</nuxt-link>
	</p>
</template>

<script>
	export default {
		props: {
			items: Array,
		},
	};
</script>
