import type { GameState } from "./store/gameSlice";
import { gameinfo, GameFactory } from "@abstractplay/gameslib";
import type {
    APGamesInformation,
    GameBase,
    GameBaseSimultaneous,
    IStatusReport,
} from "@abstractplay/gameslib";
import type { FullGame, UserSettings } from "./types/backend";
import type { RootState } from "./store";
import { renderGlyph } from "./renderGlyph";
import { selectUserById } from "./store/usersSlice";

export type Parenthetical = {
    name: string;
    link?: string;
};

interface GameWithCustomColours extends GameBase {
    getPlayerColour: (n: number) => number | string;
}

export class Game {
    private readonly _gameState: GameState;
    private readonly _metadata: APGamesInformation | undefined;
    private readonly _engine: GameBase | GameBaseSimultaneous | undefined;

    constructor(opts: { game: GameState }) {
        this._gameState = opts.game;
        if (this._gameState.data !== undefined) {
            this._metadata = gameinfo.get(this._gameState.data.metaGame);
            this._engine = GameFactory(
                this._gameState.data.metaGame,
                this._gameState.data.state
            );
        }
    }

    get status(): "loading" | "idle" | "failed" | "succeeded" | undefined {
        return this._gameState?.status;
    }
    get rawState(): FullGame | undefined {
        return this._gameState.data;
    }
    get metaGame(): string | undefined {
        return this._gameState.data?.metaGame;
    }
    get displayName(): string | undefined {
        return this._metadata?.name;
    }
    get statuses(): IStatusReport | undefined {
        return this._engine?.statuses();
    }
    get hasStatuses(): boolean {
        if (this._engine !== undefined) {
            if (this._engine.variants.length > 0) {
                return true;
            }
            const report = this._engine.statuses();
            if (
                report.scores.length === 0 &&
                report.stashes.length === 0 &&
                report.statuses.length === 0
            ) {
                return false;
            } else {
                return true;
            }
        } else {
            return false;
        }
    }
    get parentheticals(): Parenthetical[] {
        const lst: Parenthetical[] = [];

        if (this._gameState.data !== undefined) {
            // automated tournament
            if (this._gameState.data.tournament !== undefined) {
                lst.push({
                    name: "tournament",
                    link: `/tournament/${this._gameState.data.tournament}`,
                });
            }
            // organized event
            if (this._gameState.data.event !== undefined) {
                lst.push({
                    name: "event",
                    link: `/event/${this._gameState.data.event}`,
                });
            }
            // unrated
            if (this._gameState.data.rated === false) {
                lst.push({ name: "unrated" });
            }
            // exploration disabled
            if (this._gameState.data.noExplore === true) {
                lst.push({ name: "exploration disabled" });
            }
        }

        return lst;
    }
    get variants(): string[] | undefined {
        return this._engine?.getVariants();
    }
    get seatNames(): string[] | undefined {
        if (this._gameState.data !== undefined) {
            const names: string[] = [];
            if (
                this._engine !== undefined &&
                "player2seat" in this._engine &&
                typeof this._engine.player2seat === "function"
            ) {
                for (let i = 1; i <= this._gameState.data.numPlayers; i++) {
                    names.push(this._engine.player2seat(i));
                }
            } else {
                for (let i = 1; i <= this._gameState.data.numPlayers; i++) {
                    names.push(`P${i}`);
                }
            }
            return names;
        } else {
            return undefined;
        }
    }

    public swatches(state: RootState): { isImage: boolean; value: string }[] {
        if (this._engine !== undefined && this._gameState.data !== undefined) {
            if (this._engine.hasFlag("shared-pieces")) {
                return this.seatNames!.map((n) => {
                    return { isImage: false, value: n };
                });
            } else {
                const lst: { isImage: boolean; value: string }[] = [];
                for (let i = 1; i <= this._gameState.data.numPlayers; i++) {
                    let pnum: number | string = i;
                    if (this._engine.hasFlag("custom-colours")) {
                        pnum = (
                            this._engine as GameWithCustomColours
                        ).getPlayerColour(i);
                    }
                    lst.push({
                        isImage: true,
                        value: renderGlyph({
                            state,
                            glyph: "piece",
                            colour: pnum,
                            id: `player${i}colour`,
                            metaGame: this.metaGame!,
                            gameSettings:
                                this._gameState.data.players[i - 1].settings,
                        }),
                    });
                }
                return lst;
            }
        } else {
            return [];
        }
    }

    public playerNames(
        state: RootState,
        n?: number
    ): string | undefined | (string | undefined)[] {
        if (this._gameState.data === undefined) {
            return undefined;
        }
        const names = this._gameState.data?.players
            .map((user) => selectUserById(state, user.id))
            .map((user) => user?.name);
        if (n === undefined) {
            return names;
        } else {
            return names[n];
        }
    }

    public playerSettings(n: number): UserSettings | undefined {
        if (this._gameState.data !== undefined) {
            return this._gameState.data.players[n].settings;
        }
        return undefined;
    }
}
