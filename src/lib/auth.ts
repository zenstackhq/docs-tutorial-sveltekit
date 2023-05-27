import { env } from '$env/dynamic/private';
import type { User } from '@prisma/client';
import jwt from 'jsonwebtoken';

export const JWT_TOKEN_COOKIE_NAME = 'ZenStack-Blog-Token';

export function createToken(user: User) {
	return jwt.sign(
		{
			sub: user.id,
			email: user.email
		},
		env.JWT_SECRET,
		{ expiresIn: '7d' }
	);
}
