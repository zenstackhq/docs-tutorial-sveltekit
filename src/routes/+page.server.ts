import type { PageServerLoad } from './$types';
import { fail, type Actions, redirect } from '@sveltejs/kit';
import { JWT_TOKEN_COOKIE_NAME } from '$lib/auth';

export const load: PageServerLoad = async ({ locals }) => {
	const posts = await locals.db.post.findMany({ include: { author: true } });
	return {
		user: locals.user,
		posts
	};
};

export const actions: Actions = {
	create: async ({ request, locals }) => {
		const data = await request.formData();
		const title = data.get('title');
		if (typeof title !== 'string') {
			return fail(400, { missing: true });
		}

		await locals.db.post.create({ data: { title } });

		return { success: true };
	},

	togglePublish: async ({ request, locals }) => {
		const data = await request.formData();
		const postId = data.get('id');
		if (typeof postId !== 'string') {
			return fail(400, { missing: true });
		}

		const post = await locals.db.post.findUnique({ where: { id: postId } });
		if (!post) {
			return fail(404, { notFound: true });
		}

		try {
			await locals.db.post.update({ where: { id: postId }, data: { published: !post.published } });
			return { success: true };
		} catch (err) {
			// error can be thrown for reasons like access policy violation
			return { error: `${err}` };
		}
	},

	delete: async ({ request, locals }) => {
		const data = await request.formData();
		const postId = data.get('id');
		if (typeof postId !== 'string') {
			return fail(400, { missing: true });
		}

		try {
			await locals.db.post.delete({ where: { id: postId } });
			return { success: true };
		} catch (err) {
			// error can be thrown for reasons like access policy violation
			return { error: `${err}` };
		}
	},

	signOut: async ({ cookies }) => {
		cookies.delete(JWT_TOKEN_COOKIE_NAME);
		throw redirect(303, '/signin');
	}
};
