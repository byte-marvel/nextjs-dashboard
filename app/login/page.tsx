'use client'
import AcmeLogo from '@/app/ui/acme-logo';
import LoginForm from '@/app/ui/login-form';
import {Suspense, useActionState, useEffect, useState} from 'react';
import { authenticate } from '@/app/lib/actions';
import * as dd from 'dingtalk-jsapi';
import {useSearchParams} from "next/navigation"; // 此方式为整体加载，也可按需进行加载



export default function LoginPage() {

    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
    const [errorMessage, formAction, isPending] = useActionState(
        authenticate,
        undefined,
    );
    const [authCode, setAuthCode] = useState(''); // 新增状态管理

    // 将钉钉API调用移到 useEffect 中
    useEffect(() => {
        const fetchDingTalkAuth = async () => {
            try {
                // 添加更严格的环境判断
                if (typeof dd !== 'undefined' && dd.env.platform !== 'notInDingTalk') {
                    // 使用正确的API方法名
                    const res = await dd.runtime.permission.requestAuthCode({
                        corpId: 'ding0f28640d7ade5ca0f2c783f7214b6d69'
                    });

                    // 处理返回结果
                    if (res.code) {
                        console.log('Auth code:', res.code);
                        setAuthCode(res.code);
                        // 修改为使用 formData 方式调用 authenticate
                        await authenticate(undefined, res.code);
                    } else {
                        console.error('钉钉认证失败:', res);
                    }
                }
            } catch (err) {
                console.error('钉钉API调用异常:', err);
            }
        };

        fetchDingTalkAuth();
    }, []);

    return (
        <main className="flex items-center justify-center md:h-screen">
            <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
                <div className="flex h-20 w-full items-end rounded-lg bg-blue-500 p-3 md:h-36">
                    <div className="w-32 text-white md:w-36">
                        <AcmeLogo />
                    </div>
                </div>
            </div>
        </main>
    );
}