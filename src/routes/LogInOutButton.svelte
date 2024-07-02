<script lang="ts">
    import { type i18nextType } from '$lib/i18n';
	import type { Writable } from 'svelte/store';
    import { afterUpdate, getContext } from "svelte";
	const i18n = getContext<Writable<i18nextType>>('i18n');
    import { signInWithRedirect } from "aws-amplify/auth";
	import { getToken } from '$lib/auth';

    let token: string|null = null;
    afterUpdate(async () => {
        token = await getToken();
    });
</script>

{#if token === null}
    <button
        class="button is-small apButton"
        on:click={() => signInWithRedirect()}
        id="login-button"
    >
        {$i18n.t("LogIn")}
    </button>
{:else}
    <p>Logged in</p>
{/if}