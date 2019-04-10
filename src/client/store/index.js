//import Vue from 'vue';

export const state = () => ({
	drawer: false,
});

export const mutations = {
	toggleDrawer(state) {
		state.drawer = !state.drawer;
	},
	setDrawer(state, v) {
		state.drawer = v;
	},
};

export const actions = {
};

export const getters = {
};
