<template>
	<v-dialog v-model="dialog" fullscreen transition="">
		<v-container fluid fill-height style="background-color: rgba(255, 255, 255, 0.5);">
			<v-layout justify-center align-center>
				<v-progress-circular indeterminate color="primary" />
			</v-layout>
		</v-container>
	</v-dialog>
</template>

<script>
	export default {
		computed: {
			loading: function() {
				return this.$store.state.loading;
			},
			dialog: function() {
				return (this.loading > 0 ? true : false);
			},
		},
	};
</script>
