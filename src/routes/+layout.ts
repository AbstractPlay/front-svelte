import { redirect } from '@sveltejs/kit';

export const ssr = false;
export const prerender = false;

export function load({ route }) {
	if (route.id === '/') {
		redirect(302, '/about');
	}
}
