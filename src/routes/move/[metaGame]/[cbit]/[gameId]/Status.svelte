<script lang="ts">
    import type { Game } from "@/lib/Game";
    import { onMount } from "svelte";
    import { getContext } from "svelte";
    import type { Writable } from "svelte/store";
    import type { i18nextType } from "@/lib/i18n";
    import type { IStatusReport } from "@abstractplay/gameslib";
    const i18n = getContext<Writable<i18nextType>>("i18n");

    export let game: Game;

    let variants: string[] | undefined;
    let statuses: IStatusReport | undefined;
    onMount(() => {
        variants = game.variants;
        statuses = game.statuses;
    });
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
                                                renderGlyph(
                                                    settings,
                                                    v.glyph,
                                                    'genericStatus-' +
                                                        idx +
                                                        '-' +
                                                        vidx,
                                                    v.colour,
                                                    globalMe,
                                                    colourContext
                                                )
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
{/if}

<style>
</style>
