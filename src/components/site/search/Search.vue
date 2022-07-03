<template>
	<div>
		<search-box v-model="searchTerm" @focus="show = true" @blur="hide" />
		<transition name="fade">
			<search-list
				v-if="show"
				:value="searchTerm"
				style="min-width: 192px; max-width: 640px; max-height: 90vh; z-index: 999"
				class="position-absolute top-0 end-0 bg-white"
			/>
		</transition>
	</div>
</template>

<script>
	import SearchBox from './Box.vue';
	import SearchList from './List.vue';
	// import Articles from '~/components/Articles.vue';
	export default {
		components: {SearchBox, SearchList},
		data() {
			return {
				searchTerm: '',
				show: true,
			};
		},
		methods: {
			hide() {
				setTimeout(() => {this.show = false}, 100);
			}
		},
	};
</script>
