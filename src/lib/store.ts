import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { api } from './api';
import { Hub } from 'aws-amplify/utils';
import throttle from 'lodash/throttle';
import usersReducer from './store/usersSlice';
import localSettingsReducer from './store/localSettingsSlice';
import authReducer from './store/authSlice';
import { setToken } from './store/authSlice';
import gameReducer from './store/gameSlice';
import { getToken } from './auth';

export type StatusType = 'idle' | 'loading' | 'succeeded' | 'failed';

export const store = configureStore({
	reducer: {
		auth: authReducer,
		users: usersReducer,
		game: gameReducer,
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
store.subscribe(
	throttle(() => {
		const settings = store.getState().localSettings;
		try {
			const serializedState = JSON.stringify(settings);
			localStorage.setItem('localSettings', serializedState);
		} catch {
			// ignore write errors
		}
	}, 1000)
);

// Keep tabs on AWS-Amplify state
Hub.listen('auth', async () => {
	const token = await getToken();
	if (token !== null) {
		store.dispatch(setToken(token));
	} else {
		store.dispatch(setToken(undefined));
	}
});

export default store;
