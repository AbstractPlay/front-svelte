type MetaGameCounts = {
    [metaGame: string]: {
        currentgames: number;
        completedgames: number;
        standingchallenges: number;
        ratings?: Set<string>;
        stars?: number;
        tags?: string[];
    };
};

type Challenge = {
    metaGame: string;
    standing?: boolean;
    challenger: User;
    players: User[];
    challengees?: User[];
};

type FullChallenge = {
    pk?: string;
    sk?: string;
    metaGame: string;
    numPlayers: number;
    standing?: boolean;
    duration?: number;
    seating: string;
    variants: string[];
    challenger: User;
    challengees?: User[]; // players who were challenged
    players?: User[]; // players that have accepted
    clockStart: number;
    clockInc: number;
    clockMax: number;
    clockHard: boolean;
    rated: boolean;
    noExplore?: boolean;
    comment?: string;
};

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
        };
    };
};

export type UserLastSeen = {
    id: string;
    name: string;
    lastSeen?: number;
};

export type User = {
    id: string;
    name: string;
    time?: number;
    settings?: UserSettings;
    draw?: string;
};

type FullUser = {
    pk?: string;
    sk?: string;
    id: string;
    name: string;
    email: string;
    gamesUpdate?: number;
    games: Game[];
    challenges: {
        issued: string[];
        received: string[];
        accepted: string[];
        standing: string[];
    };
    admin: boolean | undefined;
    organizer: boolean | undefined;
    language: string;
    country: string;
    lastSeen?: number;
    settings: UserSettings;
    ratings?: {
        [metaGame: string]: Rating;
    };
    stars?: string[];
    tags?: TagList[];
    palettes?: Palette[];
    mayPush?: boolean;
};

type MeData = {
    id: string;
    name: string;
    admin: boolean;
    organizer: boolean;
    language: string;
    country: string;
    games: Game[];
    settings: UserSettings;
    stars: string[];
    tags?: TagList[];
    palettes?: Palette[];
    mayPush: boolean;
    challengesIssued?: FullChallenge[];
    challengesReceived?: FullChallenge[];
    challengesAccepted?: FullChallenge[];
    standingChallenges?: FullChallenge[];
};

export type UserData = {
    id: string;
    name: string;
    country: string;
    lastseen: number;
    stars: string[];
};

type Rating = {
    rating: number;
    N: number;
    wins: number;
    draws: number;
};

type Note = {
    pk: string;
    sk: string;
    note: string;
};

type Game = {
    pk?: string;
    sk?: string;
    id: string;
    metaGame: string;
    players: User[];
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
};

type FullGame = {
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
    players: User[];
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
    smevent?: string;
    smeventRound?: number;
    tournament?: string;
    event?: string;
    division?: number;
    noExplore?: boolean;
};

type Playground = {
    pk: "PLAYGROUND";
    sk: string;
    metaGame: string;
    state: string;
};

type Comment = {
    comment: string;
    userId: string;
    moveNumber: number;
    timeStamp: number;
};

type PushCredentials = {
    pk: string;
    sk: string;
    payload: unknown;
};

type PushOptions = {
    userId: string;
    title: string;
    body: string;
    topic:
        | "yourturn"
        | "ended"
        | "started"
        | "challenges"
        | "test"
        | "tournament";
    url?: string; //relative url of target page, if appropriate
};

type Exploration = {
    version?: number;
    id: string;
    move: number;
    comment: string;
    children: Exploration[];
    outcome?: number; // Optional. 0 for player1 win, 1 for player2 win, -1 for undecided.
};

type Division = {
    numGames: number;
    numCompleted: number;
    processed: boolean;
    winnerid?: string;
    winner?: string;
};

type Tournament = {
    pk: string;
    sk: string;
    id: string;
    metaGame: string;
    variants: string[];
    number: number;
    started: boolean;
    dateCreated: number;
    datePreviousEnded: number; // 0 means either the first tournament or a restart of the series (after it stopped because not enough participants), 3000000000000 means previous tournament still running.
    nextid?: string;
    dateStarted?: number;
    dateEnded?: number;
    divisions?: {
        [division: number]: Division;
    };
    players?: TournamentPlayer[]; // only on archived tournaments
    waiting?: boolean; // tournament does not yet have 4 players
};

type TournamentPlayer = {
    pk: string;
    sk: string;
    playerid: string;
    playername: string;
    division?: number;
    score?: number;
    tiebreak?: number;
    rating?: number;
    timeout?: boolean;
};

type TournamentGame = {
    pk: string;
    sk: string;
    gameid: string;
    player1: string;
    player2: string;
    winner?: string[];
};

type OrgEvent = {
    pk: "ORGEVENT";
    sk: string; // <eventid>
    name: string;
    description: string;
    organizer: string;
    dateStart: number;
    dateEnd?: number;
    winner?: string[];
    visible: boolean;
};

type OrgEventGame = {
    pk: "ORGEVENTGAME";
    sk: string; // <eventid>#<gameid>
    metaGame: string;
    variants?: string[];
    round: number;
    gameid: string;
    player1: string;
    player2: string;
    winner?: string[];
    arbitrated?: boolean;
};

type OrgEventPlayer = {
    pk: "ORGEVENTPLAYER";
    sk: string; // <eventid>#<playerid>
    playerid: string;
    division?: number;
    seed?: number;
};

type TagList = {
    meta: string;
    tags: string[];
};

type TagRec = {
    pk: "TAG";
    sk: string;
    tags: TagList[];
};

type Palette = {
    name: string;
    colours: string[];
};

type PaletteRec = {
    pk: "PALETTES";
    sk: string;
    palettes: Palette[];
};

type PairingPlayer = {
    id: string;
    name: string;
    country: string;
    stars: string[];
    lastSeen: number;
};

type Pairing = {
    round: number;
    metagame: string;
    variants: string[];
    clockStart: number;
    clockInc: number;
    clockMax: number;
    p1: PairingPlayer;
    p2: PairingPlayer;
};
