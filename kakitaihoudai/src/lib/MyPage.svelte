<script lang="ts">
	import MyDrawings from './MyDrawings.svelte';
	import { onMount, onDestroy } from 'svelte';
	import type { Drawing } from './types';
	import toast from 'svelte-5-french-toast';

	let { currentUserId }: { currentUserId: number } = $props();

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D | null = $state(null);

	let isDrawing = false;
	let lastX = 0;
	let lastY = 0;
	let isDirty = false;
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

	function getEventCoordinates(event: MouseEvent | TouchEvent): { x: number; y: number } {
		if ('touches' in event) {
			const touch = event.touches[0];
			return {x: touch.clientX - canvas.offsetLeft, y: touch.clientY - canvas.offsetTop}
		} else {
			return { x: event.offsetX, y: event.offsetY };
		}
	}

	function handleMouseDown(event: MouseEvent | TouchEvent) {
		isDrawing = true;
		const { x, y } = getEventCoordinates(event);
		[lastX, lastY] = [x, y];
		canvas.focus();
	}

	function handleMouseMove(event: MouseEvent | TouchEvent) {
		if (!isDrawing || !ctx) return;
		const { x, y } = getEventCoordinates(event);
		ctx.beginPath();
		ctx.moveTo(lastX, lastY);
		ctx.lineTo(x, y);
		ctx.stroke();
		[lastX, lastY] = [x, y];
		isDirty = true;
		requestAnimationFrame(draw);
	}

	function handleMouseUp() {
		isDrawing = false;
	}

	function handleMouseOut() {
		isDrawing = false;
	}
	
	function handleTouchStart(event: TouchEvent) {
		handleMouseDown(event);
	}

	function handleTouchMove(event: TouchEvent) {
		handleMouseMove(event);
	}

	function draw() {
		if (isDirty && ctx) {
			ctx.beginPath();
			ctx.moveTo(lastX, lastY);
			ctx.lineTo(lastX, lastY);
			ctx.stroke();
			isDirty = false;
		}
	}

	function handleTouchEnd() {
		handleMouseUp();
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
				toast.success('Drawing updated.');
				handleClearCanvas();
				currentDrawing.id = 0;
			} else {
				toast.error('Error updating drawing.');
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
				return toast.error('Please add a title.');
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
					toast.success('Drawing saved.');
					handleClearCanvas();
					currentDrawing.id = 0;
				} else {
					toast.error('Error saving drawing.');
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
			toast.success('Drawing has been deleted.');
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
			toast.success('Drawing posted.');
		} else {
			toast.error('Error posting.');
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
		canvas.addEventListener('touchstart', handleTouchStart, { passive: true });
		canvas.addEventListener('touchmove', handleTouchMove, { passive: true });
		canvas.addEventListener('touchend', handleTouchEnd, { passive: true });
	});

	onDestroy(() => {
		canvas.removeEventListener('touchstart', handleTouchStart);
		canvas.removeEventListener('touchmove', handleTouchMove);
		canvas.removeEventListener('touchend', handleTouchEnd);
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
		class="mx-auto mb-2 rounded border-2 border-solid border-black"
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
