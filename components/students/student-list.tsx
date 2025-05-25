'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loading } from '@/components/ui/loading';
import { StudentService } from '@/lib/odoo/services';
import { formatDate, getErrorMessage } from '@/lib/utils';
import { PlusIcon, UserIcon } from '@heroicons/react/24/outline';
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
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Students</h2>
        {onAddStudent && (
          <Button onClick={onAddStudent}>
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Student
          </Button>
        )}
      </div>

      {students.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <UserIcon className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No students found</h3>
            <p className="text-gray-500 text-center mb-4">
              Get started by adding your first student.
            </p>
            {onAddStudent && (
              <Button onClick={onAddStudent}>
                <PlusIcon className="w-4 h-4 mr-2" />
                Add Student
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {students.map((student) => (
            <Card key={student.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{student.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  {student.email && (
                    <p className="text-gray-600">
                      <strong>Email:</strong> {student.email}
                    </p>
                  )}
                  {student.phone && (
                    <p className="text-gray-600">
                      <strong>Phone:</strong> {student.phone}
                    </p>
                  )}
                  {student.student_id && (
                    <p className="text-gray-600">
                      <strong>Student ID:</strong> {student.student_id}
                    </p>
                  )}
                  {student.create_date && (
                    <p className="text-gray-500 text-xs">
                      <strong>Created:</strong> {formatDate(student.create_date)}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}