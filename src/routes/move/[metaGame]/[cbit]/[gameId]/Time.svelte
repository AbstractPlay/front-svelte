<script lang="ts">
    import type { Game } from "@/lib/Game";
    import { afterUpdate, onMount } from "svelte";
    import { getContext } from "svelte";
    import type { Writable } from "svelte/store";
    import type { i18nextType } from "@/lib/i18n";
    import type { IStatusReport } from "@abstractplay/gameslib";
    import { renderGlyph } from "@/lib/renderGlyph";
    import type { RootState } from "@/lib/store";
    const i18n = getContext<Writable<i18nextType>>("i18n");
    import SvelteTime from "svelte-time/Time.svelte";

    export let game: Game;
    export let state: RootState;

    let playerNames: string[] = [];
    let lastMoveTime = 0;
    onMount(() => {
        playerNames = game.playerNames(state) as string[];
        if (game.lastmoveTime !== undefined) {
            lastMoveTime = game.lastmoveTime;
        }
    });

    afterUpdate(() => {
        state;
        playerNames;
    });

    const showMilliseconds = (ms: number): string => {
        let positive = true;
        if (ms < 0) {
            ms = -ms;
            positive = false;
        }
        let seconds = ms / 1000;
        const days = Math.floor(seconds / (24 * 3600));
        seconds = seconds % (24 * 3600);
        const hours = Math.round(seconds / 3600);
        seconds = seconds % 3600;
        const minutes = Math.round(seconds / 60);
        seconds = seconds % 60;
        let output = positive ? "" : "-";
        if (days > 0) output += days + "d, ";
        if (days > 0 || hours > 0) output += hours + "h";
        if (days < 1) {
            if (days > 0 || hours > 0) output += ", ";
            if (minutes > 0) output += minutes + "m";
            if (hours < 1) {
                if (minutes > 0) output += ", ";
                output += Math.round(seconds) + "s";
            }
        }
        return output;
    };

    const pingBot = () => {
        alert("pingBot: Still needs to be implemented.");
    };

    const handleTimeOut = () => {
        alert("handleTimeOut: Still needs to be implemented.");
    };
</script>

<table class="table">
    <caption class="tooltipped">
        <span class="smallerText">
            {game.clock.hard
                ? $i18n.t("HardTimeSet")
                : $i18n.t("NotHardTime")},{" "}
            {$i18n.t("Increment", { inc: game.clock.inc })},{" "}
            {$i18n.t("MaxTime", { max: game.clock.max })}
        </span>
    </caption>
    <tbody>
        {#each playerNames as name, index}
            {@const pCanMove = game.playerCanMove(index)}
            {@const remaining = game.clock.remaining[index]}
            <tr class="{pCanMove ? 'tomove' : ''}">
                <td>{name}</td>
                <td
                    >{showMilliseconds(
                        pCanMove
                            ? remaining - (Date.now() - lastMoveTime)
                            : remaining
                    )}</td
                >
            </tr>
        {/each}
    </tbody>
</table>
{#if game.hasBot && state.me.data !== undefined && state.me.data.admin}
    <div class="control">
        <button class="button is-small apButtonNeutral" on:click="{pingBot}">
            Ping Bot
        </button>
    </div>
{/if}
{#if state.me.data !== undefined && game.playerCanClaimTimeout(state.me.data.id)}
    <div class="control">
        <button class="button is-small apButton" on:click="{handleTimeOut}">
            {$i18n.t("ClaimTimeOut")}
        </button>
    </div>
{/if}

<style>
    tr.tomove {
        font-weight: bolder;
    }
</style>
