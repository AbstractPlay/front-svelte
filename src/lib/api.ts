import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query';
import type { UserData } from './store/usersSlice';

export const api = createApi({
	reducerPath: 'api',
	baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_ENDPOINT }),
	tagTypes: ['Users'],
	endpoints: (builder) => ({
		getUsers: builder.query<UserData[], void>({
			query: () => ({
				url: import.meta.env.VITE_API_OPEN,
				params: { query: 'user_names' },
				responseHandler: 'json'
			}),
			providesTags: ['Users']
		}),
	})
});
