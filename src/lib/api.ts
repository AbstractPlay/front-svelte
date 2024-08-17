import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query";
import { getToken } from "./auth";
import type { FullGame, UserData, Comment } from "./types/backend";

type APPostResponse = {
	statusCode: number;
	body: string;
	headers: { [k: string]: string };
};

type GetGameResult = {
	game: FullGame;
	comments: Comment[];
};

export const api = createApi({
	reducerPath: "api",
	baseQuery: fetchBaseQuery({
		baseUrl: import.meta.env.VITE_API_ENDPOINT,
		prepareHeaders: async (headers) => {
			const token = await getToken();
			headers.set("Accept", "application/json");
			headers.set("Content-Type", "application/json");
			if (token !== null) {
				headers.set("Authorization", `Bearer ${token}`);
			}
			return headers;
		}
	}),
	tagTypes: ["Users", "Game"],
	endpoints: (builder) => ({
		getUsers: builder.query<UserData[], void>({
			query: () => ({
				url: import.meta.env.VITE_API_OPEN,
				params: { query: "user_names" },
				responseHandler: "json"
			}),
			providesTags: ["Users"]
		}),
		getGame: builder.query<
			GetGameResult,
			{ loggedin: boolean; metaGame: string; cbit: 0 | 1; id: string }
		>({
			query: ({ loggedin, metaGame, cbit, id }) => ({
				url: loggedin ? import.meta.env.VITE_API_AUTH : import.meta.env.VITE_API_OPEN,
				params: {
					query: loggedin ? undefined : "get_game",
					id: loggedin ? undefined : id,
					metaGame: loggedin ? undefined : metaGame,
					cbit: loggedin ? undefined : cbit
				},
				body: !loggedin
					? undefined
					: {
							query: "get_game",
							pars: {
								id,
								metaGame,
								cbit
							}
						},
				method: loggedin ? "POST" : "GET",
				responseHandler: "json"
			}),
			transformResponse: (response: APPostResponse | GetGameResult) => {
				// eslint-disable-next-line no-prototype-builtins
				if (response.hasOwnProperty("game") && response.hasOwnProperty("comments")) {
					return response;
				} else {
					response = response as APPostResponse;
					if (response.statusCode === 200) {
						return JSON.parse(response.body);
					} else {
						return { error: { status: response.statusCode, data: JSON.parse(response.body) } };
					}
				}
			},
			providesTags: ["Game"]
		})
	})
});
