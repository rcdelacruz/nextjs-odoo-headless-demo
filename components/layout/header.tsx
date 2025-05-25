'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth';
import { Button } from '@/components/ui/button';
import { UserIcon, ArrowRightOnRectangleIcon, HomeIcon, AcademicCapIcon, UserGroupIcon } from '@heroicons/react/24/outline';

export function Header() {
  const router = useRouter();
  const { user, logout, isAuthenticated, checkAuth } = useAuthStore();

  // Check auth status
  const authStatus = checkAuth();

  const handleLogout = async () => {
    console.log('Header: Logout button clicked');
    await logout();
    router.push('/login');
  };

  // Only show header if authenticated
  if (!isAuthenticated && !authStatus) {
    return null;
  }

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center space-x-3 text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">O</span>
              </div>
              <span>Odoo Demo</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-1">
            <Link
              href="/dashboard"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
            >
              <HomeIcon className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>
            <Link
              href="/students"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
            >
              <AcademicCapIcon className="w-4 h-4" />
              <span>Students</span>
            </Link>
            <Link
              href="/partners"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
            >
              <UserGroupIcon className="w-4 h-4" />
              <span>Partners</span>
            </Link>
          </nav>

          {/* User menu */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3 bg-gray-50 rounded-lg px-3 py-2">
              <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center">
                <UserIcon className="w-4 h-4 text-white" />
              </div>
              <div className="hidden sm:block">
                <span className="text-sm font-medium text-gray-900">
                  {user?.username || user?.name || 'User'}
                </span>
                <div className="text-xs text-gray-500">
                  {user?.db || 'Database'}
                </div>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLogout}
              className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
            >
              <ArrowRightOnRectangleIcon className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}