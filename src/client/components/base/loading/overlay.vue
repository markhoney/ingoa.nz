<template>
	<v-dialog v-model="dialog" fullscreen full-width transition="">
		<v-container fluid fill-height style="background-color: rgba(255, 255, 255, 0.5);">
			<v-layout justify-center align-center>
				<v-progress-circular indeterminate color="primary" />
			</v-layout>
		</v-container>
	</v-dialog>
</template>

<script>
	export default {
		data() {
			return {
				count: 0,
				dialog: false,
			};
		},
		mounted() {
			this.$eventbus.$on('loading', (payload) => {
				this.count += payload;
				this.dialog = (this.count > 0 ? true : false);
			});
		},
	};
</script>
