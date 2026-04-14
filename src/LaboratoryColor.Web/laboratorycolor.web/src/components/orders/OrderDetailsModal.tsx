import { XMarkIcon } from '@heroicons/react/24/outline';
import type { OrderDto } from '../../api';
import { format } from 'date-fns';

interface OrderDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    order: OrderDto | null;
}

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
    isOpen,
    onClose,
    order,
}) => {
    if (!isOpen || !order) return null;

    const formatDate = (dateString: string) => {
        try {
            return format(new Date(dateString), 'dd.MM.yyyy HH:mm');
        } catch {
            return dateString;
        }
    };

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            'New': 'bg-gray-100 text-gray-800',
            'Pending': 'bg-yellow-100 text-yellow-800',
            'Processing': 'bg-blue-100 text-blue-800',
            'Shipped': 'bg-purple-100 text-purple-800',
            'Delivered': 'bg-green-100 text-green-800',
            'Cancelled': 'bg-red-100 text-red-800',
        };
        return styles[status] || 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={onClose} />

                <div className="relative bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
                        <h3 className="text-lg font-medium text-gray-900">
                            Order #{order.id}
                        </h3>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                            <XMarkIcon className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="px-6 py-4 space-y-4">
                        {/* Order Info */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <div className="text-sm text-gray-500">Order ID</div>
                                <div className="font-medium text-gray-900">#{order.id}</div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-500">Order Date</div>
                                <div className="font-medium text-gray-900">{formatDate(order.createdAt)}</div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-500">Customer</div>
                                <div className="font-medium text-gray-900">{order.customerName}</div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-500">Contact</div>
                                <div className="text-sm text-gray-900">{order.customerPhone}</div>
                                <div className="text-xs text-gray-500">{order.customerEmail}</div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-500">Status</div>
                                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(order.status)}`}>
                                    {order.status}
                                </span>
                            </div>
                            <div>
                                <div className="text-sm text-gray-500">Total Amount</div>
                                <div className="text-xl font-bold text-gray-900">${order.totalAmount.toFixed(2)}</div>
                            </div>
                            {order.comment && (
                                <div className="col-span-2">
                                    <div className="text-sm text-gray-500">Comment</div>
                                    <div className="text-sm text-gray-900">{order.comment}</div>
                                </div>
                            )}
                        </div>

                        {/* Items Table */}
                        <div className="border-t border-gray-200 pt-4">
                            <h4 className="text-md font-semibold text-gray-900 mb-3">Order Items</h4>
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Product</th>
                                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Quantity</th>
                                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Unit Price</th>
                                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {order.items.map((item) => (
                                        <tr key={item.id}>
                                            <td className="px-4 py-2 text-sm text-gray-900">{item.productName}</td>
                                            <td className="px-4 py-2 text-sm text-right text-gray-900">{item.quantity}</td>
                                            <td className="px-4 py-2 text-sm text-right text-gray-900">${item.unitPrice.toFixed(2)}</td>
                                            <td className="px-4 py-2 text-sm text-right text-gray-900">${item.totalPrice.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className="bg-gray-50">
                                    <tr>
                                        <td colSpan={3} className="px-4 py-2 text-right font-medium">Total:</td>
                                        <td className="px-4 py-2 text-right font-bold">${order.totalAmount.toFixed(2)}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>

                    <div className="flex justify-end px-6 py-4 border-t border-gray-200">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};