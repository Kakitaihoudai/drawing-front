<script lang="ts">
	// import svelteLogo from './assets/svelte.svg'
	import Canvas from './lib/Canvas.svelte';
	import Login from './lib/Login.svelte';
  import MyDrawings from './lib/MyDrawings.svelte';
	let isLoggedIn = $state(false);
	let currentUserId: number = $state(0);
</script>

<main>
	<div>
		<!-- <a href="https://svelte.dev" target="_blank" rel="noreferrer">
      <img src={svelteLogo} class="logo svelte" alt="Svelte Logo" />
    </a> -->
		{#if !isLoggedIn}
			<Login bind:isLoggedIn bind:currentUserId />
		{:else}
			<div class="grid gap-4 [grid-template-columns:1fr_3fr]">
				<MyDrawings {currentUserId} />
        <Canvas {currentUserId} />
			</div>
		{/if}
	</div>
</main>
