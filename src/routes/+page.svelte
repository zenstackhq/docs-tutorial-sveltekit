<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageData } from './$types';

	export let data: PageData;
	export let form: ActionData;
</script>

<main
	class="flex flex-col min-h-screen items-center justify-center gap-12 px-4 py-16 text-white bg-gradient-to-b from-[#2e026d] to-[#15162c]"
>
	<h1 class="text-5xl font-extrabold">My Awesome Blog</h1>

	{#if data.user}
		<div class="flex flex-col">
			<div class="flex gap-4">
				<h3 class="text-lg">Welcome back, {data.user.email}</h3>
				<form method="post" action="?/signOut">
					<button type="submit" class="text-gray-300 underline">Sign out</button>
				</form>
			</div>

			<section class="mt-10 container flex flex-col text-white">
				<!-- create post -->
				<form method="post" action="?/create" use:enhance>
					<input
						name="title"
						type="text"
						placeholder="Post title"
						required
						class="text-lg text-black px-4 py-2 rounded mr-2"
					/>
					<button class="rounded border border-white px-4 py-2 text-lg" type="submit"
						>+ Create</button
					>
				</form>

				<!-- post list -->
				<ul class="container mt-8 flex flex-col gap-2">
					{#each data.posts as post (post.id)}
						<li class="flex items-end justify-between gap-4">
							<!-- post info -->
							<p class={`text-2xl ${!post.published ? 'text-gray-400' : ''}`}>
								{post.title}
								<span class="text-lg"> by {post.author.email}</span>
							</p>

							<!-- post management -->
							<div class="flex w-32 justify-end gap-1 text-left">
								<form method="post" action="?/togglePublish" use:enhance>
									<input type="hidden" name="id" value={post.id} />
									<button class="underline" type="submit">
										{post.published ? 'Unpublish' : 'Publish'}
									</button>
								</form>
								<form method="post" action="?/delete" use:enhance>
									<input type="hidden" name="id" value={post.id} />
									<button class="underline" type="submit">Delete</button>
								</form>
							</div>
						</li>
					{/each}
				</ul>

				{#if form?.error}
					<p class="text-red-600 mt-4">{form.error}</p>
				{/if}
			</section>
		</div>
	{:else}
		<div class="flex gap-4 text-2xl">
			<a href="/signin" class="rounded-lg border px-4 py-2">Signin</a>
			<a href="/signup" class="rounded-lg border px-4 py-2">Signup</a>
		</div>
	{/if}
</main>
