'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '@/lib/store/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { getErrorMessage } from '@/lib/utils';

interface LoginFormData {
  username: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { login, checkAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  useEffect(() => {
    // Check if already authenticated
    console.log('🔍 Login page: Checking auth status...');
    if (checkAuth()) {
      console.log('✅ Login page: Already authenticated, redirecting to dashboard');
      router.push('/dashboard');
    }
  }, [router, checkAuth]);

  const onSubmit = async (data: LoginFormData) => {
    console.log('🔄 Login page: Form submitted');
    setIsLoading(true);
    setError(null);

    try {
      console.log('🔐 Login page: Calling login function...');
      const success = await login(data.username, data.password);
      
      console.log(`🎯 Login page: Login result: ${success}`);
      
      if (success) {
        console.log('✅ Login page: Login successful, waiting a moment for state update...');
        
        // Small delay to ensure state is updated
        setTimeout(() => {
          console.log('📍 Login page: Now redirecting to dashboard...');
          router.push('/dashboard');
        }, 100);
        
      } else {
        console.log('❌ Login page: Login failed');
        setError('Invalid username or password');
      }
    } catch (err) {
      console.error('💥 Login page: Exception during login:', err);
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
      console.log('🏁 Login page: Login process completed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Sign in to Odoo Demo</CardTitle>
          <p className="text-gray-600 mt-2">
            Enter your Odoo credentials to access the dashboard
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <Input
                id="username"
                type="text"
                autoComplete="username"
                {...register('username', { required: 'Username is required' })}
                className="mt-1"
                placeholder="admin"
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                {...register('password', { required: 'Password is required' })}
                className="mt-1"
                placeholder="Your password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <div className="text-sm text-gray-600">
              <p>Default credentials (if using demo data):</p>
              <p className="font-mono mt-1">admin / admin</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
