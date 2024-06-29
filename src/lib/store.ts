import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { api } from './api';
import usersReducer from './store/usersSlice';

export type StatusType = 'idle' | 'loading' | 'succeeded' | 'failed';

export const store = configureStore({
	reducer: {
		users: usersReducer,
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

export default store;
