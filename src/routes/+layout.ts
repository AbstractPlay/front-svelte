import { redirect } from '@sveltejs/kit';
import store from '$lib/store';
import { api } from '$lib/api.js';

export const ssr = false;
export const prerender = false;

export function load({ route }) {
	if (route.id === '/') {
		redirect(302, '/about');
	}
	if (store.getState().users.status === 'idle') {
		store.dispatch(api.endpoints.getUsers.initiate());
	}
	return {
		store
	};
}
