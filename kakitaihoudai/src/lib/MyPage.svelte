<script lang="ts">
	import MyDrawings from './MyDrawings.svelte';
	import { onMount } from 'svelte';
	import type { Drawing } from './types';

	let { currentUserId }: { currentUserId: number } = $props();

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D | null = $state(null);

	let isDrawing = false;
	let lastX = 0;
	let lastY = 0;
	let brushSize = $state(5);
	let brushColor = $state('#000000');
	let currentTitle = $state('');
	let currentDrawing = $state({ id: 0, content: '' });

	const saveURL = import.meta.env.VITE_SERVER_URL + '/save-drawing';
	const drawingsURL = import.meta.env.VITE_SERVER_URL + '/my-drawings';
	const updateURL = import.meta.env.VITE_SERVER_URL + '/update-drawing';
	const deleteURL = import.meta.env.VITE_SERVER_URL + '/delete-drawing';
	const postDrawingURL = import.meta.env.VITE_SERVER_URL + '/post-drawing';

	function setupCanvas() {
		ctx = canvas.getContext('2d');
		if (ctx) {
			ctx.lineWidth = brushSize;
			ctx.lineCap = 'round';
			ctx.strokeStyle = brushColor;
		}
	}

	$effect(() => {
		if (ctx) {
			ctx.lineWidth = brushSize;
			ctx.strokeStyle = brushColor;
		}
	});

	function handleMouseDown(event: MouseEvent) {
		isDrawing = true;
		[lastX, lastY] = [event.offsetX, event.offsetY];
		canvas.focus();
	}

	function handleMouseMove(event: MouseEvent) {
		if (!isDrawing || !ctx) return;
		ctx.beginPath();
		ctx.moveTo(lastX, lastY);
		ctx.lineTo(event.offsetX, event.offsetY);
		ctx.stroke();
		[lastX, lastY] = [event.offsetX, event.offsetY];
	}

	function handleMouseUp() {
		isDrawing = false;
	}

	function handleMouseOut() {
		isDrawing = false;
	}

	function handleClearCanvas() {
		if (ctx) {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
		}
	}

	function handleSelectDrawing(content: string) {
		const img = new Image();
		img.onload = () => {
			ctx?.drawImage(img, 0, 0);
		};
		img.src = content;
	}

	async function updateDrawing(newDrawing: string) {
		try {
			const response = await fetch(updateURL, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ id: currentDrawing.id, content: newDrawing })
			});
			if (response.status === 204) {
				alert('Drawing updated.');
				handleClearCanvas();
				currentDrawing.id = 0;
			} else {
				alert('Error updating drawing.');
			}
		} catch (error) {
			console.error('Error updating drawing: ', error);
		}
	}

	async function handleSaveDrawing(title: string, userId: number) {
		const base64Image = canvas.toDataURL('image/png');
		//updating
		if (currentDrawing.id !== 0) {
			updateDrawing(base64Image);
			//saving
		} else {
			if (title === '') {
				return alert('Please add a title.');
			}
			try {
				const response = await fetch(saveURL, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ title: title, content: base64Image, user_id: userId })
				});
				if (response.status === 201) {
					alert('Drawing saved.');
					handleClearCanvas();
					currentDrawing.id = 0;
				} else {
					alert('Error saving drawing.');
				}
			} catch (err) {
				console.error('Error saving drawing: ', err);
			}
		}
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

	async function handleDeleteDrawing() {
		const response = await fetch(deleteURL, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ id: currentDrawing.id })
		});
		if (response.status === 200) {
			alert('Drawing has been deleted.');
			currentDrawing.id = 0;
			currentDrawing.content = '';
			handleGetDrawings();
			handleClearCanvas();
		}
	}

	async function handlePostDrawing() {
		const response = await fetch(postDrawingURL, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ id: currentDrawing.id })
		});
		if (response.status === 200) {
			alert('Drawing posted.');
		} else {
			alert('Error posting.');
		}
	}

	$effect(() => {
		if (currentUserId > 0) {
			handleGetDrawings();
		}
	});

	$effect(() => {
		if (currentDrawing.id !== 0) {
			handleClearCanvas();
			handleSelectDrawing(currentDrawing.content);
		}
	});

	onMount(() => {
		setupCanvas();
	});
</script>

<MyDrawings {userDrawingsArr} bind:currentDrawing />
<!-- svelte-ignore a11y_mouse_events_have_key_events -->
<div>
	<canvas
		bind:this={canvas}
		height="500"
		width="500"
		onmousedown={handleMouseDown}
		onmousemove={handleMouseMove}
		onmouseup={handleMouseUp}
		onmouseout={handleMouseOut}
		class="mb-2 rounded border-2 border-solid border-black"
	>
	</canvas>

	<label for="brushSize">Brush Size:</label>
	<input type="range" id="brushSize" bind:value={brushSize} min="1" max="100" />
	<label for="brushColor">Color</label>
	<input type="color" id="brushColor" bind:value={brushColor} />
	<button
		class="rounded border-2 border-solid border-black bg-slate-100 px-3 py-1 active:bg-slate-400"
		onclick={() => {
			handleClearCanvas();
			currentDrawing.id = 0;
		}}>CLEAR/NEW</button
	>
	<button
		onclick={handleDeleteDrawing}
		class="rounded border-2 border-solid border-black bg-slate-100 px-3 py-1 active:bg-slate-400"
		>DELETE</button
	>
	<input
		class="rounded border-2 border-solid border-black p-1"
		type="text"
		placeholder="Please enter a title"
		bind:value={currentTitle}
	/>
	<button
		class="rounded border-2 border-solid border-black bg-slate-100 px-3 py-1 active:bg-slate-400"
		onclick={async () => {
			await handleSaveDrawing(currentTitle, currentUserId as number);
			handleGetDrawings();
			currentTitle = '';
		}}>Save</button
	>
	{#if currentDrawing.id !== 0}
		<button
			onclick={async () => {
				await handlePostDrawing();
				await handleSaveDrawing(currentTitle, currentUserId as number);
				handleGetDrawings();
				currentTitle = '';
			}}
			class="rounded border-2 border-solid border-black bg-slate-100 px-3 py-1 active:bg-slate-400"
			>Save and Post</button
		>
	{/if}
</div>
