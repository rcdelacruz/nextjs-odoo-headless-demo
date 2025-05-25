'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth';
import { Header } from '@/components/layout/header';
import { LoadingPage } from '@/components/ui/loading';
import { ModernDashboard } from '@/components/dashboard/modern-dashboard';
import { StudentService, PartnerService, CourseService, AcademicYearService } from '@/lib/odoo/services';

export default function DashboardPage() {
  const router = useRouter();
  const { checkAuth, user } = useAuthStore();
  const [stats, setStats] = useState({
    students: 0,
    customers: 0,
    suppliers: 0,
    courses: 0,
    currentAcademicYear: null as any,
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
      const [studentsResult, customersResult, suppliersResult, coursesResult, academicYearResult] = await Promise.allSettled([
        StudentService.getAll(1),
        PartnerService.getCustomers(1),
        PartnerService.getSuppliers(1),
        CourseService.getAll(1),
        AcademicYearService.getCurrent(),
      ]);

      setStats({
        students: studentsResult.status === 'fulfilled' ? studentsResult.value.length : 0,
        customers: customersResult.status === 'fulfilled' ? customersResult.value.length : 0,
        suppliers: suppliersResult.status === 'fulfilled' ? suppliersResult.value.length : 0,
        courses: coursesResult.status === 'fulfilled' ? coursesResult.value.length : 0,
        currentAcademicYear: academicYearResult.status === 'fulfilled' ? academicYearResult.value : null,
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
    <div className="min-h-screen">
      <Header />
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <ModernDashboard stats={stats} user={user} />
      </main>
    </div>
  );
}
