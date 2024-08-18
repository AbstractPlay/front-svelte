import type { StatusType } from "$lib/store";
import { createSlice } from "@reduxjs/toolkit";
import { api } from "$lib/api";
import type { FullGame, Comment } from "../types/backend";

export type GameState = {
    data?: FullGame;
    gameComments?: Comment[];
    status: StatusType;
    error: string | null;
};

const initialState: GameState = {
    status: "idle",
    error: null,
};

export const gameSlice = createSlice({
    name: "game",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addMatcher(api.endpoints.getGame.matchPending, (state) => {
                state.data = undefined;
                state.gameComments = undefined;
                state.status = "loading";
                state.error = null;
            })
            .addMatcher(
                api.endpoints.getGame.matchRejected,
                (state, { error }) => {
                    state.data = undefined;
                    state.gameComments = undefined;
                    state.status = "failed";
                    state.error = error.message!;
                }
            )
            .addMatcher(
                api.endpoints.getGame.matchFulfilled,
                (state, { payload }) => {
                    state.data = payload.game;
                    state.gameComments = payload.comments;
                    state.status = "succeeded";
                    state.error = null;
                }
            );
    },
});

// Action creators are generated for each case reducer function
// export const {  } = usersSlice.actions

export default gameSlice.reducer;
