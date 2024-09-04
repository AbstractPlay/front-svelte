import type { RootState, StatusType } from "$lib/store";
import { createSlice } from "@reduxjs/toolkit";
import { api } from "$lib/api";
import type { MeData, UserSettings } from "../types/backend";

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
            .addMatcher(api.endpoints.me.matchRejected, (state, { error }) => {
                state.data = undefined;
                state.status = "failed";
                state.error = error.message!;
            })
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

export const getSetting = (
    state: RootState,
    setting: string,
    opts: { default?: string; gameSettings?: UserSettings; metaGame: string }
) => {
    if (
        opts.gameSettings !== undefined &&
        opts.gameSettings[setting] !== undefined
    ) {
        return opts.gameSettings[setting];
    } else if (state.me.data !== undefined) {
        if (
            state.me.data.settings[opts.metaGame] !== undefined &&
            (state.me.data.settings[opts.metaGame] as { [k: string]: unknown })[
                setting
            ] !== undefined
        ) {
            return (
                state.me.data.settings[opts.metaGame] as {
                    [k: string]: unknown;
                }
            )[setting];
        } else if (
            state.me.data.settings.all !== undefined &&
            state.me.data.settings.all[setting] !== undefined
        ) {
            return state.me.data.settings.all[setting];
        } else {
            return opts.default;
        }
    } else {
        return opts.default;
    }
};
