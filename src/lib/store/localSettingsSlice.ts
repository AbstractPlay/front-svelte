// import type { RootState, StatusType } from '$lib/store';
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type Chunk = "status" | "move" | "time" | "board" | "moves" | "chat";

export type LocalSettings = {
	colorMode: "light" | "dark";
	layout: "vertical" | "horizontal";
	mobileOrder: Chunk[];
};

export const loadState = (): LocalSettings => {
	try {
		const serializedState = localStorage.getItem("localSettings");
		if (serializedState === null) {
			return {
				colorMode: "light",
				layout: "horizontal",
				mobileOrder: ["status", "time", "move", "board", "moves", "chat"]
			};
		}
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const hydrated = JSON.parse(serializedState) as any;
		// validate with defaults
		if (!("colorMode" in hydrated)) {
			hydrated.colorMode = "light";
		}
		if (!("layout" in hydrated)) {
			hydrated.layout = "horizontal";
		}
		if (!("mobileOrder" in hydrated)) {
			hydrated.mobileOrder = ["status", "time", "move", "board", "moves", "chat"];
		}
		return hydrated as LocalSettings;
	} catch {
		return {
			colorMode: "light",
			layout: "horizontal",
			mobileOrder: ["status", "time", "move", "board", "moves", "chat"]
		};
	}
};

const initialState = loadState();

export const localSettingsSlice = createSlice({
	name: "localSettings",
	initialState,
	reducers: {
		toggleColorMode: (state) => {
			if (state.colorMode === "light") {
				state.colorMode = "dark";
			} else {
				state.colorMode = "light";
			}
		},
		toggleLayout: (state) => {
			if (state.layout === "horizontal") {
				state.layout = "vertical";
			} else {
				state.layout = "horizontal";
			}
		},
		moveChunkUp: (state, action: PayloadAction<Chunk>) => {
			const idx = state.mobileOrder.findIndex((s) => s === action.payload);
			if (idx !== -1) {
				// if first item, move to end
				if (idx === 0) {
					state.mobileOrder = [...state.mobileOrder.slice(1), state.mobileOrder[0]];
				}
				// otherwise, shift
				else {
					const left = state.mobileOrder.slice(0, idx - 1);
					const right = state.mobileOrder.slice(idx + 1);
					state.mobileOrder = [
						...left,
						state.mobileOrder[idx],
						state.mobileOrder[idx - 1],
						...right
					];
				}
			}
		},
		moveChunkDown: (state, action: PayloadAction<Chunk>) => {
			const idx = state.mobileOrder.findIndex((s) => s === action.payload);
			if (idx !== -1) {
				// if last item, move to top
				if (idx === state.mobileOrder.length - 1) {
					state.mobileOrder = [state.mobileOrder[idx], ...state.mobileOrder.slice(0, idx)];
				}
				// otherwise, shift
				else {
					const left = state.mobileOrder.slice(0, idx);
					const right = state.mobileOrder.slice(idx + 2);
					state.mobileOrder = [
						...left,
						state.mobileOrder[idx + 1],
						state.mobileOrder[idx],
						...right
					];
				}
			}
		}
	}
});

// Action creators are generated for each case reducer function
export const { toggleColorMode, toggleLayout, moveChunkUp, moveChunkDown } =
	localSettingsSlice.actions;

export default localSettingsSlice.reducer;
