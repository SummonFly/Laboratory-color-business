import { useState, useEffect, type FormEvent } from 'react';
import { XMarkIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import type { CreatePurchaseOrderRequest, CreatePurchaseOrderItemRequest } from '../../api';
import { useSuppliers } from '../../hooks/useSuppliers';
import { useProducts } from '../../hooks/useProducts';

interface PurchaseOrderFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CreatePurchaseOrderRequest) => void;
    isLoading?: boolean;
}

interface OrderItem extends CreatePurchaseOrderItemRequest {
    id: string; // temporary id for React keys
    productName?: string;
}

export const PurchaseOrderForm: React.FC<PurchaseOrderFormProps> = ({
    isOpen,
    onClose,
    onSubmit,
    isLoading = false,
}) => {
    const [supplierId, setSupplierId] = useState('');
    const [expectedDeliveryDate, setExpectedDeliveryDate] = useState('');
    const [notes, setNotes] = useState('');
    const [items, setItems] = useState<OrderItem[]>([]);
    const [selectedProductId, setSelectedProductId] = useState('');
    const [quantity, setQuantity] = useState('');
    const [unitPrice, setUnitPrice] = useState('');

    const { data: suppliers, isLoading: suppliersLoading } = useSuppliers({ isActive: true });
    const { data: products, isLoading: productsLoading } = useProducts();

    useEffect(() => {
        if (!isOpen) {
            // Reset form when closed
            setSupplierId('');
            setExpectedDeliveryDate('');
            setNotes('');
            setItems([]);
            setSelectedProductId('');
            setQuantity('');
            setUnitPrice('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const addItem = () => {
        if (!selectedProductId || !quantity || !unitPrice) return;

        const product = products?.find(p => p.id === parseInt(selectedProductId));
        const quantityNum = parseInt(quantity);
        const unitPriceNum = parseFloat(unitPrice);

        if (isNaN(quantityNum) || quantityNum <= 0) return;
        if (isNaN(unitPriceNum) || unitPriceNum <= 0) return;

        setItems([
            ...items,
            {
                id: crypto.randomUUID(),
                productId: parseInt(selectedProductId),
                quantity: quantityNum,
                unitPrice: unitPriceNum,
                productName: product?.name,
            },
        ]);

        setSelectedProductId('');
        setQuantity('');
        setUnitPrice('');
    };

    const removeItem = (id: string) => {
        setItems(items.filter(item => item.id !== id));
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!supplierId || items.length === 0) return;

        onSubmit({
            supplierId: parseInt(supplierId),
            expectedDeliveryDate: expectedDeliveryDate || undefined,
            notes: notes || undefined,
            items: items.map(({ id, productName, ...rest }) => rest),
        });
    };

    const totalAmount = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={onClose} />

                <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                    <form onSubmit={handleSubmit}>
                        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="text-lg font-medium text-gray-900">Create Purchase Order</h3>
                            <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-500">
                                <XMarkIcon className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="px-6 py-4 space-y-6">
                            {/* Supplier Selection */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Supplier *</label>
                                    <select
                                        required
                                        value={supplierId}
                                        onChange={(e) => setSupplierId(e.target.value)}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                                        disabled={suppliersLoading}
                                    >
                                        <option value="">Select supplier</option>
                                        {suppliers?.map((supplier) => (
                                            <option key={supplier.id} value={supplier.id}>
                                                {supplier.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Expected Delivery Date</label>
                                    <input
                                        type="date"
                                        value={expectedDeliveryDate}
                                        onChange={(e) => setExpectedDeliveryDate(e.target.value)}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Notes</label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    rows={2}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                                />
                            </div>

                            {/* Add Items Section */}
                            <div className="border-t border-gray-200 pt-4">
                                <label className="block text-sm font-medium text-gray-700 mb-3">Order Items *</label>
                                <div className="grid grid-cols-12 gap-2 mb-3">
                                    <div className="col-span-5">
                                        <select
                                            value={selectedProductId}
                                            onChange={(e) => setSelectedProductId(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                            disabled={productsLoading}
                                        >
                                            <option value="">Select product</option>
                                            {products?.map((product) => (
                                                <option key={product.id} value={product.id}>
                                                    {product.name} - ${product.price}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-span-2">
                                        <input
                                            type="number"
                                            placeholder="Quantity"
                                            value={quantity}
                                            onChange={(e) => setQuantity(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        />
                                    </div>
                                    <div className="col-span-3">
                                        <input
                                            type="number"
                                            step="0.01"
                                            placeholder="Unit Price"
                                            value={unitPrice}
                                            onChange={(e) => setUnitPrice(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <button
                                            type="button"
                                            onClick={addItem}
                                            className="w-full inline-flex justify-center items-center px-3 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
                                        >
                                            <PlusIcon className="w-4 h-4 mr-1" />
                                            Add
                                        </button>
                                    </div>
                                </div>

                                {/* Items Table */}
                                {items.length > 0 && (
                                    <div className="mt-4 border rounded-lg overflow-hidden">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Product</th>
                                                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Quantity</th>
                                                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Unit Price</th>
                                                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Total</th>
                                                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {items.map((item) => (
                                                    <tr key={item.id}>
                                                        <td className="px-4 py-2 text-sm text-gray-900">
                                                            {item.productName || `Product #${item.productId}`}
                                                        </td>
                                                        <td className="px-4 py-2 text-sm text-right text-gray-900">{item.quantity}</td>
                                                        <td className="px-4 py-2 text-sm text-right text-gray-900">${item.unitPrice.toFixed(2)}</td>
                                                        <td className="px-4 py-2 text-sm text-right text-gray-900">${(item.quantity * item.unitPrice).toFixed(2)}</td>
                                                        <td className="px-4 py-2 text-center">
                                                            <button
                                                                type="button"
                                                                onClick={() => removeItem(item.id)}
                                                                className="text-red-600 hover:text-red-800"
                                                            >
                                                                <TrashIcon className="w-4 h-4" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                                <tr className="bg-gray-50">
                                                    <td colSpan={3} className="px-4 py-2 text-right font-medium">Total:</td>
                                                    <td className="px-4 py-2 text-right font-bold">${totalAmount.toFixed(2)}</td>
                                                    <td></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                )}
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
                                disabled={isLoading || !supplierId || items.length === 0}
                                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Creating...' : 'Create Order'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};