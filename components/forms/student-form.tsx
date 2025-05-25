'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { StudentService } from '@/lib/odoo/services';
import { getErrorMessage } from '@/lib/utils';
import type { StudentFormData } from '@/types';

interface StudentFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function StudentForm({ onSuccess, onCancel }: StudentFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StudentFormData>();

  const onSubmit = async (data: StudentFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      await StudentService.create(data);
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
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Add New Student</h2>
        <p className="text-slate-600">Enter student information to create a new enrollment record.</p>
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

        {/* Personal Information Section */}
        <div className="form-section">
          <h3 className="form-section-title">
            <svg className="w-6 h-6 mr-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Personal Information
          </h3>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Full Name *
              </label>
              <input
                id="name"
                {...register('name', { required: 'Name is required' })}
                className="form-input"
                placeholder="Enter student's full name"
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
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                {...register('email')}
                className="form-input"
                placeholder="student@example.com"
              />
              {errors.email && (
                <p className="form-error">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="phone" className="form-label">
                Phone Number
              </label>
              <input
                id="phone"
                {...register('phone')}
                className="form-input"
                placeholder="+63 912 345 6789"
              />
              {errors.phone && (
                <p className="form-error">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="birth_date" className="form-label">
                Birth Date
              </label>
              <input
                id="birth_date"
                type="date"
                {...register('birth_date')}
                className="form-input"
              />
              {errors.birth_date && (
                <p className="form-error">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {errors.birth_date.message}
                </p>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="address" className="form-label">
              Complete Address
            </label>
            <textarea
              id="address"
              {...register('address')}
              className="form-textarea"
              rows={3}
              placeholder="Enter complete home address"
            />
            {errors.address && (
              <p className="form-error">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {errors.address.message}
              </p>
            )}
          </div>
        </div>

        {/* Academic Information Section */}
        <div className="form-section">
          <h3 className="form-section-title">
            <svg className="w-6 h-6 mr-3 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            </svg>
            Academic Information
          </h3>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="form-group">
              <label htmlFor="student_id" className="form-label">
                Student ID
              </label>
              <input
                id="student_id"
                {...register('student_id')}
                className="form-input"
                placeholder="e.g., 2024-001"
              />
              {errors.student_id && (
                <p className="form-error">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {errors.student_id.message}
                </p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="enrollment_date" className="form-label">
                Enrollment Date
              </label>
              <input
                id="enrollment_date"
                type="date"
                {...register('enrollment_date')}
                className="form-input"
              />
              {errors.enrollment_date && (
                <p className="form-error">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {errors.enrollment_date.message}
                </p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="section" className="form-label">
                Section
              </label>
              <input
                id="section"
                {...register('section')}
                className="form-input"
                placeholder="e.g., A, B, C"
              />
              {errors.section && (
                <p className="form-error">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {errors.section.message}
                </p>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="grade_level" className="form-label">
              Grade Level
            </label>
            <select
              id="grade_level"
              {...register('grade_level')}
              className="form-select"
            >
              <option value="">Select Grade Level</option>
              <option value="Grade 1">Grade 1</option>
              <option value="Grade 2">Grade 2</option>
              <option value="Grade 3">Grade 3</option>
              <option value="Grade 4">Grade 4</option>
              <option value="Grade 5">Grade 5</option>
              <option value="Grade 6">Grade 6</option>
              <option value="Grade 7">Grade 7</option>
              <option value="Grade 8">Grade 8</option>
              <option value="Grade 9">Grade 9</option>
              <option value="Grade 10">Grade 10</option>
              <option value="Grade 11">Grade 11</option>
              <option value="Grade 12">Grade 12</option>
            </select>
            {errors.grade_level && (
              <p className="form-error">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {errors.grade_level.message}
              </p>
            )}
          </div>
        </div>

        {/* Guardian Information Section */}
        <div className="form-section">
          <h3 className="form-section-title">
            <svg className="w-6 h-6 mr-3 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Guardian Information
          </h3>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="form-group">
              <label htmlFor="guardian_name" className="form-label">
                Guardian Name *
              </label>
              <input
                id="guardian_name"
                {...register('guardian_name', { required: 'Guardian name is required' })}
                className="form-input"
                placeholder="Enter guardian's full name"
              />
              {errors.guardian_name && (
                <p className="form-error">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {errors.guardian_name.message}
                </p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="guardian_phone" className="form-label">
                Guardian Phone *
              </label>
              <input
                id="guardian_phone"
                {...register('guardian_phone', { required: 'Guardian phone is required' })}
                className="form-input"
                placeholder="+63 912 345 6789"
              />
              {errors.guardian_phone && (
                <p className="form-error">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {errors.guardian_phone.message}
                </p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="guardian_email" className="form-label">
                Guardian Email
              </label>
              <input
                id="guardian_email"
                type="email"
                {...register('guardian_email')}
                className="form-input"
                placeholder="guardian@example.com"
              />
              {errors.guardian_email && (
                <p className="form-error">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {errors.guardian_email.message}
                </p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="emergency_contact" className="form-label">
                Emergency Contact
              </label>
              <input
                id="emergency_contact"
                {...register('emergency_contact')}
                className="form-input"
                placeholder="Name and phone number"
              />
              {errors.emergency_contact && (
                <p className="form-error">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {errors.emergency_contact.message}
                </p>
              )}
            </div>
          </div>
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
                Creating Student...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create Student
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
