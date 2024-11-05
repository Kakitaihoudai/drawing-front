<script lang="ts">
	import { onMount } from 'svelte';

	let { currentUserId } = $props();
	const drawingsURL = import.meta.env.VITE_SERVER_URL + '/my-drawings';

	interface Drawing {
		id: number;
		created_at: Date;
		updated_at: Date;
		posted_at: null | Date;
		title: string;
		content: string;
		posted: boolean;
		user_id: number;
		likes: number;
		dislikes: number;
	}

	let userDrawingsArr: Drawing[] = $state([]);

	async function handleGetDrawings() {
		const response = await fetch(drawingsURL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ user_id: currentUserId })
		});
		if (response.status === 200) {
			const parsedRes = await response.json();
			userDrawingsArr = parsedRes;
		}
	}

	$effect(() => {
		if (currentUserId > 0) {
			handleGetDrawings();
		}
	});
</script>

<div>
	{#each userDrawingsArr as drawing}
		<p>{drawing.title}</p>
	{/each}
</div>
