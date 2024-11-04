<script lang="ts">
  let { isLoggedIn = $bindable() } = $props();

  const registerURL = import.meta.env.VITE_SERVER_URL + '/register';
  const loginURL = import.meta.env.VITE_SERVER_URL + '/login';
  let loginOrReg = $state('login');
  let username = $state('');
  let password = $state('');
  let confirmPassword = $state('');

  async function register(username: string, password: string, confirmPassword: string) {
    if (password === confirmPassword) {
        try {
            const response = await fetch(registerURL, {
                method: 'POST',
                headers: {
               'Content-Type': 'application/json'
                },
                body: JSON.stringify({username: username, password: password}),
            });
            if (response.status === 201) {
                alert("User created successfully. Please login.");
                loginOrReg = 'login';
            } else if (response.status === 400) {
                alert("That username is taken. Please choose another.");
            } else {
                alert("Server error.");
            }
        } catch (error) {
            console.error('Error:', error);
        }
    } else {
        alert("Passwords don't match.");
    }
  }

  async function login(username: string, password: string) {
    try {
        const response = await fetch(loginURL, {
            method: 'POST',
                headers: {
               'Content-Type': 'application/json'
                },
                body: JSON.stringify({username: username, password: password}),
            });
        if (response.status === 200) {
            isLoggedIn = true;
        } else if (response.status === 401) {
            alert("Wrong password.");
        } else if (response.status === 404) {
            alert("User not found.")
        }
    } catch (error) {
        console.error('Error:', error);
    }
  }
</script>

{#if loginOrReg === 'login'}
    <h1>Login</h1>
    <div>
        <input
        placeholder="Username"
        bind:value={username}
        />
    </div>
    <div>
        <input
        placeholder="Password"
        bind:value={password}
        type="password"
        />
    </div>
    <button onclick={() => login(username, password)}>Submit</button>
    <button onclick={() => loginOrReg = 'reg'}>Register?</button>
{:else if loginOrReg === 'reg'}
    <h1>Login</h1>
    <div>
        <input
        placeholder="Username"
        bind:value={username}
        />
    </div>
    <div>
        <input
        placeholder="Password"
        bind:value={password}
        type="password"
        />
    </div>
    <div>
        <input
        placeholder="Confirm Password"
        bind:value={confirmPassword}
        type="password"
        />
    </div>
    <button onclick={() => register(username, password, confirmPassword)}>Register</button>
{/if}