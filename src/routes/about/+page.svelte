<script lang="ts">
	import { type i18nextType } from '$lib/i18n';
	import type { Writable } from 'svelte/store';
	import { getContext } from 'svelte';
	const i18n = getContext<Writable<i18nextType>>('i18n');
</script>

<div class="content">
	<h1 class="title">Welcome to SvelteKit</h1>
	<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
	<p class="help">{$i18n.t('404')}</p>
	<p>MODE: {import.meta.env.MODE}</p>
</div>
