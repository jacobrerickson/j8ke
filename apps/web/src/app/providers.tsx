'use client';

import { Provider } from 'react-redux';
import { store } from '@/store';
import { PostHogProvider } from '@/providers/posthog';

export function Providers({ children }: { children: React.ReactNode }) {
    return <Provider store={store}><PostHogProvider>{children}</PostHogProvider></Provider>;
} 