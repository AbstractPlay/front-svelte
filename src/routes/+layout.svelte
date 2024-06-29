<script lang="ts">
	import '../myBulma.css';
	import '../app.css';
	import getI18nStore from '$lib/i18n';
	import { setContext } from 'svelte';

	setContext('i18n', getI18nStore());
	let title = 'Abstract Play';
	if (import.meta.env.MODE === 'development') {
		title = 'Abstract Play - DEV';
	}
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<slot />
