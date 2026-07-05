'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !loading) {
      if (user) {
        router.replace('/dashboard');
      } else {
        router.replace('/auth/login');
      }
    }
  }, [user, loading, router, mounted]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="text-center text-white">
        <h1 className="text-5xl font-bold mb-4">Agrifarm ERP</h1>
        <p className="text-xl mb-8">Enterprise Resource Planning System</p>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-white mx-auto"></div>
      </div>
    </div>
  );
}
