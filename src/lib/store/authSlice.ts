import { createSlice } from "@reduxjs/toolkit";
import { getToken } from "../auth";

export type AuthData = {
    authToken?: string;
};

const token = await getToken();
const initialState: AuthData = {
    authToken: token !== null ? token : undefined,
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
