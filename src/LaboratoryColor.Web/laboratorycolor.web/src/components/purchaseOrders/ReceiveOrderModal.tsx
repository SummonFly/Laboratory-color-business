import { useState, useEffect, type FormEvent } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import type { PurchaseOrder, ReceivePurchaseOrderRequest } from '../../api';
import type { PurchaseOrderItem } from '../../types';

interface ReceiveOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: ReceivePurchaseOrderRequest) => void;
    order: PurchaseOrder | null;
    isLoading?: boolean;
}

interface ReceiveItem {
    itemId: number;
    productName: string;
    orderedQuantity: number;
    receivedQuantity: number;
    toReceive: number;
}

export const ReceiveOrderModal: React.FC<ReceiveOrderModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    order,
    isLoading = false,
}) => {
    const [items, setItems] = useState<ReceiveItem[]>([]);

    useEffect(() => {
        if (order && isOpen) {
            setItems(
                order.items.map((item: PurchaseOrderItem) => ({
                    itemId: item.id,
                    productName: item.productName,
                    orderedQuantity: item.quantity,
                    receivedQuantity: item.receivedQuantity,
                    toReceive: 0,
                }))
            );
        }
    }, [order, isOpen]);

    if (!isOpen || !order) return null;

    const updateToReceive = (itemId: number, value: number) => {
        setItems(items.map(item => {
            if (item.itemId === itemId) {
                const maxCanReceive = item.orderedQuantity - item.receivedQuantity;
                return {
                    ...item,
                    toReceive: Math.min(Math.max(0, value), maxCanReceive),
                };
            }
            return item;
        }));
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const receiveItems = items
            .filter(item => item.toReceive > 0)
            .map(item => ({
                itemId: item.itemId,
                receivedQuantity: item.toReceive,
            }));

        if (receiveItems.length === 0) return;

        onSubmit({
            purchaseOrderId: order.id,
            items: receiveItems,
        });

        onClose();
    };

    const totalToReceive = items.reduce((sum, item) => sum + item.toReceive, 0);

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={onClose} />

                <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full">
                    <form onSubmit={handleSubmit}>
                        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="text-lg font-medium text-gray-900">
                                Receive Goods - {order.orderNumber}
                            </h3>
                            <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-500">
                                <XMarkIcon className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="px-6 py-4">
                            <div className="mb-4 text-sm text-gray-600">
                                Supplier: <span className="font-medium">{order.supplierName}</span>
                            </div>

                            <div className="border rounded-lg overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Product</th>
                                            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Ordered</th>
                                            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Received</th>
                                            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">To Receive</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {items.map((item) => {
                                            const maxCanReceive = item.orderedQuantity - item.receivedQuantity;
                                            const isFullyReceived = maxCanReceive === 0;

                                            return (
                                                <tr key={item.itemId}>
                                                    <td className="px-4 py-2 text-sm text-gray-900">{item.productName}</td>
                                                    <td className="px-4 py-2 text-sm text-right text-gray-900">{item.orderedQuantity}</td>
                                                    <td className="px-4 py-2 text-sm text-right text-green-600">{item.receivedQuantity}</td>
                                                    <td className="px-4 py-2 text-right">
                                                        <input
                                                            type="number"
                                                            min={0}
                                                            max={maxCanReceive}
                                                            value={item.toReceive}
                                                            onChange={(e) => updateToReceive(item.itemId, parseInt(e.target.value) || 0)}
                                                            disabled={isFullyReceived}
                                                            className="w-24 px-2 py-1 text-right border border-gray-300 rounded-md disabled:bg-gray-100"
                                                        />
                                                        <div className="text-xs text-gray-400">Max: {maxCanReceive}</div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                    <tfoot className="bg-gray-50">
                                        <tr>
                                            <td colSpan={3} className="px-4 py-2 text-right font-medium">Total to receive:</td>
                                            <td className="px-4 py-2 text-right font-bold">{totalToReceive}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading || totalToReceive === 0}
                                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Processing...' : 'Receive Goods'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};