'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth';
import { Button } from '@/components/ui/button';
import { UserIcon, ArrowRightOnRectangleIcon, HomeIcon, AcademicCapIcon, UserGroupIcon, BookOpenIcon, CalendarIcon } from '@heroicons/react/24/outline';

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
    <header className="header-fixed">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center space-x-4 group">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                <AcademicCapIcon className="w-7 h-7 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">EduCore ERP</span>
                <p className="text-sm text-slate-600 -mt-1">Educational Management System</p>
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
            <Link
              href="/courses"
              className="nav-item flex items-center space-x-2"
            >
              <BookOpenIcon className="w-4 h-4" />
              <span>Courses</span>
            </Link>
            <Link
              href="/academic-years"
              className="nav-item flex items-center space-x-2"
            >
              <CalendarIcon className="w-4 h-4" />
              <span>Academic</span>
            </Link>
          </nav>

          {/* User menu */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-3 px-4 py-2 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border border-slate-200">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-md">
                <UserIcon className="h-5 w-5 text-white" />
              </div>
              <div className="text-sm">
                <p className="font-semibold text-slate-900">{user?.username || user?.name || 'Administrator'}</p>
                <p className="text-slate-600">System Admin</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="btn-outline flex items-center space-x-2 px-4 py-2"
            >
              <ArrowRightOnRectangleIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
