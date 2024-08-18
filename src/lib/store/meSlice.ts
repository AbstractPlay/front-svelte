import type { StatusType } from "$lib/store";
import { createSlice } from "@reduxjs/toolkit";
import { api } from "$lib/api";
import type { MeData } from "../types/backend";

export type MeState = {
    data?: MeData;
    status: StatusType;
    error: string | null;
};

const initialState: MeState = {
    status: "idle",
    error: null,
};

export const meSlice = createSlice({
    name: "me",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addMatcher(api.endpoints.me.matchPending, (state) => {
                state.data = undefined;
                state.status = "loading";
                state.error = null;
            })
            .addMatcher(
                api.endpoints.me.matchRejected,
                (state, { error }) => {
                    state.data = undefined;
                    state.status = "failed";
                    state.error = error.message!;
                }
            )
            .addMatcher(
                api.endpoints.me.matchFulfilled,
                (state, { payload }) => {
                    state.data = payload;
                    state.status = "succeeded";
                    state.error = null;
                }
            );
    },
});

// Action creators are generated for each case reducer function
// export const {  } = usersSlice.actions

export default meSlice.reducer;
