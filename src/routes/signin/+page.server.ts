import { JWT_TOKEN_COOKIE_NAME, createToken } from '$lib/auth';
import { prisma } from '$lib/db';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';

export const actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();

		const email = data.get('email');
		const password = data.get('password');

		if (typeof email !== 'string' || typeof password !== 'string') {
			return fail(400, { email, password, missing: true });
		}

		const user = await prisma.user.findFirst({
			where: { email }
		});
		if (!user || !bcrypt.compareSync(password, user.password)) {
			return fail(401, { email, password, invalid: true });
		}

		const token = createToken(user);
		cookies.set(JWT_TOKEN_COOKIE_NAME, token, {
			httpOnly: true,
			expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
			path: '/'
		});
		throw redirect(303, `/`);
	}
} satisfies Actions;
