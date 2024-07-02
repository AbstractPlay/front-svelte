import type { RootState, StatusType } from '$lib/store';
import type { AbbrevGame, FullGame } from './gameSlice';
import { createSlice } from '@reduxjs/toolkit';
import { api } from '$lib/api';

export type UserSettings = {
    [k: string]: unknown;
    all?: {
        [k: string]: unknown;
        color?: string;
        annotate?: boolean;
        notifications?: {
            gameStart: boolean;
            gameEnd: boolean;
            challenges: boolean;
            yourturn: boolean;
        }
    }
};

export type Rating = {
    rating: number;
    N: number;
    wins: number;
    draws: number;
}

export type TagList = {
    meta: string;
    tags: string[];
}

export type Palette = {
    name: string;
    colours: string[];
}

export type Player = {
    id: string;
    name: string;
    time?: number;
    settings?: UserSettings;
    draw?: string;
}

  export type FullUser = {
    pk?: string,
    sk?: string,
    id: string;
    name: string;
    email: string;
    gamesUpdate?: number;
    games: AbbrevGame[];
    challenges: {
      issued: string[];
      received: string[];
      accepted: string[];
      standing: string[];
    }
    admin: boolean | undefined;
    language: string;
    country: string;
    lastSeen?: number;
    settings: UserSettings;
    ratings?: {
      [metaGame: string]: Rating
    };
    stars?: string[];
    tags?: TagList[];
    palettes?: Palette[];
    mayPush?: boolean;
}

export type GameState = {
	data?: FullGame;
	status: StatusType;
	error: string | null;
}

const initialState: GameState = {
	status: 'idle',
	error: null
};

export const gameSlice = createSlice({
	name: 'game',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addMatcher(api.endpoints.login.matchPending, (state) => {
				state.data = undefined;
				state.status = 'loading';
				state.error = null;
			})
			.addMatcher(api.endpoints.login.matchRejected, (state, { error }) => {
				state.data = undefined;
				state.status = 'failed';
				state.error = error.message!;
			})
			.addMatcher(api.endpoints.login.matchFulfilled, (state, { payload }) => {
				state.data = payload;
				state.status = 'succeeded';
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
