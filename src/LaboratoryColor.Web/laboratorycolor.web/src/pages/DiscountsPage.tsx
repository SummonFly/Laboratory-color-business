import { useState } from 'react';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useDiscounts, useDeleteDiscount, useCreateDiscount, useUpdateDiscount } from '../hooks/useDiscounts';
import { DiscountForm } from '../components/discounts/DiscountForm';
import type { Discount } from '../types';
import type { CreateDiscountRequest, UpdateDiscountRequest } from '../api';
import { format } from 'date-fns';

export const DiscountsPage = () => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null);
    const [showActiveOnly, setShowActiveOnly] = useState(false);

    const { data: discounts, isLoading, error } = useDiscounts({
        isActive: showActiveOnly ? true : undefined,
    });
    const createDiscount = useCreateDiscount();
    const updateDiscount = useUpdateDiscount();
    const deleteDiscount = useDeleteDiscount();

    const handleSubmit = (data: CreateDiscountRequest | UpdateDiscountRequest) => {
        if (editingDiscount) {
            updateDiscount.mutate(data as UpdateDiscountRequest);
            setEditingDiscount(null);
        } else {
            createDiscount.mutate(data as CreateDiscountRequest);
        }
        setIsFormOpen(false);
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Are you sure you want to delete this discount?')) {
            deleteDiscount.mutate(id);
        }
    };

    const openEditForm = (discount: Discount) => {
        setEditingDiscount(discount);
        setIsFormOpen(true);
    };

    const openCreateForm = () => {
        setEditingDiscount(null);
        setIsFormOpen(true);
    };

    const closeForm = () => {
        setIsFormOpen(false);
        setEditingDiscount(null);
    };

    const formatDate = (dateString: string) => {
        try {
            return format(new Date(dateString), 'dd.MM.yyyy');
        } catch {
            return dateString;
        }
    };

    const isDiscountActive = (startDate: string, endDate: string): boolean => {
        const now = new Date();
        return new Date(startDate) <= now && new Date(endDate) >= now;
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
                Failed to load discounts. Please try again later.
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-950">Discounts & Coupons</h1>
                <button
                    onClick={openCreateForm}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700"
                >
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Create Discount
                </button>
            </div>

            {/* Filter */}
            <div className="mb-6">
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

            {/* Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Type
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Value
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Period
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Coupons
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {discounts?.map((discount) => {
                            const isActive = isDiscountActive(discount.startDate, discount.endDate) && discount.isActive;

                            return (
                                <tr key={discount.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-950">
                                        {discount.name}
                                        {discount.description && (
                                            <div className="text-xs text-gray-500">{discount.description}</div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {discount.discountType === 'Percentage' ? 'Percentage' : 'Fixed Amount'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        {discount.discountType === 'Percentage'
                                            ? `${discount.discountValue}%`
                                            : `$${discount.discountValue.toFixed(2)}`}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {formatDate(discount.startDate)} ? {formatDate(discount.endDate)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${isActive
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {discount.coupons.length > 0 ? (
                                            <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                                                {discount.coupons.length} coupons
                                            </span>
                                        ) : (
                                            '-'
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => openEditForm(discount)}
                                            className="text-primary-600 hover:text-primary-900 mr-3"
                                        >
                                            <PencilIcon className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(discount.id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            <TrashIcon className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {discounts?.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No discounts found. Click "Create Discount" to create one.</p>
                    </div>
                )}
            </div>

            {/* Form Modal */}
            <DiscountForm
                isOpen={isFormOpen}
                onClose={closeForm}
                onSubmit={handleSubmit}
                initialData={editingDiscount || undefined}
                isEditing={!!editingDiscount}
            />
        </div>
    );
};