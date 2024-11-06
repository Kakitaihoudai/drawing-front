<script lang="ts">
	// import svelteLogo from './assets/svelte.svg'
	import Canvas from './lib/Canvas.svelte';
	import Login from './lib/Login.svelte';
	let isLoggedIn = $state(false);
	let currentUserId: number = $state(0);
</script>

<main class="max-h-svh">
	<div>
		<!-- <a href="https://svelte.dev" target="_blank" rel="noreferrer">
      <img src={svelteLogo} class="logo svelte" alt="Svelte Logo" />
    </a> -->
		{#if !isLoggedIn}
			<Login bind:isLoggedIn bind:currentUserId />
		{:else}
			<div class="h-64 grid gap-4 [grid-template-columns:1fr_3fr]">
				<Canvas {currentUserId} />
			</div>
		{/if}
	</div>
</main>
