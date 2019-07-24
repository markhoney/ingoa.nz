//import Vue from 'vue';

export const state = () => ({
	drawer: false,
	loading: 0,
});

export const mutations = {
	drawerToggle(state) {
		state.drawer = !state.drawer;
	},
	drawerSet(state, v) {
		state.drawer = v;
	},
	loading(state, v) {
		state.loading += v;
	},
};
