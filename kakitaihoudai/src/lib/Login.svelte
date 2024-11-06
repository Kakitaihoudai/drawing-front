<script lang="ts">
	let { isLoggedIn = $bindable(), currentUserId = $bindable() } = $props();

	const registerURL = import.meta.env.VITE_SERVER_URL + '/register';
	const loginURL = import.meta.env.VITE_SERVER_URL + '/login';
	let loginOrReg = $state('login');
	let username = $state('');
	let password = $state('');
	let confirmPassword = $state('');

	async function handleRegister(username: string, password: string, confirmPassword: string) {
		if (password === confirmPassword) {
			try {
				const response = await fetch(registerURL, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ username: username, password: password })
				});
				if (response.status === 201) {
					alert('User created successfully. Please login.');
					loginOrReg = 'login';
				} else if (response.status === 400) {
					alert('That username is taken. Please choose another.');
				} else {
					alert('Server error.');
				}
			} catch (error) {
				console.error('Error:', error);
			}
		} else {
			alert("Passwords don't match.");
		}
	}

	async function handleLogin(username: string, password: string) {
		try {
			const response = await fetch(loginURL, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ username: username, password: password })
			});
			if (response.status === 200) {
				isLoggedIn = true;
				if (response.body) {
					const parsedRes = await response.json();
					currentUserId = parsedRes.id;
				}
			} else if (response.status === 401) {
				alert('Wrong password.');
			} else if (response.status === 404) {
				alert('User not found.');
			}
		} catch (error) {
			console.error('Error:', error);
		}
	}
</script>

<!-- login page -->
{#if loginOrReg === 'login'}
	<h1 class="py-10 text-5xl font-bold">Login</h1>
	<div>
		<input
			class="mb-2 rounded border-2 border-solid border-black p-1"
			placeholder="Username"
			bind:value={username}
		/>
	</div>
	<div>
		<input
			class="mb-2 rounded border-2 border-solid border-black p-1"
			placeholder="Password"
			bind:value={password}
			type="password"
		/>
	</div>
	<button
		class="mb-2 rounded border-2 border-solid border-black bg-slate-100 px-3 py-1 active:bg-slate-400"
		onclick={() => handleLogin(username, password)}
	>
		Submit
	</button>
	<button
		class="mb-2 rounded border-2 border-solid border-black bg-slate-100 px-3 py-1 active:bg-slate-400"
		onclick={() => (loginOrReg = 'reg')}
	>
		Register?
	</button>
	<!-- register page -->
{:else if loginOrReg === 'reg'}
	<h1 class="py-10 text-5xl font-bold">Register</h1>
	<div>
		<input
			class="mb-2 rounded border-2 border-solid border-black p-1"
			placeholder="Username"
			bind:value={username}
		/>
	</div>
	<div>
		<input
			class="mb-2 rounded border-2 border-solid border-black p-1"
			placeholder="Password"
			bind:value={password}
			type="password"
		/>
	</div>
	<div>
		<input
			class="mb-2 rounded border-2 border-solid border-black p-1"
			placeholder="Confirm Password"
			bind:value={confirmPassword}
			type="password"
		/>
	</div>
	<button
		class="rounded border-2 border-solid border-black bg-slate-100 px-3 py-1 active:bg-slate-400"
		onclick={() => handleRegister(username, password, confirmPassword)}>Register</button
	>
	<button
		class="rounded border-2 border-solid border-black bg-slate-100 px-3 py-1 active:bg-slate-400"
		onclick={() => (loginOrReg = 'login')}>Go Back</button
	>
{/if}
