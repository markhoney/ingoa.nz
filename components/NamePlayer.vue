<template>
		<audio controls ref="audio" @timeupdate='currentTime = $event.target.currentTime'>
			<source :src="file" type="audio/mpeg" preload="auto" />
		</audio>
</template>

<style scoped>
audio {
  width: 100%;
	margin: 20px;
}
</style>

<script>
export default {
	props: {
		start: Number,
		end: Number
	},
  data () {
    return {
			currentTime: 0
    }
	},
	watch: {
		currentTime: function(current) {
			if (current < start || current > end) {
				this.$refs.audio.pause();
				this.currentTime = start;
			}
		}
	}
}
</script>
