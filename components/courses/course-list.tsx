'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loading } from '@/components/ui/loading';
import { CourseService } from '@/lib/odoo/services';
import { formatDate, getErrorMessage } from '@/lib/utils';
import {
  PlusIcon,
  BookOpenIcon,
  UserGroupIcon,
  ClockIcon,
  MapPinIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import type { Course } from '@/types';

interface CourseListProps {
  onAddCourse?: () => void;
}

export function CourseList({ onAddCourse }: CourseListProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCourses = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await CourseService.getAll();
      setCourses(result.records);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  if (isLoading) {
    return <Loading text="Loading courses..." />;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        Error loading courses: {error}
        <button onClick={loadCourses} className="btn-outline ml-2 px-4 py-2 text-sm">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Courses</h2>
          <p className="text-gray-600 mt-1">Manage course offerings</p>
        </div>
        {onAddCourse && (
          <button
            onClick={onAddCourse}
            className="btn-primary flex items-center"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Course
          </button>
        )}
      </div>

      {courses.length === 0 ? (
        <div className="card">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <BookOpenIcon className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-600 text-center mb-6">
              Get started by adding your first course to the system.
            </p>
            {onAddCourse && (
              <Button
                onClick={onAddCourse}
                className="btn-primary flex items-center"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Add Your First Course
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <div key={course.id} className="card p-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <BookOpenIcon className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{course.name}</h3>
                  <span className="badge-success">{course.code || 'No Code'}</span>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                {course.description && (
                  <p className="text-gray-600">{course.description}</p>
                )}

                {course.credits && (
                  <div className="flex items-center text-gray-600">
                    <BookOpenIcon className="w-4 h-4 mr-2 text-gray-400" />
                    <span>{course.credits} Credits</span>
                  </div>
                )}

                {course.max_students && (
                  <div className="flex items-center text-gray-600">
                    <UserGroupIcon className="w-4 h-4 mr-2 text-gray-400" />
                    <span>{course.enrolled_students || 0}/{course.max_students} Students</span>
                  </div>
                )}

                {course.schedule && (
                  <div className="flex items-center text-gray-600">
                    <ClockIcon className="w-4 h-4 mr-2 text-gray-400" />
                    <span>{course.schedule}</span>
                  </div>
                )}

                {course.room && (
                  <div className="flex items-center text-gray-600">
                    <MapPinIcon className="w-4 h-4 mr-2 text-gray-400" />
                    <span>{course.room}</span>
                  </div>
                )}

                {course.fee_amount && (
                  <div className="flex items-center text-gray-600">
                    <CurrencyDollarIcon className="w-4 h-4 mr-2 text-gray-400" />
                    <span>₱{course.fee_amount.toLocaleString()}</span>
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
