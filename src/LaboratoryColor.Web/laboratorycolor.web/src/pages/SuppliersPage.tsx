import { useState } from 'react';
import { PencilIcon, TrashIcon, PlusIcon, MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { useSuppliers, useDeleteSupplier, useCreateSupplier, useUpdateSupplier } from '../hooks/useSuppliers';
import { SupplierForm } from '../components/suppliers/SupplierForm';
import type { Supplier } from '../types';
import type { CreateSupplierRequest, UpdateSupplierRequest } from '../api';

export const SuppliersPage = () => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showActiveOnly, setShowActiveOnly] = useState(false);
    const [debouncedSearch, setDebouncedSearch] = useState('');

    const { data: suppliers, isLoading, error } = useSuppliers({
        isActive: showActiveOnly ? true : undefined,
        search: debouncedSearch || undefined,
    });
    const createSupplier = useCreateSupplier();
    const updateSupplier = useUpdateSupplier();
    const deleteSupplier = useDeleteSupplier();

    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
        const timeout = setTimeout(() => setDebouncedSearch(value), 500);
        return () => clearTimeout(timeout);
    };

    const handleSubmit = (data: CreateSupplierRequest | UpdateSupplierRequest) => {
        if (editingSupplier) {
            updateSupplier.mutate(data as UpdateSupplierRequest);
            setEditingSupplier(null);
        } else {
            createSupplier.mutate(data as CreateSupplierRequest);
        }
        setIsFormOpen(false);
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Are you sure you want to delete this supplier?')) {
            deleteSupplier.mutate(id);
        }
    };

    const openEditForm = (supplier: Supplier) => {
        setEditingSupplier(supplier);
        setIsFormOpen(true);
    };

    const openCreateForm = () => {
        setEditingSupplier(null);
        setIsFormOpen(true);
    };

    const closeForm = () => {
        setIsFormOpen(false);
        setEditingSupplier(null);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                Failed to load suppliers. Please try again later.
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Suppliers</h1>
                <button
                    onClick={openCreateForm}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700"
                >
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Add Supplier
                </button>
            </div>

            {/* Filters */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name, contact person, email..."
                        value={searchTerm}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <FunnelIcon className="w-5 h-5 text-gray-400" />
                    <label className="inline-flex items-center">
                        <input
                            type="checkbox"
                            checked={showActiveOnly}
                            onChange={(e) => setShowActiveOnly(e.target.checked)}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">Show active only</span>
                    </label>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Contact
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Phone / Email
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Orders
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {suppliers?.map((supplier) => (
                            <tr key={supplier.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {supplier.id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {supplier.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {supplier.contactPerson || '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <div>{supplier.phone || '-'}</div>
                                    <div className="text-xs">{supplier.email || '-'}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${supplier.isActive
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        {supplier.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {supplier.purchaseOrdersCount}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => openEditForm(supplier)}
                                        className="text-primary-600 hover:text-primary-900 mr-3"
                                    >
                                        <PencilIcon className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(supplier.id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {suppliers?.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No suppliers found. Try adjusting your filters or add a new supplier.</p>
                    </div>
                )}
            </div>

            <SupplierForm
                isOpen={isFormOpen}
                onClose={closeForm}
                onSubmit={handleSubmit}
                initialData={editingSupplier || undefined}
                isEditing={!!editingSupplier}
            />
        </div>
    );
};