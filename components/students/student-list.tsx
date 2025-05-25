'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loading } from '@/components/ui/loading';
import { StudentService } from '@/lib/odoo/services';
import { formatDate, getErrorMessage } from '@/lib/utils';
import {
  PlusIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  AcademicCapIcon,
  CalendarIcon
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
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Students</h2>
          <p className="text-gray-600 mt-1">Manage student records</p>
        </div>
        {onAddStudent && (
          <Button
            onClick={onAddStudent}
            className="btn-primary flex items-center"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Student
          </Button>
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
              <Button
                onClick={onAddStudent}
                className="btn-primary flex items-center"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Add Your First Student
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {students.map((student) => (
            <div key={student.id} className="card p-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <AcademicCapIcon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{student.name}</h3>
                  <span className="badge-info">Student</span>
                </div>
              </div>

              <div className="space-y-2 text-sm">
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
                {student.create_date && (
                  <div className="flex items-center text-gray-500">
                    <CalendarIcon className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="text-xs">{formatDate(student.create_date)}</span>
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
