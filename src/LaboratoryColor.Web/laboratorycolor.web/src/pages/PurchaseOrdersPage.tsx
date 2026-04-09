import { useState } from 'react';
import { PlusIcon, EyeIcon, ArchiveBoxArrowDownIcon } from '@heroicons/react/24/outline';
import { usePurchaseOrders, useUpdatePurchaseOrderStatus, useReceivePurchaseOrder, useCreatePurchaseOrder } from '../hooks/usePurchaseOrders';
import { PurchaseOrderForm } from '../components/purchaseOrders/PurchaseOrderForm';
import { ReceiveOrderModal } from '../components/purchaseOrders/ReceiveOrderModal';
import type { CreatePurchaseOrderRequest, ReceivePurchaseOrderRequest, PurchaseOrderStatus } from '../api';
import { format } from 'date-fns';

type StatusColor = {
    [key in PurchaseOrderStatus]: string;
};

const statusColors: StatusColor = {
    'Pending': 'bg-yellow-100 text-yellow-800',
    'Processing': 'bg-blue-100 text-blue-800',
    'Shipped': 'bg-purple-100 text-purple-800',
    'Delivered': 'bg-green-100 text-green-800',
    'Cancelled': 'bg-red-100 text-red-800',
};

const statusOrder: PurchaseOrderStatus[] = ['Pending', 'Processing', 'Shipped', 'Delivered'];


export const PurchaseOrdersPage = () => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

    const [statusFilter, setStatusFilter] = useState('');
    const [supplierFilter, setSupplierFilter] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');

    const { data: orders, isLoading, error } = usePurchaseOrders({
        status: statusFilter as PurchaseOrderStatus || undefined,
        supplierId: supplierFilter ? parseInt(supplierFilter) : undefined,
        fromDate: fromDate || undefined,
        toDate: toDate || undefined,
    });

    const updateStatus = useUpdatePurchaseOrderStatus();
    const receiveOrder = useReceivePurchaseOrder();
    const createOrder = useCreatePurchaseOrder();

    const selectedOrder = orders?.find(o => o.id === selectedOrderId) || null;

    const handleCreateOrder = (data: CreatePurchaseOrderRequest) => {
        createOrder.mutate(data);
        setIsFormOpen(false);
    };

    const handleUpdateStatus = (orderId: number, newStatus: PurchaseOrderStatus) => {
        if (window.confirm(`Change order status to ${newStatus}?`)) {
            updateStatus.mutate({ purchaseOrderId: orderId, status: newStatus });
        }
    };

    const handleReceiveOrder = (data: ReceivePurchaseOrderRequest) => {
        receiveOrder.mutate(data);
        setIsReceiveModalOpen(false);
        setSelectedOrderId(null);
    };

    const openReceiveModal = (orderId: number) => {
        setSelectedOrderId(orderId);
        setIsReceiveModalOpen(true);
    };

    const getNextStatus = (currentStatus: PurchaseOrderStatus): PurchaseOrderStatus | null => {
        const currentIndex = statusOrder.indexOf(currentStatus);
        if (currentIndex === -1 || currentIndex === statusOrder.length - 1) return null;
        return statusOrder[currentIndex + 1];
    };

    const formatDate = (dateString: string) => {
        try {
            return format(new Date(dateString), 'dd.MM.yyyy');
        } catch {
            return dateString;
        }
    };

    const resetFilters = () => {
        setStatusFilter('');
        setSupplierFilter('');
        setFromDate('');
        setToDate('');
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
                Failed to load purchase orders. Please try again later.
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-black">Purchase Orders</h1>
                <button
                    onClick={() => setIsFormOpen(true)}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700"
                >
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Create Order
                </button>
            </div>

            {/* Filters */}
            <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                >
                    <option value="">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                </select>

                <input
                    type="number"
                    placeholder="Supplier ID"
                    value={supplierFilter}
                    onChange={(e) => setSupplierFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />

                <input
                    type="date"
                    placeholder="From Date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />

                <input
                    type="date"
                    placeholder="To Date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />

                <button
                    onClick={resetFilters}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                    Reset Filters
                </button>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Order #
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Supplier
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Expected
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Total
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {orders?.map((order) => {
                            const nextStatus = getNextStatus(order.status);

                            return (
                                <tr key={order.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {order.orderNumber}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {order.supplierName}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatDate(order.orderedDate)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {order.expectedDeliveryDate ? formatDate(order.expectedDeliveryDate) : '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        ${order.totalAmount.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusColors[order.status]}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end gap-2">
                                            {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                                                <button
                                                    onClick={() => openReceiveModal(order.id)}
                                                    className="text-green-600 hover:text-green-900"
                                                    title="Receive Goods"
                                                >
                                                    <ArchiveBoxArrowDownIcon className="w-5 h-5" />
                                                </button>
                                            )}
                                            {nextStatus && (
                                                <button
                                                    onClick={() => handleUpdateStatus(order.id, nextStatus)}
                                                    className="text-primary-600 hover:text-primary-900"
                                                    title={`Move to ${nextStatus}`}
                                                >
                                                    <EyeIcon className="w-5 h-5" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {orders?.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No purchase orders found. Click "Create Order" to create one.</p>
                    </div>
                )}
            </div>

            {/* Create Order Modal */}
            <PurchaseOrderForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSubmit={handleCreateOrder}
            />

            {/* Receive Order Modal */}
            <ReceiveOrderModal
                isOpen={isReceiveModalOpen}
                onClose={() => {
                    setIsReceiveModalOpen(false);
                    setSelectedOrderId(null);
                }}
                onSubmit={handleReceiveOrder}
                order={selectedOrder}
            />
        </div>
    );
};