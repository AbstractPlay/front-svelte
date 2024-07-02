// import type { RootState, StatusType } from '$lib/store';
import { createSlice } from '@reduxjs/toolkit';

export type LocalSettings = {
    colorMode: "light"|"dark";
};

export const loadState = (): LocalSettings => {
    try {
      const serializedState = localStorage.getItem('localSettings');
      if (serializedState === null) {
        return {
            colorMode: "light"
        };
      }
      return JSON.parse(serializedState);
    } catch {
      return {
        colorMode: "light"
      }
    }
};

const initialState = loadState();

export const localSettingsSlice = createSlice({
	name: 'localSettings',
	initialState,
	reducers: {
        toggleColorMode: state => {
            if (state.colorMode === "light") {
                state.colorMode = "dark";
            } else {
                state.colorMode = "light";
            }
        }
    },
});

// Action creators are generated for each case reducer function
export const { toggleColorMode } = localSettingsSlice.actions;

export default localSettingsSlice.reducer;
