'use client';
import { lusitana } from '@/app/ui/fonts';
import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from './button';

import {useActionState, useEffect, useState} from 'react';
import { authenticate } from '@/app/lib/actions';
import { useSearchParams } from 'next/navigation';
import * as dd from 'dingtalk-jsapi'; // 此方式为整体加载，也可按需进行加载



export default function LoginForm() {
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
    <form action={formAction} className="space-y-3">
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <h1 className={`${lusitana.className} mb-3 text-2xl`}>
          Please log in to continue.
        </h1>
        <div className="w-full">

          <div>
            <label
                className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                htmlFor="authCode"
            >
              AuthCode
            </label>
            <div className="relative">
              <input
                  className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                  id="authCode"
                  type="input"
                  name="authCode"
                  placeholder="dingtalk AuthCode"
                  defaultValue={authCode}
                  required
              />
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>
        <input type="hidden" name="redirectTo" value={callbackUrl} />
        <Button className="mt-4 w-full" aria-disabled={isPending}>
          Log in <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
        </Button>
        <div className="flex h-8 items-end space-x-1"
             aria-live="polite"
             aria-atomic="true">
          {/* Add form errors here */}
          {errorMessage && (
              <>
                <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                <p className="text-sm text-red-500">{errorMessage}</p>
              </>
          )}
        </div>
      </div>
    </form>
  );
}
