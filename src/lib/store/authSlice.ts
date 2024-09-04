import { createSlice } from "@reduxjs/toolkit";

export type AuthData = {
    authToken?: string;
};

const initialState: AuthData = {
    authToken: undefined,
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setToken: (state, action) => {
            state.authToken = action.payload;
        },
    },
});

// Action creators are generated for each case reducer function
export const { setToken } = authSlice.actions;

export default authSlice.reducer;
