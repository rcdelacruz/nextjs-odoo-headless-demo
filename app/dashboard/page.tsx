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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Header />
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  Welcome back, {user?.username || 'User'}! 👋
                </h1>
                <p className="text-lg text-gray-600">
                  Here's your Odoo system overview and quick actions.
                </p>
              </div>
              <div className="hidden md:block">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center">
                  <UsersIcon className="w-12 h-12 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 mb-8 md:grid-cols-3">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-semibold">Students</CardTitle>
              <AcademicCapIcon className="h-8 w-8 text-blue-100" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-1">{stats.students}</div>
              <p className="text-blue-100">
                Active student records
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-semibold">Customers</CardTitle>
              <UserGroupIcon className="h-8 w-8 text-green-100" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-1">{stats.customers}</div>
              <p className="text-green-100">
                Customer records
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-semibold">Suppliers</CardTitle>
              <BuildingOfficeIcon className="h-8 w-8 text-purple-100" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-1">{stats.suppliers}</div>
              <p className="text-purple-100">
                Supplier records
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-8 lg:grid-cols-2">
          <Card className="shadow-xl border-0 bg-white">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-t-lg">
              <CardTitle className="text-xl">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <button
                  onClick={() => router.push('/students')}
                  className="w-full flex items-center p-4 text-left bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-xl transition-all duration-300 transform hover:-translate-y-1 shadow-md hover:shadow-lg group"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                    <AcademicCapIcon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <div className="text-lg font-semibold text-gray-900">Manage Students</div>
                    <div className="text-sm text-gray-600">View and manage student records</div>
                  </div>
                  <PlusIcon className="ml-auto h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                </button>
                
                <button
                  onClick={() => router.push('/partners')}
                  className="w-full flex items-center p-4 text-left bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 rounded-xl transition-all duration-300 transform hover:-translate-y-1 shadow-md hover:shadow-lg group"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center group-hover:bg-green-600 transition-colors">
                    <UserGroupIcon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <div className="text-lg font-semibold text-gray-900">Manage Partners</div>
                    <div className="text-sm text-gray-600">View customers and suppliers</div>
                  </div>
                  <PlusIcon className="ml-auto h-5 w-5 text-gray-400 group-hover:text-green-500 transition-colors" />
                </button>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-xl border-0 bg-white">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-t-lg">
              <CardTitle className="text-xl">System Information</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600 font-medium">Database:</span>
                  <span className="font-mono text-sm bg-white px-3 py-1 rounded-md border">{user?.db || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600 font-medium">User ID:</span>
                  <span className="font-mono text-sm bg-white px-3 py-1 rounded-md border">{user?.uid || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600 font-medium">Session:</span>
                  <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-green-100 text-green-800">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                    Active
                  </span>
                </div>
                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-l-4 border-blue-500">
                  <p className="text-gray-700 text-sm leading-relaxed">
                    <strong>Next.js Odoo Demo:</strong> This application demonstrates how to build a modern frontend using Next.js that connects to Odoo as a headless ERP backend.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}