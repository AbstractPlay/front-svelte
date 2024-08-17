import type { RootState, StatusType } from "$lib/store";
import { createSlice } from "@reduxjs/toolkit";
import { api } from "$lib/api";
import type { FullGame } from "../types/backend";

export type GameState = {
	data?: FullGame;
	status: StatusType;
	error: string | null;
};

const initialState: GameState = {
	status: "idle",
	error: null
};

export const gameSlice = createSlice({
	name: "game",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addMatcher(api.endpoints.login.matchPending, (state) => {
				state.data = undefined;
				state.status = "loading";
				state.error = null;
			})
			.addMatcher(api.endpoints.login.matchRejected, (state, { error }) => {
				state.data = undefined;
				state.status = "failed";
				state.error = error.message!;
			})
			.addMatcher(api.endpoints.login.matchFulfilled, (state, { payload }) => {
				state.data = payload;
				state.status = "succeeded";
				state.error = null;
			});
	}
});

// Action creators are generated for each case reducer function
// export const {  } = usersSlice.actions

export default usersSlice.reducer;

export const selectAllUsers = (state: RootState) => state.users.data;

export const selectUserById = (state: RootState, uid: string) =>
	state.users.data.find((u) => u.id === uid);
