<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from '../signin/$types';

	export let form: ActionData;
</script>

<div
	class="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]"
>
	<h1 class="text-5xl font-extrabold text-white">Login</h1>
	<form class="mt-16 flex flex-col gap-8 text-2xl" method="post" use:enhance>
		{#if form?.invalid}
			<p class="text-red-600 my-2">Invalid credentials</p>
		{/if}
		<div>
			<label for="email" class="inline-block w-32 text-white"> Email </label>
			<input
				id="email"
				name="email"
				type="email"
				value={form?.email ?? ''}
				class="ml-4 w-72 rounded border p-2"
			/>
		</div>
		<div>
			<label for="password" class="inline-block w-32 text-white"> Password </label>
			<input id="password" name="password" type="password" class="ml-4 w-72 rounded border p-2" />
		</div>
		<input
			type="submit"
			value="Sign in to my account"
			class="cursor-pointer rounded border border-gray-500 py-4 text-white"
		/>
		<div class="mt-2 text-base font-medium text-gray-300">
			Don't have an account yet?{' '}
			<a href="/signup" class="text-primary-700 underline"> Signup here </a>
		</div>
	</form>
</div>
