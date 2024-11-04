<script lang="ts">
  import { onMount } from "svelte";

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D | null = null;

  let isDrawing = false;
  let lastX = 0;
  let lastY = 0;
  let brushSize = 5
  let brushColor = "#000000"

  function setupCanvas() {
    ctx = canvas.getContext("2d");
    if (ctx) {
        ctx.lineWidth = brushSize;
        ctx.lineCap = "round";
        ctx.strokeStyle = brushColor;
    }
  }

  $: if (ctx) {
    ctx.lineWidth = brushSize;
    ctx.strokeStyle = brushColor;
  }

  function handleMouseDown(e: MouseEvent) {
    isDrawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
    canvas.focus();
  }

  function handleMouseMove(e: MouseEvent) {
    if (!isDrawing || !ctx) return
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
  
  onMount(() => {
        setupCanvas();
    })
</script>

<!-- svelte-ignore a11y_mouse_events_have_key_events -->
<canvas 
bind:this={canvas} 
height="500" 
width="500" 
on:mousedown={handleMouseDown} 
on:mousemove={handleMouseMove} 
on:mouseup={handleMouseUp} 
on:mouseout={handleMouseOut} 
style="border:1px solid black;">
</canvas>

<label for="brushSize">Brush Size:</label>
<input type="range" id="brushSize" bind:value={brushSize} min="1" max="100" />
<label for="brushColor">Color</label>
<input type="color" id="brushColor" bind:value={brushColor}/>
<button on:click={handleClearCanvas}>CLEAR</button>
<button>Save</button>
<button>Save and Post</button>