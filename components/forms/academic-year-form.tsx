'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { AcademicYearService } from '@/lib/odoo/services';
import { getErrorMessage } from '@/lib/utils';
import type { AcademicYear } from '@/types';

interface AcademicYearFormData {
  name: string;
  start_date: string;
  end_date: string;
  enrollment_start?: string;
  enrollment_end?: string;
  is_current?: boolean;
}

interface AcademicYearFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function AcademicYearForm({ onSuccess, onCancel }: AcademicYearFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<AcademicYearFormData>();

  const startDate = watch('start_date');
  const endDate = watch('end_date');

  const onSubmit = async (data: AcademicYearFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      await AcademicYearService.create({
        ...data,
        active: true,
      });
      onSuccess?.();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Add New Academic Year</h2>
        <p className="text-slate-600">Define the academic year period and enrollment dates.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <div className="bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-200 text-red-800 px-6 py-4 rounded-xl font-medium flex items-center">
            <svg className="w-5 h-5 mr-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Academic Year Name *
          </label>
          <Input
            id="name"
            {...register('name', { required: 'Academic year name is required' })}
            className="mt-1"
            placeholder="e.g., 2024-2025"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">
              Start Date *
            </label>
            <Input
              id="start_date"
              type="date"
              {...register('start_date', { required: 'Start date is required' })}
              className="mt-1"
            />
            {errors.start_date && (
              <p className="mt-1 text-sm text-red-600">{errors.start_date.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="end_date" className="block text-sm font-medium text-gray-700">
              End Date *
            </label>
            <Input
              id="end_date"
              type="date"
              {...register('end_date', {
                required: 'End date is required',
                validate: (value) => {
                  if (startDate && value && new Date(value) <= new Date(startDate)) {
                    return 'End date must be after start date';
                  }
                  return true;
                }
              })}
              className="mt-1"
            />
            {errors.end_date && (
              <p className="mt-1 text-sm text-red-600">{errors.end_date.message}</p>
            )}
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Enrollment Period (Optional)</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="enrollment_start" className="block text-sm font-medium text-gray-700">
                Enrollment Start Date
              </label>
              <Input
                id="enrollment_start"
                type="date"
                {...register('enrollment_start')}
                className="mt-1"
              />
              {errors.enrollment_start && (
                <p className="mt-1 text-sm text-red-600">{errors.enrollment_start.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="enrollment_end" className="block text-sm font-medium text-gray-700">
                Enrollment End Date
              </label>
              <Input
                id="enrollment_end"
                type="date"
                {...register('enrollment_end')}
                className="mt-1"
              />
              {errors.enrollment_end && (
                <p className="mt-1 text-sm text-red-600">{errors.enrollment_end.message}</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <input
            id="is_current"
            type="checkbox"
            {...register('is_current')}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="is_current" className="ml-2 block text-sm text-gray-900">
            Set as current academic year
          </label>
        </div>

        {/* Form Buttons */}
        <div className="form-buttons">
          <button
            type="submit"
            disabled={isLoading}
            className="form-button-primary"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Academic Year...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create Academic Year
              </div>
            )}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="form-button-secondary"
            >
              <div className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancel
              </div>
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
