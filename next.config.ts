import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
    experimental: {
        ppr: 'incremental'
    },
    async rewrites() {
        return [
            {
                source: "/api/auth/dingtalk-login", // 匹配所有 /api/proxy 开头的请求
                destination: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/dingtalk-login`, // 目标地址
            },
            {
                source: "/api/v1/auth/me", // 匹配所有 /api/proxy 开头的请求
                destination: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/me`, // 目标地址
            }
        ];
    }
};

export default nextConfig;
