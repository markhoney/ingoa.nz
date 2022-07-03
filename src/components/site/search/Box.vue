<template>
	<form class="d-flex">
		<input
			type="search"
			class="form-control me-2"
			placeholder="Search..."
			aria-label="Search"
			:value="value"
			@input="$emit('input', $event.target.value)"
			@focus="$emit('focus')"
			@blur="$emit('blur')"
		/>
		<g-link class="btn btn-outline-success" :to="'/search?s=' + value">Search</g-link>
	</form>
</template>

<script>
	export default {
		props: ['value'],
		methods: {
			hide() {
				setTimeout(() => {this.focus = false}, 100);
			},
		}
	};
</script>
