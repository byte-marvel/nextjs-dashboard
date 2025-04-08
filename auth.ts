import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import { z } from 'zod';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcryptjs';
import postgres from 'postgres';

import Credentials from 'next-auth/providers/credentials';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// async function getUser(email: string): Promise<User | undefined> {
//     try {
//         const user = await sql<User[]>`SELECT * FROM users WHERE email=${email}`;
//         return user[0];
//     } catch (error) {
//         console.error('Failed to fetch user:', error);
//         throw new Error('Failed to fetch user.');
//     }
// }

async function getToken(authCode: string): Promise<{ access_token: string,expires_in: number, token_type: string} | undefined> {
    try {
        const response = await fetch(`https://api-assistant.dev.fosun.com/api/v1/auth/dingtalk-login?code=${encodeURIComponent(authCode)}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            // 如果你不需要在 body 中传递其他内容，则可以省略 body
            // body: JSON.stringify({}) // 可省略
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Token获取失败:', error);
        return undefined;
    }
}


export const { auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            credentials: {
                authCode: {},
            },
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({ authCode: z.string()})
                    .safeParse(credentials);
                if (parsedCredentials.success) {
                    const { authCode } = parsedCredentials.data;
                    const tokenData = await getToken(authCode);

                    if (tokenData) {
                        // 解析JWT获取用户信息（根据实际token结构调整）

                        const payload = JSON.parse(
                            Buffer.from(tokenData.access_token.split('.')[1], 'base64').toString()
                        );
                        console.log('Token:', tokenData,payload);
                        return {
                            id: payload.sub,
                            name: payload.sub,
                            accessToken: tokenData.access_token
                        };
                    }
                }
                console.log('Invalid credentials');
                return null;
            },
        }),
    ],
});