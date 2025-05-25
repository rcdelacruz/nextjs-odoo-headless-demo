'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth';
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LoadingPage } from '@/components/ui/loading';
import { StudentService, PartnerService } from '@/lib/odoo/services';
import { UserGroupIcon, BuildingOfficeIcon, AcademicCapIcon } from '@heroicons/react/24/outline';

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
        StudentService.getAll(1), // Just count
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
    <div>
      <Header />
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Welcome back, {user?.username || 'User'}! Here's your Odoo system overview.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 mb-8 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <AcademicCapIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.students}</div>
              <p className="text-xs text-muted-foreground">
                Active student records
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Customers</CardTitle>
              <UserGroupIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.customers}</div>
              <p className="text-xs text-muted-foreground">
                Customer records
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Suppliers</CardTitle>
              <BuildingOfficeIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.suppliers}</div>
              <p className="text-xs text-muted-foreground">
                Supplier records
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <button
                  onClick={() => router.push('/students')}
                  className="flex items-center p-3 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  <AcademicCapIcon className="h-5 w-5 text-blue-600 mr-3" />
                  <div>
                    <div className="font-medium">Manage Students</div>
                    <div className="text-sm text-gray-500">View and manage student records</div>
                  </div>
                </button>
                
                <button
                  onClick={() => router.push('/partners')}
                  className="flex items-center p-3 text-left bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                >
                  <UserGroupIcon className="h-5 w-5 text-green-600 mr-3" />
                  <div>
                    <div className="font-medium">Manage Partners</div>
                    <div className="text-sm text-gray-500">View customers and suppliers</div>
                  </div>
                </button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Database:</span>
                  <span className="font-mono">{user?.db || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">User ID:</span>
                  <span className="font-mono">{user?.uid || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Session:</span>
                  <span className="text-green-600">Active</span>
                </div>
                <div className="pt-3 border-t">
                  <p className="text-gray-600">
                    This demo shows Next.js connecting to Odoo as a headless ERP backend.
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