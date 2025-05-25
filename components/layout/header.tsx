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
    <header className="nav sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <AcademicCapIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-semibold text-gray-900">University Portal</span>
                <p className="text-sm text-gray-500 -mt-1">Student Management</p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-1">
            <Link
              href="/dashboard"
              className="nav-item flex items-center space-x-2"
            >
              <HomeIcon className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>
            <Link
              href="/students"
              className="nav-item flex items-center space-x-2"
            >
              <AcademicCapIcon className="w-4 h-4" />
              <span>Students</span>
            </Link>
            <Link
              href="/partners"
              className="nav-item flex items-center space-x-2"
            >
              <UserGroupIcon className="w-4 h-4" />
              <span>Partners</span>
            </Link>
          </nav>

          {/* User menu */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-3 px-3 py-2 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <UserIcon className="h-4 w-4 text-blue-600" />
              </div>
              <div className="text-sm">
                <p className="font-medium text-gray-900">{user?.username || user?.name || 'Administrator'}</p>
                <p className="text-gray-500">Administrator</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="btn-outline flex items-center space-x-2"
            >
              <ArrowRightOnRectangleIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
