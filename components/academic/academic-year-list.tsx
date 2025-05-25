'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loading } from '@/components/ui/loading';
import { AcademicYearService } from '@/lib/odoo/services';
import { formatDate, getErrorMessage } from '@/lib/utils';
import {
  PlusIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import type { AcademicYear } from '@/types';

interface AcademicYearListProps {
  onAddAcademicYear?: () => void;
}

export function AcademicYearList({ onAddAcademicYear }: AcademicYearListProps) {
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAcademicYears = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await AcademicYearService.getAll();
      setAcademicYears(result.records);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAcademicYears();
  }, []);

  if (isLoading) {
    return <Loading text="Loading academic years..." />;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        Error loading academic years: {error}
        <button onClick={loadAcademicYears} className="btn-outline ml-2 px-4 py-2 text-sm">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Academic Years</h2>
          <p className="text-gray-600 mt-1">Manage academic year periods</p>
        </div>
        {onAddAcademicYear && (
          <button
            onClick={onAddAcademicYear}
            className="btn-primary flex items-center"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Academic Year
          </button>
        )}
      </div>

      {academicYears.length === 0 ? (
        <div className="card">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <CalendarIcon className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No academic years found</h3>
            <p className="text-gray-600 text-center mb-6">
              Get started by adding your first academic year to the system.
            </p>
            {onAddAcademicYear && (
              <Button
                onClick={onAddAcademicYear}
                className="btn-primary flex items-center"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Add Your First Academic Year
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {academicYears.map((academicYear) => (
            <div key={academicYear.id} className="card p-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${academicYear.is_current ? 'bg-green-100' : 'bg-blue-100'
                  }`}>
                  {academicYear.is_current ? (
                    <CheckCircleIcon className="w-5 h-5 text-green-600" />
                  ) : (
                    <CalendarIcon className="w-5 h-5 text-blue-600" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{academicYear.name}</h3>
                  <span className={`badge-${academicYear.is_current ? 'success' : 'info'}`}>
                    {academicYear.is_current ? 'Current' : 'Inactive'}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center text-gray-600">
                  <CalendarIcon className="w-4 h-4 mr-2 text-gray-400" />
                  <span>
                    {new Date(academicYear.start_date).toLocaleDateString()} - {new Date(academicYear.end_date).toLocaleDateString()}
                  </span>
                </div>

                {academicYear.enrollment_start && academicYear.enrollment_end && (
                  <div className="flex items-center text-gray-600">
                    <ClockIcon className="w-4 h-4 mr-2 text-gray-400" />
                    <span>
                      Enrollment: {new Date(academicYear.enrollment_start).toLocaleDateString()} - {new Date(academicYear.enrollment_end).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
