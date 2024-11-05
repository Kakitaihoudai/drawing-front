<script lang="ts">
	import { onMount } from 'svelte';

	let { currentUserId } = $props();

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D | null = $state(null);

	let isDrawing = false;
	let lastX = 0;
	let lastY = 0;
	let brushSize = $state(5);
	let brushColor = $state('#000000');
	let currentTitle = $state('');
	const saveURL = import.meta.env.VITE_SERVER_URL + '/save-drawing';

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

	function handleMouseDown(e: MouseEvent) {
		isDrawing = true;
		[lastX, lastY] = [e.offsetX, e.offsetY];
		canvas.focus();
	}

	function handleMouseMove(e: MouseEvent) {
		if (!isDrawing || !ctx) return;
		ctx.beginPath();
		ctx.moveTo(lastX, lastY);
		ctx.lineTo(e.offsetX, e.offsetY);
		ctx.stroke();
		[lastX, lastY] = [e.offsetX, e.offsetY];
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

	async function handleSaveDrawing(title: string, userId: number) {
		if (title === '') {
			return alert('Please add a title.');
		}
		const base64Image = canvas.toDataURL('image/png');
		try {
			const response = await fetch(saveURL, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ title: title, content: base64Image, user_id: userId })
			});
			if (response.status === 201) {
				alert('Image saved.');
				handleClearCanvas();
			} else {
				alert('Error savinf image.');
			}
		} catch (err) {
			console.error('Error saving drawing: ', err);
		}
	}

	onMount(() => {
		setupCanvas();
	});
</script>

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
		class="rounded border-2 border-solid border-black"
	>
	</canvas>

	<label for="brushSize">Brush Size:</label>
	<input type="range" id="brushSize" bind:value={brushSize} min="1" max="100" />
	<label for="brushColor">Color</label>
	<input type="color" id="brushColor" bind:value={brushColor} />
	<button onclick={handleClearCanvas}>CLEAR</button>
	<input
		class="rounded border-2 border-solid border-black"
		type="text"
		placeholder="Please enter a title"
		bind:value={currentTitle}
	/>
	<button
		class="rounded border-2 border-solid border-black bg-slate-100 px-3 py-1 active:bg-slate-400"
		onclick={() => handleSaveDrawing(currentTitle, currentUserId as number)}>Save</button
	>
	<button
		class="rounded border-2 border-solid border-black bg-slate-100 px-3 py-1 active:bg-slate-400"
		>Save and Post</button
	>
</div>
