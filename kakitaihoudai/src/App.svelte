<script lang="ts">
	// import svelteLogo from './assets/svelte.svg'
	import MyPage from './lib/MyPage.svelte';
	import Login from './lib/Login.svelte';
	import NavBar from './lib/NavBar.svelte';
	import Front from './lib/Front.svelte';
	import toast, {Toaster} from 'svelte-5-french-toast'
	let isLoggedIn = $state(false);
	let currentUserId: number = $state(0);
	let myPageOrFront: string = $state('mypage');
</script>

<main class="max-h-svh">
	<Toaster />
	<NavBar bind:isLoggedIn bind:myPageOrFront/>
	<div>
		<!-- <a href="https://svelte.dev" target="_blank" rel="noreferrer">
      <img src={svelteLogo} class="logo svelte" alt="Svelte Logo" />
    </a> -->
		{#if !isLoggedIn}
			<Login bind:isLoggedIn bind:currentUserId />
		{:else if myPageOrFront === 'mypage'}
			<div class="h-64 grid gap-4 [grid-template-columns:1fr_3fr]">
				<MyPage {currentUserId} />
			</div>
		{:else if myPageOrFront === 'front'}
			<Front {myPageOrFront}/>
		{/if}
	</div>
</main>
