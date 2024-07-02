import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { api } from './api';
import { Hub } from "aws-amplify/utils";
import { fetchAuthSession } from 'aws-amplify/auth';
import throttle from "lodash/throttle";
import usersReducer from './store/usersSlice';
import localSettingsReducer from "./store/localSettingsSlice";
import authReducer from "./store/authSlice";
import { setToken } from './store/authSlice';

export type StatusType = 'idle' | 'loading' | 'succeeded' | 'failed';

export const store = configureStore({
	reducer: {
        auth: authReducer,
		users: usersReducer,
        localSettings: localSettingsReducer,
		[api.reducerPath]: api.reducer
	},
	middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware)
});

// Get the type of our store variable
export type AppStore = typeof store;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = AppStore['dispatch'];

setupListeners(store.dispatch);

// persist localSettings
store.subscribe(throttle(() => {
    const settings = store.getState().localSettings;
    try {
        const serializedState = JSON.stringify(settings);
        localStorage.setItem('localSettings', serializedState);
    } catch {
        // ignore write errors
    }
}, 1000));

// const handleTokenRefresh = async () => {
//     let token: string|null = null;
//     try {
//         const user = await Auth.currentAuthenticatedUser();
//         token = user.signInUserSession.idToken.jwtToken;
//     } catch {
//         // don't need to do anything if not logged in
//     }
//     if (token !== null) {
//         console.log(`Setting token`);
//         store.dispatch(setToken(token));
//     } else {
//         console.log(`Unsetting token`)
//         store.dispatch(setToken(undefined));
//     }
// }

// Keep tabs on AWS-Amplify state
// Hub.listen("auth", async (data) => {
//     const { payload } = data;
//     console.log(`Received an Amplify event:`, payload);
//     let token: string|null = null;
//     try {
//         const session = await fetchAuthSession();
//         console.log(`Session:`, session);
//         if (session !== undefined && session.tokens !== undefined) {
//             token = session.tokens.accessToken.toString();
//         }
//     } catch {
//         // don't do anything if not logged in
//         console.log(`Could not get an authorized session`);
//     }
//     if (token !== null) {
//         console.log(`Setting token`);
//         store.dispatch(setToken(token));
//     } else {
//         console.log(`Unsetting token`)
//         store.dispatch(setToken(undefined));
//     }
// });

export default store;
