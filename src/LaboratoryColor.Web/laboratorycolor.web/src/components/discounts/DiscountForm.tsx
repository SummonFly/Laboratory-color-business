import { useState, useEffect, type FormEvent } from 'react';
import { XMarkIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import type { Discount } from '../../types';
import type { CreateDiscountRequest, UpdateDiscountRequest, DiscountType, DiscountRuleType } from '../../api';
import { discountTypeToNumber, ruleTypeToNumber } from '../../api/discounts';

interface DiscountFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CreateDiscountRequest | UpdateDiscountRequest) => void;
    initialData?: Discount;
    isEditing?: boolean;
    isLoading?: boolean;
}

interface RuleItem {
    id: string;
    ruleType: DiscountRuleType; 
    ruleValue: string;
}

interface CouponItem {
    id: string;
    code: string;
    usageLimit?: number;
    userId?: string;
}


const ruleTypeLabels: Record<DiscountRuleType, string> = {
    'All': 'All Products',
    'Category': 'Specific Category',
    'Product': 'Specific Product',
    'AttributeValue': 'Attribute Value',
    'CustomerRole': 'Customer Role',
    'TotalAmount': 'Minimum Order Amount',
};

export const DiscountForm: React.FC<DiscountFormProps> = ({
    isOpen,
    onClose,
    onSubmit,
    initialData,
    isEditing = false,
    isLoading = false,
}) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [discountType, setDiscountType] = useState<DiscountType>('Percentage');
    const [discountValue, setDiscountValue] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [priority, setPriority] = useState('');
    const [rules, setRules] = useState<RuleItem[]>([]);
    const [coupons, setCoupons] = useState<CouponItem[]>([]);

    // Temporary fields for adding rules/coupons
    const [newRuleType, setNewRuleType] = useState<DiscountRuleType>('All');
    const [newRuleValue, setNewRuleValue] = useState('');
    const [newCouponCode, setNewCouponCode] = useState('');
    const [newCouponUsageLimit, setNewCouponUsageLimit] = useState('');
    const [newCouponUserId, setNewCouponUserId] = useState('');

    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
            setDescription(initialData.description || '');
            setDiscountType(initialData.discountType as DiscountType); // 'Percentage' или 'FixedAmount'
            setDiscountValue(initialData.discountValue.toString());
            setStartDate(initialData.startDate.split('T')[0]);
            setEndDate(initialData.endDate.split('T')[0]);
            setPriority(initialData.priority.toString());
            setRules(initialData.rules.map(r => ({
                ruleType: r.ruleType as DiscountRuleType,
                ruleValue: r.ruleValue,
                id: crypto.randomUUID()
            })));
            setCoupons(initialData.coupons.map(c => ({
                code: c.code,
                usageLimit: c.usageLimit || undefined,
                userId: c.userId || undefined,
                id: crypto.randomUUID()
            })));
        } else {
            setName('');
            setDescription('');
            setDiscountType('Percentage');
            setDiscountValue('');
            setStartDate('');
            setEndDate('');
            setPriority('0');
            setRules([]);
            setCoupons([]);
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const addRule = () => {
        if (!newRuleValue) return;
        setRules([
            ...rules,
            {
                id: crypto.randomUUID(),
                ruleType: newRuleType,
                ruleValue: newRuleValue,
            },
        ]);
        setNewRuleValue('');
    };

    const removeRule = (id: string) => {
        setRules(rules.filter(rule => rule.id !== id));
    };

    const addCoupon = () => {
        if (!newCouponCode) return;
        setCoupons([
            ...coupons,
            {
                id: crypto.randomUUID(),
                code: newCouponCode,
                usageLimit: newCouponUsageLimit ? parseInt(newCouponUsageLimit) : undefined,
                userId: newCouponUserId || undefined,
            },
        ]);
        setNewCouponCode('');
        setNewCouponUsageLimit('');
        setNewCouponUserId('');
    };

    const removeCoupon = (id: string) => {
        setCoupons(coupons.filter(coupon => coupon.id !== id));
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const discountValueNum = parseFloat(discountValue);
        const priorityNum = parseInt(priority) || 0;

        if (isNaN(discountValueNum) || discountValueNum <= 0) return;
        if (!startDate || !endDate) return;

        const formatDate = (date: string) => new Date(date).toISOString();

        if (isEditing && initialData) {
            onSubmit({
                id: initialData.id,
                name,
                description: description || undefined,
                discountType: discountTypeToNumber(discountType), // 'Percentage' -> 0
                discountValue: discountValueNum,
                startDate: formatDate(startDate),
                endDate: formatDate(endDate),
                priority: priorityNum,
                isActive: initialData.isActive,
            });
        } else {
            onSubmit({
                name,
                description: description || undefined,
                discountType: discountTypeToNumber(discountType), // 'Percentage' -> 0
                discountValue: discountValueNum,
                startDate: formatDate(startDate),
                endDate: formatDate(endDate),
                priority: priorityNum,
                rules: rules.map(({ id, ...rest }) => ({
                    ruleType: ruleTypeToNumber(rest.ruleType),
                    ruleValue: rest.ruleValue,
                })),
                coupons: coupons.length > 0 ? coupons.map(({ id, ...rest }) => rest) : undefined,
            });
        }

        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={onClose} />

                <div className="relative bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                    <form onSubmit={handleSubmit}>
                        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
                            <h3 className="text-lg font-medium text-gray-900">
                                {isEditing ? 'Edit Discount' : 'Create Discount'}
                            </h3>
                            <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-500">
                                <XMarkIcon className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="px-6 py-4 space-y-6">
                            {/* Basic Info */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Name *</label>
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Priority</label>
                                    <input
                                        type="number"
                                        value={priority}
                                        onChange={(e) => setPriority(e.target.value)}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={2}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Discount Type *</label>
                                    <select
                                        required
                                        value={discountType}
                                        onChange={(e) => setDiscountType(e.target.value as DiscountType)}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                                    >
                                        <option value="Percentage">Percentage (%)</option>
                                        <option value="FixedAmount">Fixed Amount ($)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        {discountType === 'Percentage' ? 'Value (%) *' : 'Value ($) *'}
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        required
                                        value={discountValue}
                                        onChange={(e) => setDiscountValue(e.target.value)}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Status</label>
                                    <div className="mt-2">
                                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${new Date(startDate) <= new Date() && new Date(endDate) >= new Date() ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {new Date(startDate) <= new Date() && new Date(endDate) >= new Date() ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Start Date *</label>
                                    <input
                                        type="date"
                                        required
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">End Date *</label>
                                    <input
                                        type="date"
                                        required
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                                    />
                                </div>
                            </div>

                            {/* Rules Section */}
                            {!isEditing && (
                                <div className="border-t border-gray-200 pt-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-3">Rules</label>

                                    <div className="grid grid-cols-12 gap-2 mb-3">
                                        <div className="col-span-5">
                                            <select
                                                value={newRuleType}
                                                onChange={(e) => setNewRuleType(e.target.value as DiscountRuleType)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                            >
                                                <option value="All">All Products</option>
                                                <option value="Category">Specific Category</option>
                                                <option value="Product">Specific Product</option>
                                                <option value="TotalAmount">Minimum Order Amount</option>
                                            </select>
                                        </div>
                                        <div className="col-span-5">
                                            <input
                                                type="text"
                                                placeholder={newRuleType === 'TotalAmount' ? 'Min amount' : 'Category/Product ID'}
                                                value={newRuleValue}
                                                onChange={(e) => setNewRuleValue(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <button
                                                type="button"
                                                onClick={addRule}
                                                className="w-full inline-flex justify-center items-center px-3 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
                                            >
                                                <PlusIcon className="w-4 h-4 mr-1" />
                                                Add
                                            </button>
                                        </div>
                                    </div>

                                    {rules.length > 0 && (
                                        <div className="mt-2 space-y-2">
                                            {rules.map((rule) => (
                                                <div key={rule.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                                                    <div>
                                                        <span className="text-sm font-medium">{ruleTypeLabels[rule.ruleType]}</span>
                                                        <span className="text-sm text-gray-500 ml-2">: {rule.ruleValue}</span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeRule(rule.id)}
                                                        className="text-red-600 hover:text-red-800"
                                                    >
                                                        <TrashIcon className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Coupons Section */}
                            {!isEditing && (
                                <div className="border-t border-gray-200 pt-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-3">Coupons</label>

                                    <div className="grid grid-cols-12 gap-2 mb-3">
                                        <div className="col-span-4">
                                            <input
                                                type="text"
                                                placeholder="Coupon Code *"
                                                value={newCouponCode}
                                                onChange={(e) => setNewCouponCode(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                            />
                                        </div>
                                        <div className="col-span-3">
                                            <input
                                                type="number"
                                                placeholder="Usage Limit"
                                                value={newCouponUsageLimit}
                                                onChange={(e) => setNewCouponUsageLimit(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                            />
                                        </div>
                                        <div className="col-span-3">
                                            <input
                                                type="text"
                                                placeholder="User ID (optional)"
                                                value={newCouponUserId}
                                                onChange={(e) => setNewCouponUserId(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <button
                                                type="button"
                                                onClick={addCoupon}
                                                className="w-full inline-flex justify-center items-center px-3 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
                                            >
                                                <PlusIcon className="w-4 h-4 mr-1" />
                                                Add
                                            </button>
                                        </div>
                                    </div>

                                    {coupons.length > 0 && (
                                        <div className="mt-2 space-y-2">
                                            {coupons.map((coupon) => (
                                                <div key={coupon.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                                                    <div>
                                                        <span className="text-sm font-mono font-medium">{coupon.code}</span>
                                                        {coupon.usageLimit && (
                                                            <span className="text-xs text-gray-500 ml-2">Limit: {coupon.usageLimit}</span>
                                                        )}
                                                        {coupon.userId && (
                                                            <span className="text-xs text-gray-500 ml-2">User: {coupon.userId}</span>
                                                        )}
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeCoupon(coupon.id)}
                                                        className="text-red-600 hover:text-red-800"
                                                    >
                                                        <TrashIcon className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
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
                                disabled={isLoading}
                                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 disabled:opacity-50"
                            >
                                {isLoading ? 'Saving...' : isEditing ? 'Save' : 'Create'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};