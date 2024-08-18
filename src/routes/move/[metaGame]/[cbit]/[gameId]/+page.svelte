<script lang="ts">
    import { Game } from "@/lib/Game";
    import type { LocalSettings } from "@/lib/store/localSettingsSlice.js";
    import { afterUpdate, onMount } from "svelte";
    import Skeleton from "./Skeleton.svelte";
    import type { GameState } from "@/lib/store/gameSlice";
    import store from "@/lib/store";

    export let data;

    let unsubscribe;
    let gameRef: Game;
    let localSettings: LocalSettings;
    let dbGame: GameState;
    onMount(() => {
        unsubscribe = data.store.subscribe(() => {
            dbGame = data.store.getState().game;
            localSettings = data.store.getState().localSettings;
        });
        return unsubscribe;
    });
    afterUpdate(() => {
        dbGame;
        localSettings;
    });

    $: if (dbGame !== undefined && dbGame.status === "succeeded") {
        gameRef = new Game({ game: dbGame });
    }
</script>

{#if gameRef === undefined || gameRef.status === "loading" || gameRef.status === "idle"}
    <p>Loading...</p>
{:else if gameRef.status === "failed"}
    <p>Could not load the requested game.</p>
{:else}
    <Skeleton {localSettings} game="{gameRef}" dispatch="{store.dispatch}" />
{/if}
