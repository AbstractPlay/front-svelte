<script lang="ts">
	import { onMount, afterUpdate } from 'svelte';
    import { type i18nextType } from '$lib/i18n';
	import type { Writable } from 'svelte/store';
    import { getContext } from "svelte";
	const i18n = getContext<Writable<i18nextType>>('i18n');
    import type { AppStore } from '$lib/store';
    import { toggleColorMode } from '$lib/store/localSettingsSlice';

    export let store: AppStore;

    import logoLight from "../assets/AbstractPlayLogo-light.svg";
    import logoDark from "../assets/AbstractPlayLogo-dark.svg";
    import LogInOutButton from './LogInOutButton.svelte';

    let colorMode: "light"|"dark" = "light";
    let burgerExpanded = false;
    let loggedin = false;
    let newNews = true;

    const localToggleColorMode = () => {
        store.dispatch(toggleColorMode());
    }

</script>

<nav class="navbar" style={`minHeight: 10vh`}>
    <div class="navbar-brand">
      <div class="navbar-item">
        <a href="/">
        {#if import.meta.env.mode === "production"}
            <img
              src={colorMode === "light" ? logoLight : logoDark}
              alt="Abstract Play logo"
              width="100%"
              height="auto"
              style={`maxHeight: none`}
            />
        {:else}
            <span>
              Abstract Play
              <br />
              DEVELOPMENT Server
            </span>
        {/if}
        </a>
      </div>
      <a
        role="button"
        class={"navbar-burger" + (burgerExpanded ? " is-active" : "")}
        aria-label="menu"
        aria-expanded="false"
        data-target="navbarMain"
        on:click={() => burgerExpanded = !burgerExpanded}
      >
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>
    <div
      id="navbarMain"
      class={"navbar-menu" + (burgerExpanded ? " is-active" : "")}
    >
      <div class="navbar-start">
        {#if loggedin}
            <div class="navbar-item">
              <a href="/" class="navbar-item">
                {$i18n.t("MyDashboard")}
              </a>
            </div>
            <div class="navbar-item">
              <a href="/playground" class="navbar-item">
                {$i18n.t("Playground")}
              </a>
            </div>
        {/if}
        <div class="navbar-item">
          <a href="/tournaments" class="navbar-item">
            {$i18n.t("Tournament.Tournaments")}
          </a>
        </div>
        <div class="navbar-item">
          <a href="/games" class="navbar-item">
            {$i18n.t("Games")}
          </a>
        </div>
        <div class="navbar-item">
          <a href="/players" class="navbar-item">
            {$i18n.t("Players")}
          </a>
        </div>
        <div class="navbar-item has-dropdown is-hoverable">
          <a class="navbar-link">{$i18n.t("About")}</a>
          <div class="navbar-dropdown">
              <div class="navbar-item">
                  <a href="/stats" class="navbar-item">
                      {$i18n.t("Statistics")}
                  </a>
              </div>
              <div class="navbar-item">
                  <a href="/news" class="navbar-item">
                      {$i18n.t("News")}
                      {#if newNews}
                          <span class="icon highlight">
                              &nbsp;
                              <i class="fa fa-eercast" aria-hidden="true"></i>
                          </span>
                      {/if}
                  </a>
              </div>
              <div class="navbar-item">
                  <a href="/about" class="navbar-item">
                  {$i18n.t("About")}
                  </a>
              </div>
          </div>
        </div>
      </div>
      <div class="navbar-end">
        <div class="navbar-item">
          <!--- Light mode button --->
          <button
              class="button is-small apButtonNeutral light--hidden"
              aria-label="Toggle light mode"
              on:click={localToggleColorMode}
          >
              Toggle Light Mode
          </button>

          <!--- Dark mode button --->
          <button
              class="button is-small apButtonNeutral dark--hidden"
              aria-label="Toggle dark mode"
              on:click={localToggleColorMode}
          >
              Toggle Dark Mode
          </button>
        </div>
        <div class="navbar-item tourSettings">
          <LogInOutButton />
        </div>
      </div>
    </div>
  </nav>

<style>

</style>
