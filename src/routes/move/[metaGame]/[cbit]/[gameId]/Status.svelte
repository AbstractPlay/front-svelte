<script lang="ts">
    import type { Game } from "@/lib/Game";
    import { onMount } from "svelte";
    import { getContext } from "svelte";
    import type { Writable } from "svelte/store";
    import type { i18nextType } from "@/lib/i18n";
    import type { IStatusReport } from "@abstractplay/gameslib";
    import { renderGlyph } from "@/lib/renderGlyph";
    import type { RootState } from "@/lib/store";
    import { isArray } from "lodash";
    const i18n = getContext<Writable<i18nextType>>("i18n");

    export let game: Game;
    export let state: RootState;

    let variants: string[] | undefined;
    let statuses: IStatusReport | undefined;
    onMount(() => {
        variants = game.variants;
        statuses = game.statuses;
    });

    let swatches: { isImage: boolean; value: string }[] = [];
    $: if (state !== undefined && game !== undefined) {
        swatches = game.swatches(state);
    }

    const handleStashClick = (
        movePart: string,
        handler?: (move: string, movePart: string) => string
    ) => {
        if (handler !== undefined) {
            console.log(
                `Stash click with handler gave the following: ${handler("", movePart)}`
            );
        } else {
            console.log(`Stash click gave the following: ${movePart}`);
        }
    };
</script>

<!-- Variants at the top -->
{#if variants !== undefined && variants.length > 0}
    <p>
        {$i18n.t("Variant", { count: variants.length })}: {variants.join(", ")}
    </p>
{/if}

{#if statuses !== undefined}
    {#if statuses.statuses.length > 0}
        <table class="table">
            <tbody>
                {#each statuses.statuses as status, idx}
                    <tr>
                        <td>{status.key}</td>
                        <td>
                            {#each status.value as v, vidx}
                                <span>
                                    {#if typeof v === "string"}
                                        {v}
                                    {:else}
                                        <img
                                            class="playerImage"
                                            src="{`data:image/svg+xml;utf8,${encodeURIComponent(
                                                renderGlyph({
                                                    state,
                                                    glyph: v.name,
                                                    colour: v.colour,
                                                    id: `genericStatus-${idx}-${vidx}`,
                                                })
                                            )}`}"
                                            alt="{'color ' + v.colour}"
                                        />
                                    {/if}
                                </span>
                            {/each}
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    {/if}
    {#if statuses.scores.length > 0}
        {#each statuses.scores as scoreset}
            <div class="scorediv">
                <h2>{scoreset.name}</h2>
                <table class="table">
                    <tbody>
                        {#each scoreset.scores as score, idx}
                            <tr>
                                <td>
                                    <span>
                                        {#if swatches.length > idx && !swatches[idx].isImage}
                                            {swatches[idx].value}
                                        {:else if swatches.length > idx}
                                            <img
                                                class="playerImage"
                                                src="{`data:image/svg+xml;utf8,${encodeURIComponent(swatches[idx].value)}`}"
                                                alt="{`swatch for player ${idx + 1}`}"
                                            />
                                        {/if}
                                    </span>&nbsp;
                                    {game.playerNames(state, idx)}
                                </td>
                                <td>
                                    {score}
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        {/each}
    {/if}
    {#if statuses.stashes.length > 0}
        <div class="scorediv">
            <h2>{$i18n.t("Stash")}</h2>
            <table class="table">
                <tbody>
                    {#each statuses.stashes as stashset, idx}
                        {#if stashset !== null}
                            {#if Array.isArray(stashset)}
                                <tr>
                                    <td>
                                        <span>
                                            {#if swatches.length > idx && !swatches[idx].isImage}
                                                {swatches[idx].value}
                                            {:else if swatches.length > idx}
                                                <img
                                                    class="playerImage"
                                                    src="{`data:image/svg+xml;utf8,${encodeURIComponent(swatches[idx].value)}`}"
                                                    alt="{`swatch for player ${idx + 1}`}"
                                                />
                                            {/if}
                                        </span>&nbsp;
                                        {game.playerNames(state, idx)}
                                    </td>
                                    {#each stashset as entry, eidx}
                                        <td
                                            on:click="{() =>
                                                handleStashClick(
                                                    entry.movePart
                                                )}"
                                        >
                                            {entry.count}&#215;
                                            <img
                                                class="playerImage"
                                                src="{`data:image/svg+xml;utf8,${encodeURIComponent(renderGlyph({ state, glyph: entry.glyph.name, colour: entry.glyph.colour, id: `stack-${idx}-${eidx}`, metaGame: game.metaGame, gameSettings: game.playerSettings(idx) }))}`}"
                                                alt=""
                                            />
                                        </td>
                                    {/each}
                                </tr>
                            {:else}
                                <tr>
                                    <td>
                                        <span>
                                            {#if swatches.length > idx && !swatches[idx].isImage}
                                                {swatches[idx].value}
                                            {:else if swatches.length > idx}
                                                <img
                                                    class="playerImage"
                                                    src="{`data:image/svg+xml;utf8,${encodeURIComponent(swatches[idx].value)}`}"
                                                    alt="{`swatch for player ${idx + 1}`}"
                                                />
                                            {/if}
                                        </span>&nbsp;
                                        {game.playerNames(state, idx)}
                                    </td>
                                    {#each stashset.stash as entry, eidx}
                                        <td
                                            on:click="{() =>
                                                handleStashClick(
                                                    entry.movePart,
                                                    stashset.handler
                                                )}"
                                        >
                                            {entry.count}&#215;
                                            <img
                                                class="playerImage"
                                                src="{`data:image/svg+xml;utf8,${encodeURIComponent(renderGlyph({ state, glyph: entry.glyph.name, colour: entry.glyph.colour, id: `stack-${idx}-${eidx}`, metaGame: game.metaGame, gameSettings: game.playerSettings(idx) }))}`}"
                                                alt=""
                                            />
                                        </td>
                                    {/each}
                                </tr>
                            {/if}
                        {/if}
                    {/each}
                </tbody>
            </table>
        </div>
    {/if}
{/if}

<style>
    div.scorediv {
        overflow-x: scroll;
        scrollbar-width: thin;
    }
</style>
