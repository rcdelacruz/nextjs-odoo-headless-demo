'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth';
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingPage, Loading } from '@/components/ui/loading';
import { PartnerService } from '@/lib/odoo/services';
import { formatDate, getErrorMessage } from '@/lib/utils';
import { ArrowLeftIcon, UserGroupIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';
import type { Partner } from '@/types';

export default function PartnersPage() {
  const router = useRouter();
  const { checkAuth } = useAuthStore();
  const [customers, setCustomers] = useState<Partner[]>([]);
  const [suppliers, setSuppliers] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!checkAuth()) {
      router.push('/login');
      return;
    }
    loadPartners();
  }, [router, checkAuth]);

  const loadPartners = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [customersResult, suppliersResult] = await Promise.allSettled([
        PartnerService.getCustomers(20),
        PartnerService.getSuppliers(20),
      ]);

      if (customersResult.status === 'fulfilled') {
        setCustomers(customersResult.value.records);
      }

      if (suppliersResult.status === 'fulfilled') {
        setSuppliers(suppliersResult.value.records);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingPage text="Loading partners..." />;
  }

  if (error) {
    return (
      <div>
        <Header />
        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            Error loading partners: {error}
            <button onClick={loadPartners} className="btn-outline ml-2 px-4 py-2 text-sm">
              Retry
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <button
            onClick={() => router.push('/dashboard')}
            className="btn-outline mb-4 flex items-center"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Partners</h1>
          <p className="text-gray-600 mt-2">
            Manage your customers and suppliers
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Customers */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <UserGroupIcon className="w-5 h-5 mr-2" />
              Customers ({customers.length})
            </h2>

            {customers.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <UserGroupIcon className="w-12 h-12 text-gray-400 mb-4" />
                  <p className="text-gray-500">No customers found</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {customers.map((customer) => (
                  <Card key={customer.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center">
                        {customer.is_company ? (
                          <BuildingOfficeIcon className="w-4 h-4 mr-2 text-blue-600" />
                        ) : (
                          <UserGroupIcon className="w-4 h-4 mr-2 text-green-600" />
                        )}
                        {customer.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        {customer.email && (
                          <p className="text-gray-600">
                            <strong>Email:</strong> {customer.email}
                          </p>
                        )}
                        {customer.phone && (
                          <p className="text-gray-600">
                            <strong>Phone:</strong> {customer.phone}
                          </p>
                        )}
                        <p className="text-gray-500 text-xs">
                          <strong>Type:</strong> {customer.is_company ? 'Company' : 'Individual'}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Suppliers */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <BuildingOfficeIcon className="w-5 h-5 mr-2" />
              Suppliers ({suppliers.length})
            </h2>

            {suppliers.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <BuildingOfficeIcon className="w-12 h-12 text-gray-400 mb-4" />
                  <p className="text-gray-500">No suppliers found</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {suppliers.map((supplier) => (
                  <Card key={supplier.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center">
                        {supplier.is_company ? (
                          <BuildingOfficeIcon className="w-4 h-4 mr-2 text-blue-600" />
                        ) : (
                          <UserGroupIcon className="w-4 h-4 mr-2 text-green-600" />
                        )}
                        {supplier.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        {supplier.email && (
                          <p className="text-gray-600">
                            <strong>Email:</strong> {supplier.email}
                          </p>
                        )}
                        {supplier.phone && (
                          <p className="text-gray-600">
                            <strong>Phone:</strong> {supplier.phone}
                          </p>
                        )}
                        <p className="text-gray-500 text-xs">
                          <strong>Type:</strong> {supplier.is_company ? 'Company' : 'Individual'}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
