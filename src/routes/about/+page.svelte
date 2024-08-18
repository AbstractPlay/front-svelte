<script lang="ts">
    import { type i18nextType } from "$lib/i18n";
    import type { Writable } from "svelte/store";
    import type { UsersState } from "$lib/store/usersSlice";
    import { afterUpdate, getContext, onMount } from "svelte";
    const i18n = getContext<Writable<i18nextType>>("i18n");

    export let data;

    let allUsers: UsersState;
    let unsubscribe;
    onMount(() => {
        unsubscribe = data.store.subscribe(() => {
            allUsers = data.store.getState().users;
        });
        return unsubscribe;
    });
    afterUpdate(() => {
        allUsers;
    });
</script>

<div class="content">
    <h1 class="title">Welcome to SvelteKit</h1>
    <p>
        Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation
    </p>
    <p class="help">{$i18n.t("404")}</p>
    <p>MODE: {import.meta.env.MODE}</p>
    {#if allUsers !== undefined}
        <p>
            Number of users:
            {#if allUsers.status === "loading"}
                loading...
            {:else if allUsers.status === "failed"}
                loading failed ({allUsers.error})
            {:else}
                {allUsers.data.length}
            {/if}
        </p>
    {/if}
</div>
