import type { RootState, StatusType } from '$lib/store';
import type { Player } from './meSlice';
import { createSlice } from '@reduxjs/toolkit';
import { api } from '$lib/api';

export type AbbrevGame = {
    pk?: string,
    sk?: string,
    id : string;
    metaGame: string;
    players: Player[];
    lastMoveTime: number;
    clockHard: boolean;
    noExplore?: boolean;
    toMove: string | boolean[];
    note?: string;
    seen?: number;
    winner?: number[];
    numMoves?: number;
    gameStarted?: number;
    gameEnded?: number;
    lastChat?: number;
    variants?: string[];
}

export type FullGame = {
    pk: string;
    sk: string;
    id: string;
    clockHard: boolean;
    clockInc: number;
    clockMax: number;
    clockStart: number;
    gameStarted: number;
    gameEnded?: number;
    lastMoveTime: number;
    metaGame: string;
    numPlayers: number;
    players: Player[];
    state: string;
    note?: string;
    toMove: string | boolean[];
    partialMove?: string;
    winner?: number[];
    numMoves?: number;
    rated?: boolean;
    pieInvoked?: boolean;
    variants?: string[];
    published?: string[];
    tournament?: string;
    division?: number;
    noExplore?: boolean;
}

export type Comment = {
    comment: string;
    userId: string;
    moveNumber: number;
    timeStamp: number;
}

export interface GameState {
	data?: FullGame;
    comments?: Comment[];
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
			.addMatcher(api.endpoints.getGame.matchPending, (state) => {
				state.data = undefined;
                state.comments = undefined;
				state.status = 'loading';
				state.error = null;
			})
			.addMatcher(api.endpoints.getGame.matchRejected, (state, { error }) => {
				state.data = undefined;
                state.comments = undefined;
				state.status = 'failed';
				state.error = error.message!;
			})
			.addMatcher(api.endpoints.getGame.matchFulfilled, (state, { payload }) => {
				state.data = payload.game;
				state.comments = payload.comments;
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
