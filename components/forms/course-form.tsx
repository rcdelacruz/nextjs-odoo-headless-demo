'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CourseService } from '@/lib/odoo/services';
import { getErrorMessage } from '@/lib/utils';
import type { Course } from '@/types';

interface CourseFormData {
  name: string;
  code?: string;
  description?: string;
  credits?: number;
  max_students?: number;
  schedule?: string;
  room?: string;
  prerequisites?: string;
  fee_amount?: number;
}

interface CourseFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CourseForm({ onSuccess, onCancel }: CourseFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CourseFormData>();

  const onSubmit = async (data: CourseFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      await CourseService.create({
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
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Add New Course</h2>
        <p className="text-slate-600">Create a new course offering for the academic program.</p>
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

        {/* Course Information Section */}
        <div className="form-section">
          <h3 className="form-section-title">
            <svg className="w-6 h-6 mr-3 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Course Information
          </h3>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Course Name *
              </label>
              <input
                id="name"
                {...register('name', { required: 'Course name is required' })}
                className="form-input"
                placeholder="Enter course name"
              />
              {errors.name && (
                <p className="form-error">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="code" className="form-label">
                Course Code
              </label>
              <input
                id="code"
                {...register('code')}
                className="form-input"
                placeholder="e.g., MATH101"
              />
              {errors.code && (
                <p className="form-error">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {errors.code.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            {...register('description')}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            rows={3}
            placeholder="Course description"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="credits" className="block text-sm font-medium text-gray-700">
              Credits
            </label>
            <Input
              id="credits"
              type="number"
              {...register('credits', { valueAsNumber: true })}
              className="mt-1"
              min="1"
              max="10"
            />
            {errors.credits && (
              <p className="mt-1 text-sm text-red-600">{errors.credits.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="max_students" className="block text-sm font-medium text-gray-700">
              Max Students
            </label>
            <Input
              id="max_students"
              type="number"
              {...register('max_students', { valueAsNumber: true })}
              className="mt-1"
              min="1"
              max="100"
            />
            {errors.max_students && (
              <p className="mt-1 text-sm text-red-600">{errors.max_students.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="schedule" className="block text-sm font-medium text-gray-700">
              Schedule
            </label>
            <Input
              id="schedule"
              {...register('schedule')}
              className="mt-1"
              placeholder="e.g., MWF 9:00-10:00 AM"
            />
            {errors.schedule && (
              <p className="mt-1 text-sm text-red-600">{errors.schedule.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="room" className="block text-sm font-medium text-gray-700">
              Room
            </label>
            <Input
              id="room"
              {...register('room')}
              className="mt-1"
              placeholder="e.g., Room 101"
            />
            {errors.room && (
              <p className="mt-1 text-sm text-red-600">{errors.room.message}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="prerequisites" className="block text-sm font-medium text-gray-700">
            Prerequisites
          </label>
          <Input
            id="prerequisites"
            {...register('prerequisites')}
            className="mt-1"
            placeholder="Required courses or skills"
          />
          {errors.prerequisites && (
            <p className="mt-1 text-sm text-red-600">{errors.prerequisites.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="fee_amount" className="block text-sm font-medium text-gray-700">
            Course Fee (₱)
          </label>
          <Input
            id="fee_amount"
            type="number"
            {...register('fee_amount', { valueAsNumber: true })}
            className="mt-1"
            min="0"
            step="0.01"
            placeholder="0.00"
          />
          {errors.fee_amount && (
            <p className="mt-1 text-sm text-red-600">{errors.fee_amount.message}</p>
          )}
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
                Creating Course...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create Course
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
