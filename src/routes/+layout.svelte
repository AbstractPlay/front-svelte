<script lang="ts">
	import "@/myBulma.css";
	import "@/app.css";
	import getI18nStore from "$lib/i18n";
	import { afterUpdate, setContext, onMount } from "svelte";
	import Navbar from "./Navbar.svelte";

	export let data;

	setContext("i18n", getI18nStore());
	let title = "Abstract Play";
	if (import.meta.env.MODE === "development") {
		title = "Abstract Play - DEV";
	}

	let colorMode: "light" | "dark";
	let unsubscribe;
	onMount(() => {
		unsubscribe = data.store.subscribe(() => {
			colorMode = data.store.getState().localSettings.colorMode;
		});
		return unsubscribe;
	});
	afterUpdate(() => {
		colorMode;
	});
	$: if (colorMode !== null && colorMode !== undefined) {
		document.documentElement.setAttribute("color-mode", colorMode);
	}
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<Navbar store={data.store} />
<section class="section" id="main">
	<slot />
</section>
