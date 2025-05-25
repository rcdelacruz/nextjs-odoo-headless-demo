'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth';
import { LoadingPage } from '@/components/ui/loading';

export default function Home() {
  const router = useRouter();
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    const isAuthenticated = checkAuth();
    
    if (isAuthenticated) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, [router, checkAuth]);

  return <LoadingPage text="Redirecting..." />;
}