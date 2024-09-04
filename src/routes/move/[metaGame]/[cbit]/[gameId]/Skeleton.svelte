<script lang="ts">
    import type { Game } from "@/lib/Game";
    import type { i18nextType } from "@/lib/i18n";
    import type { AppDispatch, RootState } from "@/lib/store";
    import type { LocalSettings, Chunk } from "@/lib/store/localSettingsSlice";
    import { moveChunkUp, moveChunkDown } from "@/lib/store/localSettingsSlice";
    import { getContext, onMount } from "svelte";
    import type { Writable } from "svelte/store";
    const i18n = getContext<Writable<i18nextType>>("i18n");
    import Status from "./Status.svelte";

    export let state: RootState;
    export let game: Game;
    export let dispatch: AppDispatch;

    let screenWidth: number;
    const chunk2title = new Map<Chunk, string>([
        ["chat", "GameSummary"],
        ["move", "MakeMove"],
        ["moves", "Moves"],
        ["status", "Status"],
        ["time", "TimeRemaining"],
    ]);
</script>

<article bind:clientWidth="{screenWidth}">
    {#if screenWidth < 770 || state.localSettings.layout === "vertical"}
        {#each state.localSettings.mobileOrder as chunk}
            {#if chunk !== "status" || game.hasStatuses}
                <div class="botPadding">
                    <div class="card">
                        <header class="card-header">
                            <p class="card-header-title">
                                {#if chunk === "board"}
                                    <span>
                                        <a href="{`/games/${game.metaGame}`}">
                                            {game.displayName}
                                        </a>
                                        {#if game.parentheticals.length > 0}
                                            &nbsp;<span class="parentheticals"
                                                >(
                                                {#each game.parentheticals as p, i}
                                                    {#if p.link !== undefined}
                                                        <a href="{p.link}"
                                                            >{p.name}</a
                                                        >
                                                    {:else}
                                                        {p.name}
                                                    {/if}
                                                    {#if i < game.parentheticals.length - 1}
                                                        ,&nbsp;
                                                    {/if}
                                                {/each}
                                                )</span
                                            >
                                        {/if}
                                    </span>
                                {:else}
                                    {$i18n.t(chunk2title.get(chunk) || "")}
                                {/if}
                                <button
                                    class="card-header-icon"
                                    aria-label="move up"
                                    title="move up"
                                    on:click="{() =>
                                        dispatch(moveChunkUp(chunk))}"
                                >
                                    <span class="icon">
                                        <i
                                            class="fa fa-angle-up"
                                            aria-hidden="true"
                                        ></i>
                                    </span>
                                </button>
                                <button
                                    class="card-header-icon"
                                    aria-label="move down"
                                    title="move down"
                                    on:click="{() =>
                                        dispatch(moveChunkDown(chunk))}"
                                >
                                    <span class="icon">
                                        <i
                                            class="fa fa-angle-down"
                                            aria-hidden="true"
                                        ></i>
                                    </span>
                                </button>
                            </p>
                        </header>
                        <div class="card-content">
                            {#if chunk === "status"}
                                <Status {game} {state} />
                            {:else if chunk === "move"}
                                <p>Move</p>
                                <p>Misc. Buttons</p>
                            {:else if chunk === "board"}
                                <p>Board</p>
                            {:else if chunk === "moves"}
                                <p>Move tree</p>
                            {:else if chunk === "chat"}
                                <p>Chat</p>
                            {:else if chunk === "time"}
                                <p>Time remaining</p>
                            {/if}
                        </div>
                    </div>
                </div>
            {/if}
        {/each}
    {:else}
        <!-- Normal, full-width layout -->
        <div class="columns">
            <div class="column is-one-fifth">
                {#if game.hasStatuses}
                    <div class="bottomMargin">
                        <h1 class="subtitle lined">
                            <span>{$i18n.t("Status")}</span>
                        </h1>
                        <Status {state} {game} />
                    </div>
                {/if}
                <div>
                    <h1 class="subtitle lined">
                        <span>{$i18n.t("TimeRemaining")}</span>
                    </h1>
                    <!-- Time entry component -->
                </div>
                <div>
                    <h1 class="subtitle lined">
                        <span>{$i18n.t("MakeMove")}</span>
                    </h1>
                    <!-- MoveEntry component -->
                </div>
                <!-- Misc Buttons component -->
            </div>
            <!-- /column -->
            <!-- Board -->
            <div class="column">
                <h1 class="subtitle lined">
                    <span>
                        <a href="{`/games/${game.metaGame}`}">
                            {game.displayName}
                        </a>
                        {#if game.parentheticals.length > 0}
                            &nbsp;<span class="parentheticals"
                                >(
                                {#each game.parentheticals as p, i}
                                    {#if p.link !== undefined}
                                        <a href="{p.link}">{p.name}</a>
                                    {:else}
                                        {p.name}
                                    {/if}
                                    {#if i < game.parentheticals.length - 1}
                                        ,&nbsp;
                                    {/if}
                                {/each}
                                )</span
                            >
                        {/if}
                    </span>
                </h1>
                <!-- Board component -->
            </div>
            <!-- /column -->
            <!-- Game Moves -->
            <div class="column is-narrow" style="max-width: 15vw;">
                <div>
                    <h1 class="subtitle lined">
                        <span>{$i18n.t("Moves")}</span>
                    </h1>
                    <!-- GameMoves component -->
                </div>
                <div class="topPadding">
                    <h1 class="subtitle lined">
                        <span>{$i18n.t("GameSummary")}</span>
                    </h1>
                    <!-- UserChats component -->
                </div>
            </div>
        </div>
    {/if}

    <!-- Full game/chat log -->
    <div class="columns">
        <div
            class="column is-three-fifths is-offset-one-fifth"
            id="fullChatLog"
        >
            <div>
                <h1 class="subtitle lined">
                    <span>{$i18n.t("GameSummary")}</span>
                </h1>
                <!-- MoveResults component -->
            </div>
        </div>
    </div>
</article>

<style>
    div.bottomMargin {
        margin-bottom: 2em;
    }
    div.topPadding {
        padding-top: 1em;
    }
    div.botPadding {
        padding-bottom: 1em;
    }
    span.parentheticals {
        font-size: smaller;
        padding: 0;
        margin: 0;
    }
</style>
