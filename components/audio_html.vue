<template>
	<audio class="my-3" controls @timeupdate="$emit('time', $event.target.currentTime)">
		<source :src="file" type="audio/mpeg" preload="auto" />
	</audio>
</template>

<script>
export default {
	props: {
		file: String
	}
}
</script>

<style scoped>
audio {
  width: 100%;
}
</style>
