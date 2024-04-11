import { createToken, JWT_TOKEN_COOKIE_NAME } from '$lib/auth';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import { enhance, isPrismaClientKnownRequestError } from '@zenstackhq/runtime';
import { prisma } from '../../lib/db';

export const actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();

		const email = data.get('email');
		const password = data.get('password');

		if (typeof email !== 'string' || typeof password !== 'string') {
			return fail(400, { email, password, missing: true });
		}

		const db = enhance(prisma);

		try {
			// create the user together with a default space
			const user = await db.user.create({
				data: {
					email,
					password
				}
			});

			// sign a JWT token and set it as a cookie
			const token = createToken(user);
			cookies.set(JWT_TOKEN_COOKIE_NAME, token, {
				httpOnly: true,
				expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
				path: '/'
			});
		} catch (err) {
			if (isPrismaClientKnownRequestError(err) && err.code === 'P2002') {
				// duplicated email
				return fail(400, { email, password, dup: true });
			} else {
				throw err;
			}
		}

		throw redirect(303, `/`);
	}
} satisfies Actions;
