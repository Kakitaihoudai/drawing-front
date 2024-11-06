<script lang="ts">
	import type { Drawing } from './types';
	import moment from 'moment';

	let {
		userDrawingsArr,
		currentDrawing = $bindable()
	}: { userDrawingsArr: Drawing[]; currentDrawing: {id: number, content: string} } = $props();
</script>

<div class="mb-2 grid-cols-1 overscroll-y-auto rounded border-2 border-solid border-black">
	{#each userDrawingsArr as drawing}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="cursor-pointer border-b-2 border-solid border-black p-2 active:bg-slate-400"
			onclick={() => {
				currentDrawing.id = drawing.id;
				console.log(currentDrawing.id);
				currentDrawing.content = drawing.content;
			}}
		>
			<p>{drawing.title}</p>
			<p>{moment(drawing.updated_at).fromNow()}</p>
		</div>
	{/each}
</div>
