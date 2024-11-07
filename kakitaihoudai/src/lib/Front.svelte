<script lang="ts">
	import type { Drawing } from './types';
	import moment from 'moment';

	let { myPageOrFront } = $props();

	let postedArr: Drawing[] = $state([]);

	const getPostedURL = import.meta.env.VITE_SERVER_URL + '/posted-drawings';

	async function handleGetPosted() {
		const response = await fetch(getPostedURL, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});
		if (response.status === 200) {
			const parsedRes = await response.json();
			postedArr = parsedRes;
		} else {
			console.error('Error getting posts.');
		}
	}

	$effect(() => {
		if (myPageOrFront === 'front') {
			handleGetPosted();
		}
	});
</script>

<div class="w-full">
	{#each postedArr as drawing}
		<div class="grid max-w-full place-items-center">
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<img
				alt={drawing.title}
				src={drawing.content}
				class="mt-1 max-w-full border-4 border-double border-slate-600"
			/>
			<div class="w-full max-w-full border-b-2 border-solid border-black p-2">
				<p class="text-4xl">{drawing.title}</p>
				<p class="text-slate-400">by {drawing.author?.username}</p>
				<p class="text-xl">{moment(drawing.updated_at).fromNow()}</p>
			</div>
		</div>
	{/each}
</div>
