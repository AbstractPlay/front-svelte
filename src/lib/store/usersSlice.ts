import type { RootState, StatusType } from "$lib/store";
import { createSlice } from "@reduxjs/toolkit";
import { api } from "$lib/api";
import type { UserData } from "../types/backend";

export interface UsersState {
	data: UserData[];
	status: StatusType;
	error: string | null;
}

const initialState: UsersState = {
	data: [],
	status: "idle",
	error: null
};

export const usersSlice = createSlice({
	name: "users",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addMatcher(api.endpoints.getUsers.matchPending, (state) => {
				state.data = [];
				state.status = "loading";
				state.error = null;
			})
			.addMatcher(api.endpoints.getUsers.matchRejected, (state, { error }) => {
				state.data = [];
				state.status = "failed";
				state.error = error.message!;
			})
			.addMatcher(api.endpoints.getUsers.matchFulfilled, (state, { payload }) => {
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
