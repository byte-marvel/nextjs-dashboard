'use client';

import { useEffect } from 'react';

export default function VConsoleInit() {
    useEffect(() => {
        // 只在生产环境下开启 vConsole
        if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_SHOW_VCONSOLE === 'true') {
            import('vconsole').then((VConsoleModule) => {
                // @ts-ignore
                new VConsoleModule.default();
            });
        }
    }, []);

    return null;
}