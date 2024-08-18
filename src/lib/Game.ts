import type { GameState } from "./store/gameSlice";
import { gameinfo, GameFactory } from "@abstractplay/gameslib";
import type {
    APGamesInformation,
    GameBase,
    GameBaseSimultaneous,
    IStatusReport,
} from "@abstractplay/gameslib";
import type { FullGame } from "./types/backend";

export type Parenthetical = {
    name: string;
    link?: string;
};

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
}
