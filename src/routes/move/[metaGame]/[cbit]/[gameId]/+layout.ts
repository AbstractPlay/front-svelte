// import { error } from '@sveltejs/kit';
import { api } from "$lib/api.js";
import { getCurrentUser, type AuthUser } from "aws-amplify/auth";

export async function load({ params, parent }) {
	const { store } = await parent();
	let user: AuthUser | undefined;
	try {
		user = await getCurrentUser();
	} catch {
		// no need to catch
	}
	let loggedin = false;
	if (user !== undefined) {
		loggedin = true;
	}
	if (store.getState().game.status === "idle") {
		store.dispatch(
			api.endpoints.getGame.initiate({
				loggedin,
				metaGame: params.metaGame,
				cbit: parseInt(params.cbit, 10) as 0 | 1,
				id: params.gameId
			})
		);
	}
}
