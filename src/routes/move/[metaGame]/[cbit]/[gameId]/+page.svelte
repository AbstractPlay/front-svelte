<script lang="ts">
	import type { GameState } from '@/lib/store/gameSlice';
	import { afterUpdate, onMount } from 'svelte';

	export let data;

	let unsubscribe;
	let dbGame: GameState;
	onMount(() => {
		unsubscribe = data.store.subscribe(() => {
			dbGame = data.store.getState().game;
		});
		return unsubscribe;
	});
	afterUpdate(() => {
		dbGame;
	});
</script>

{#if dbGame === undefined || dbGame.status === 'loading' || dbGame.status === 'idle'}
	<p>Loading...</p>
{:else if dbGame.status === 'failed'}
	<p>Could not load the requested game.</p>
{:else}
	<pre>
{JSON.stringify(dbGame, null, 2)}
    </pre>
{/if}
