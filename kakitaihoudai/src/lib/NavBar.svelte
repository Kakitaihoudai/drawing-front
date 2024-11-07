<script lang="ts">
	let { isLoggedIn = $bindable(), myPageOrFront = $bindable() } = $props();
</script>

<div class="flex h-20 w-screen items-center bg-slate-600 bg-fixed p-4">
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<p
		class="cursor-pointer align-middle font-sans text-5xl text-white"
		onclick={() => {
			isLoggedIn = false;
		}}
	>
		Kakitaihoudai
	</p>
	{#if isLoggedIn}
		<div class="flex h-full flex-grow items-center justify-end">
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
			<p
				class="flex h-full cursor-pointer items-center border-x-2 px-4 align-middle text-white hover:bg-slate-700"
				onclick={() => (myPageOrFront = 'front')}
			>
				Front
			</p>
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
			<p
				class="mr-4 flex h-full cursor-pointer items-center px-4 text-white hover:bg-slate-700"
				onclick={() => (myPageOrFront = 'mypage')}
			>
				My Page
			</p>
		</div>
	{/if}
</div>
