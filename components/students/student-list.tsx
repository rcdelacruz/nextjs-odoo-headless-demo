'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loading } from '@/components/ui/loading';
import { StudentService } from '@/lib/odoo/services';
import { formatDate, getErrorMessage } from '@/lib/utils';

// Helper function to parse enhanced student data from comment field
function parseStudentData(comment: string) {
  const data: any = {};
  if (!comment) return data;

  const parts = comment.split(' | ');
  parts.forEach(part => {
    if (part.includes('Student ID:')) data.student_id = part.split('Student ID:')[1]?.trim();
    if (part.includes('Grade:')) data.grade_level = part.split('Grade:')[1]?.trim();
    if (part.includes('Section:')) data.section = part.split('Section:')[1]?.trim();
    if (part.includes('Guardian:') && !part.includes('Guardian Phone:') && !part.includes('Guardian Email:')) {
      data.guardian_name = part.split('Guardian:')[1]?.trim();
    }
    if (part.includes('Guardian Phone:')) data.guardian_phone = part.split('Guardian Phone:')[1]?.trim();
    if (part.includes('Guardian Email:')) data.guardian_email = part.split('Guardian Email:')[1]?.trim();
    if (part.includes('Birth Date:')) data.birth_date = part.split('Birth Date:')[1]?.trim();
    if (part.includes('Emergency:')) data.emergency_contact = part.split('Emergency:')[1]?.trim();
    if (part.includes('Enrolled:')) data.enrollment_date = part.split('Enrolled:')[1]?.trim();
  });

  return data;
}
import {
  PlusIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  AcademicCapIcon,
  CalendarIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
import type { Student } from '@/types';

interface StudentListProps {
  onAddStudent?: () => void;
}

export function StudentList({ onAddStudent }: StudentListProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStudents = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await StudentService.getAll();
      setStudents(result.records);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  if (isLoading) {
    return <Loading text="Loading students..." />;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        Error loading students: {error}
        <Button variant="outline" size="sm" onClick={loadStudents} className="ml-2">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
        <div className="mb-6 lg:mb-0">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Students</h2>
          <p className="text-slate-600">Manage student enrollment and information</p>
        </div>
        {onAddStudent && (
          <button
            onClick={onAddStudent}
            className="btn-primary flex items-center"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Add New Student
          </button>
        )}
      </div>

      {students.length === 0 ? (
        <div className="card">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <AcademicCapIcon className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No students found</h3>
            <p className="text-gray-600 text-center mb-6">
              Get started by adding your first student to the system.
            </p>
            {onAddStudent && (
              <button
                onClick={onAddStudent}
                className="btn-primary flex items-center"
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Add Your First Student
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {students.map((student) => {
            // Parse enhanced data from comment field
            const enhancedData = parseStudentData(student.comment || '');

            return (
              <div key={student.id} className="card-interactive p-6 group">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <AcademicCapIcon className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{student.name}</h3>
                    <span className="badge-info">Student</span>
                  </div>
                </div>

                <div className="space-y-3">
                  {enhancedData.student_id && (
                    <div className="flex items-center text-slate-600 bg-slate-50 rounded-lg p-3">
                      <UserIcon className="w-5 h-5 mr-3 text-blue-500" />
                      <span className="font-medium">ID: {enhancedData.student_id}</span>
                    </div>
                  )}
                  {enhancedData.grade_level && (
                    <div className="flex items-center text-gray-600">
                      <AcademicCapIcon className="w-4 h-4 mr-2 text-gray-400" />
                      <span>{enhancedData.grade_level} {enhancedData.section && `- Section ${enhancedData.section}`}</span>
                    </div>
                  )}
                  {student.email && (
                    <div className="flex items-center text-gray-600">
                      <EnvelopeIcon className="w-4 h-4 mr-2 text-gray-400" />
                      <span>{student.email}</span>
                    </div>
                  )}
                  {student.phone && (
                    <div className="flex items-center text-gray-600">
                      <PhoneIcon className="w-4 h-4 mr-2 text-gray-400" />
                      <span>{student.phone}</span>
                    </div>
                  )}
                  {student.mobile && student.mobile !== student.phone && (
                    <div className="flex items-center text-gray-600">
                      <PhoneIcon className="w-4 h-4 mr-2 text-gray-400" />
                      <span>Mobile: {student.mobile}</span>
                    </div>
                  )}
                  {enhancedData.guardian_name && (
                    <div className="flex items-center text-gray-600">
                      <UserIcon className="w-4 h-4 mr-2 text-gray-400" />
                      <span>Guardian: {enhancedData.guardian_name}</span>
                    </div>
                  )}
                  {student.street && (
                    <div className="flex items-center text-gray-600">
                      <MapPinIcon className="w-4 h-4 mr-2 text-gray-400" />
                      <span>{student.street}</span>
                    </div>
                  )}
                  <div className="mt-2">
                    <span className="badge-success">Enrolled</span>
                    <span className="ml-2 badge-warning">Pending Payment</span>
                  </div>
                  {student.create_date && (
                    <div className="flex items-center text-gray-500">
                      <CalendarIcon className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-xs">Enrolled: {formatDate(student.create_date)}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
