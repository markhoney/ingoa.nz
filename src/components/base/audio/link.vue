<template>
	<a @click="$refs.audio.play()">
		{{name}}
		<audio ref="audio">
			<source :src="file" type="audio/mpeg" preload="none">
		</audio>
	</a>
</template>

<script>
	export default {
		props: {
			file: String,
			name: String,
		},
		data() {
			return {
				currentTime: 0,
			};
		},
	};
</script>
