import type { RootState } from "./store";
import { getSetting } from "./store/meSlice";
import type { UserSettings } from "./types/backend";
import { renderglyph, type IRenderOptions } from "@abstractplay/renderer";

export const renderGlyph = (opts: {
    state: RootState;
    glyph: string;
    colour: number | string;
    id: string;
    gameSettings?: UserSettings;
    metaGame: string;
}): string => {
    const { state, glyph, colour, id, gameSettings, metaGame } = opts;
    const options: IRenderOptions = {
        svgid: id,
        colourContext:
            state.localSettings.colourContext[state.localSettings.colorMode],
    };
    if (state.me.data !== undefined) {
        const colourMode = getSetting(state, "color", {
            default: "standard",
            gameSettings,
            metaGame,
        });
        if (colourMode === "blind") {
            options.colourBlind = true;
        } else if (
            colourMode !== "blind" &&
            colourMode !== "standard" &&
            state.me.data.palettes !== undefined
        ) {
            const palette = state.me.data.palettes.find(
                (p) => p.name === colourMode
            );
            if (palette !== undefined) {
                options.colours = [...palette.colours];
                while (options.colours.length < 10) {
                    options.colours.push("#fff");
                }
            }
        }
    }
    return renderglyph(glyph, colour, options);
};
