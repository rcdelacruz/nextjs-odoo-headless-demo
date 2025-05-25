'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth';
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LoadingPage } from '@/components/ui/loading';
import { StudentService, PartnerService } from '@/lib/odoo/services';
import { UserGroupIcon, BuildingOfficeIcon, AcademicCapIcon, PlusIcon, UsersIcon } from '@heroicons/react/24/outline';

export default function DashboardPage() {
  const router = useRouter();
  const { checkAuth, user } = useAuthStore();
  const [stats, setStats] = useState({
    students: 0,
    customers: 0,
    suppliers: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!checkAuth()) {
      router.push('/login');
      return;
    }

    loadDashboardStats();
  }, [router, checkAuth]);

  const loadDashboardStats = async () => {
    try {
      const [studentsResult, customersResult, suppliersResult] = await Promise.allSettled([
        StudentService.getAll(1),
        PartnerService.getCustomers(1),
        PartnerService.getSuppliers(1),
      ]);

      setStats({
        students: studentsResult.status === 'fulfilled' ? studentsResult.value.length : 0,
        customers: customersResult.status === 'fulfilled' ? customersResult.value.length : 0,
        suppliers: suppliersResult.status === 'fulfilled' ? suppliersResult.value.length : 0,
      });
    } catch (error) {
      console.error('Failed to load dashboard stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingPage text="Loading dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                  Welcome back, {user?.username || 'Administrator'}
                </h1>
                <p className="text-gray-600">
                  University Management System Dashboard
                </p>
              </div>
              <div className="hidden md:block">
                <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center">
                  <AcademicCapIcon className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 mb-8 md:grid-cols-3">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Students</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">{stats.students}</p>
                <p className="text-sm text-blue-600 mt-1">Active enrollment</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <AcademicCapIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4">
              <button
                onClick={() => router.push('/students')}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                View all →
              </button>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Customers</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">{stats.customers}</p>
                <p className="text-sm text-green-600 mt-1">Active partners</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <UserGroupIcon className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4">
              <button
                onClick={() => router.push('/partners')}
                className="text-green-600 hover:text-green-700 text-sm font-medium"
              >
                View all →
              </button>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Suppliers</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">{stats.suppliers}</p>
                <p className="text-sm text-orange-600 mt-1">Business partners</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <BuildingOfficeIcon className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-4">
              <button
                onClick={() => router.push('/partners')}
                className="text-orange-600 hover:text-orange-700 text-sm font-medium"
              >
                View all →
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="card">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
              <p className="text-gray-600 mt-1">Manage your university data</p>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/students')}
                  className="btn-primary w-full flex items-center justify-center"
                >
                  <AcademicCapIcon className="h-4 w-4 mr-2" />
                  Manage Students
                </button>

                <button
                  onClick={() => router.push('/partners')}
                  className="btn-secondary w-full flex items-center justify-center"
                >
                  <UserGroupIcon className="h-4 w-4 mr-2" />
                  Manage Partners
                </button>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">System Information</h3>
              <p className="text-gray-600 mt-1">Current system status</p>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600 font-medium">Database:</span>
                  <span className="badge-info">{user?.db || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600 font-medium">User ID:</span>
                  <span className="badge-neutral">{user?.uid || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600 font-medium">Session:</span>
                  <span className="badge-success">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600 font-medium">Odoo Version:</span>
                  <span className="badge-info">18.0</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
