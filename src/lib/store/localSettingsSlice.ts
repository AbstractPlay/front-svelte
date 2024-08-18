// import type { RootState, StatusType } from '$lib/store';
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type Chunk = "status" | "move" | "time" | "board" | "moves" | "chat";
export type ColourContext = {
    background: string;
    strokes: string;
    borders: string;
    labels: string;
    annotations: string;
    fill: string;
};

export type LocalSettings = {
    colorMode: "light" | "dark";
    layout: "vertical" | "horizontal";
    mobileOrder: Chunk[];
    colourContext: {
        light: ColourContext;
        dark: ColourContext;
    };
};

const defaultMobileOrder: Chunk[] = [
    "status",
    "time",
    "move",
    "board",
    "moves",
    "chat",
];
export const defaultContextLight: ColourContext = {
    background: "#fff",
    strokes: "#000",
    borders: "#000",
    labels: "#000",
    annotations: "#000",
    fill: "#000",
};
export const defaultContextDark: ColourContext = {
    background: "#222",
    strokes: "#6d6d6d",
    borders: "#000",
    labels: "#009fbf",
    annotations: "#99cccc",
    fill: "#e6f2f2",
};

export const loadState = (): LocalSettings => {
    try {
        const serializedState = localStorage.getItem("localSettings");
        if (serializedState === null) {
            return {
                colorMode: "light",
                layout: "horizontal",
                mobileOrder: defaultMobileOrder,
                colourContext: {
                    light: defaultContextLight,
                    dark: defaultContextDark,
                },
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
            hydrated.mobileOrder = defaultMobileOrder;
        }
        if (!("colourContext" in hydrated)) {
            hydrated.colourContext = {
                light: defaultContextLight,
                dark: defaultContextDark,
            };
        }
        return hydrated as LocalSettings;
    } catch {
        return {
            colorMode: "light",
            layout: "horizontal",
            mobileOrder: defaultMobileOrder,
            colourContext: {
                light: defaultContextLight,
                dark: defaultContextDark,
            },
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
            const idx = state.mobileOrder.findIndex(
                (s) => s === action.payload
            );
            if (idx !== -1) {
                // if first item, move to end
                if (idx === 0) {
                    state.mobileOrder = [
                        ...state.mobileOrder.slice(1),
                        state.mobileOrder[0],
                    ];
                }
                // otherwise, shift
                else {
                    const left = state.mobileOrder.slice(0, idx - 1);
                    const right = state.mobileOrder.slice(idx + 1);
                    state.mobileOrder = [
                        ...left,
                        state.mobileOrder[idx],
                        state.mobileOrder[idx - 1],
                        ...right,
                    ];
                }
            }
        },
        moveChunkDown: (state, action: PayloadAction<Chunk>) => {
            const idx = state.mobileOrder.findIndex(
                (s) => s === action.payload
            );
            if (idx !== -1) {
                // if last item, move to top
                if (idx === state.mobileOrder.length - 1) {
                    state.mobileOrder = [
                        state.mobileOrder[idx],
                        ...state.mobileOrder.slice(0, idx),
                    ];
                }
                // otherwise, shift
                else {
                    const left = state.mobileOrder.slice(0, idx);
                    const right = state.mobileOrder.slice(idx + 2);
                    state.mobileOrder = [
                        ...left,
                        state.mobileOrder[idx + 1],
                        state.mobileOrder[idx],
                        ...right,
                    ];
                }
            }
        },
        setLightContext: (state, action: PayloadAction<ColourContext>) => {
            state.colourContext = {
                ...state.colourContext,
                light: action.payload,
            };
        },
        setDarkContext: (state, action: PayloadAction<ColourContext>) => {
            state.colourContext = {
                ...state.colourContext,
                dark: action.payload,
            };
        },
    },
});

// Action creators are generated for each case reducer function
export const {
    toggleColorMode,
    toggleLayout,
    moveChunkUp,
    moveChunkDown,
    setLightContext,
    setDarkContext,
} = localSettingsSlice.actions;

export default localSettingsSlice.reducer;
