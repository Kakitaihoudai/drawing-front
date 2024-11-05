<script lang="ts">
  // import svelteLogo from './assets/svelte.svg'
  import Canvas from './lib/Canvas.svelte';
  import Login from './lib/Login.svelte';
  let isLoggedIn = $state(false);
  let currentUserId = $state(0);
</script>

<main>
  <div>
    <!-- <a href="https://svelte.dev" target="_blank" rel="noreferrer">
      <img src={svelteLogo} class="logo svelte" alt="Svelte Logo" />
    </a> -->
    {#if !isLoggedIn}
      <Login bind:isLoggedIn bind:currentUserId/>
    {:else}
      <Canvas currentUserId={currentUserId}/>
    {/if}
  </div>
</main>