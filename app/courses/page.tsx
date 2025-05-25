'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth';
import { Header } from '@/components/layout/header';
import { CourseList } from '@/components/courses/course-list';
import { CourseForm } from '@/components/forms/course-form';
import { LoadingPage } from '@/components/ui/loading';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function CoursesPage() {
  const router = useRouter();
  const { checkAuth } = useAuthStore();
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!checkAuth()) {
      router.push('/login');
      return;
    }
    setIsLoading(false);
  }, [router, checkAuth]);

  if (isLoading) {
    return <LoadingPage text="Loading courses..." />;
  }

  const handleAddCourse = () => {
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    window.location.reload();
  };

  const handleFormCancel = () => {
    setShowForm(false);
  };

  return (
    <div>
      <Header />
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {!showForm ? (
          <>
            <div className="mb-6">
              <button
                onClick={() => router.push('/dashboard')}
                className="btn-outline mb-4 flex items-center"
              >
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Back to Dashboard
              </button>
            </div>
            <CourseList onAddCourse={handleAddCourse} />
          </>
        ) : (
          <div className="space-y-6">
            <div>
              <button
                onClick={handleFormCancel}
                className="btn-outline mb-4 flex items-center"
              >
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Back to Courses
              </button>
            </div>
            <CourseForm
              onSuccess={handleFormSuccess}
              onCancel={handleFormCancel}
            />
          </div>
        )}
      </main>
    </div>
  );
}
