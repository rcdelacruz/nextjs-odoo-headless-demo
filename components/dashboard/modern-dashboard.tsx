'use client';

import { useRouter } from 'next/navigation';
import {
  AcademicCapIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  BookOpenIcon,
  CalendarIcon,
  ChartBarIcon,
  CogIcon,
  BellIcon,
  PlusIcon,
  ArrowTrendingUpIcon,
  UsersIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

interface DashboardStats {
  students: number;
  customers: number;
  suppliers: number;
  courses: number;
  currentAcademicYear: any;
}

interface ModernDashboardProps {
  stats: DashboardStats;
  user: any;
}

export function ModernDashboard({ stats, user }: ModernDashboardProps) {
  const router = useRouter();

  const statsCards = [
    {
      title: 'Students',
      value: stats.students,
      subtitle: 'Active enrollment',
      icon: AcademicCapIcon,
      color: 'blue',
      trend: '+12%',
      href: '/students'
    },
    {
      title: 'Courses',
      value: stats.courses,
      subtitle: 'Available courses',
      icon: BookOpenIcon,
      color: 'purple',
      trend: '+3%',
      href: '/courses'
    },
    {
      title: 'Partners',
      value: stats.customers,
      subtitle: 'Active customers',
      icon: UsersIcon,
      color: 'emerald',
      trend: '+8%',
      href: '/partners'
    },
    {
      title: 'Suppliers',
      value: stats.suppliers,
      subtitle: 'Business partners',
      icon: BuildingOfficeIcon,
      color: 'amber',
      trend: '+5%',
      href: '/partners'
    }
  ];

  const quickActions = [
    {
      title: 'Add Student',
      description: 'Register new student',
      icon: AcademicCapIcon,
      color: 'blue',
      href: '/students'
    },
    {
      title: 'Create Course',
      description: 'Add new course',
      icon: BookOpenIcon,
      color: 'purple',
      href: '/courses'
    },
    {
      title: 'Manage Academic Year',
      description: 'Setup academic periods',
      icon: CalendarIcon,
      color: 'cyan',
      href: '/academic-years'
    },
    {
      title: 'View Reports',
      description: 'Analytics & insights',
      icon: ChartBarIcon,
      color: 'emerald',
      href: '/dashboard'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Welcome back, {user?.username || 'Admin'}
          </h1>
          <p className="text-slate-600 mt-2">
            Here's what's happening with your EduCore ERP system today.
          </p>
        </div>
        <div className="flex items-center space-x-4 mt-6 lg:mt-0">
          <button className="btn-outline flex items-center">
            <BellIcon className="w-5 h-5 mr-2" />
            Notifications
          </button>
          <button className="btn-primary flex items-center">
            <PlusIcon className="w-5 h-5 mr-2" />
            Quick Add
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((card, index) => (
          <div
            key={index}
            className="stats-card group cursor-pointer"
            onClick={() => router.push(card.href)}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
                  {card.title}
                </p>
                <p className="text-3xl font-bold text-slate-900 mt-2">
                  {card.value}
                </p>
                <div className="flex items-center mt-2">
                  <span className="text-sm text-emerald-600 font-medium flex items-center">
                    <ArrowTrendingUpIcon className="w-4 h-4 mr-1" />
                    {card.trend}
                  </span>
                  <span className="text-sm text-slate-500 ml-2">{card.subtitle}</span>
                </div>
              </div>
              <div className={`w-16 h-16 bg-gradient-to-br from-${card.color}-500 to-${card.color}-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <card.icon className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Academic Year Banner */}
      {stats.currentAcademicYear && (
        <div className="card-elevated p-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Current Academic Year
              </h3>
              <p className="text-2xl font-bold text-blue-600 mb-1">
                {stats.currentAcademicYear.name}
              </p>
              <p className="text-slate-600 flex items-center">
                <ClockIcon className="w-4 h-4 mr-2" />
                {new Date(stats.currentAcademicYear.start_date).toLocaleDateString()} - {new Date(stats.currentAcademicYear.end_date).toLocaleDateString()}
              </p>
            </div>
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-xl">
              <CalendarIcon className="w-10 h-10 text-white" />
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card-elevated">
          <div className="p-6 border-b border-slate-100">
            <h3 className="text-xl font-bold text-slate-900">Quick Actions</h3>
            <p className="text-slate-600 mt-1">Frequently used operations</p>
          </div>
          <div className="p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => router.push(action.href)}
                  className="card-interactive p-4 text-left group"
                >
                  <div className="flex items-center mb-3">
                    <div className={`w-10 h-10 bg-gradient-to-br from-${action.color}-500 to-${action.color}-600 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform`}>
                      <action.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">{action.title}</h4>
                      <p className="text-sm text-slate-600">{action.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="card-elevated">
          <div className="p-6 border-b border-slate-100">
            <h3 className="text-xl font-bold text-slate-900">System Status</h3>
            <p className="text-slate-600 mt-1">Current system information</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl">
                <span className="text-slate-700 font-semibold">Database</span>
                <span className="badge-info">{user?.db || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl">
                <span className="text-slate-700 font-semibold">User ID</span>
                <span className="badge-neutral">{user?.uid || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl">
                <span className="text-slate-700 font-semibold">Session Status</span>
                <span className="badge-success flex items-center">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse"></div>
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
                <span className="text-slate-700 font-semibold">Odoo Version</span>
                <span className="badge-info">18.0</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
