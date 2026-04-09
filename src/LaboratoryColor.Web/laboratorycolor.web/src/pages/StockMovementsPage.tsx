import { useState } from 'react';
import { useStockMovements, useStockSummary } from '../hooks/useStockMovements';
import { format } from 'date-fns';

type TabType = 'summary' | 'history';

export const StockMovementsPage = () => {
    const [activeTab, setActiveTab] = useState<TabType>('summary');

    // Filters for history
    const [productId, setProductId] = useState('');
    const [movementType, setMovementType] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [page, setPage] = useState(1);
    const pageSize = 50;

    // Summary filters
    const [searchTerm, setSearchTerm] = useState('');
    const [lowStockOnly, setLowStockOnly] = useState(false);
    const [lowStockThreshold, setLowStockThreshold] = useState(10);

    const { data: movements, isLoading: movementsLoading, error: movementsError } = useStockMovements({
        productId: productId ? parseInt(productId) : undefined,
        movementType: movementType as any || undefined,
        fromDate: fromDate || undefined,
        toDate: toDate || undefined,
        page,
        pageSize,
    });

    const { data: summary, isLoading: summaryLoading, error: summaryError } = useStockSummary({
        searchTerm: searchTerm || undefined,
        lowStockOnly: lowStockOnly || undefined,
        lowStockThreshold: lowStockThreshold,
    });

    const formatDate = (dateString: string) => {
        try {
            return format(new Date(dateString), 'dd.MM.yyyy HH:mm');
        } catch {
            return dateString;
        }
    };

    const getMovementTypeBadge = (type: string) => {
        const styles: Record<string, string> = {
            'In': 'bg-green-100 text-green-800',
            'Out': 'bg-red-100 text-red-800',
            'Adjustment': 'bg-yellow-100 text-yellow-800',
        };
        return styles[type] || 'bg-gray-100 text-gray-800';
    };

    const getStockLevelBadge = (stock: number, threshold: number) => {
        if (stock <= 0) return 'bg-red-100 text-red-800';
        if (stock <= threshold) return 'bg-yellow-100 text-yellow-800';
        return 'bg-green-100 text-green-800';
    };

    const handleResetFilters = () => {
        setProductId('');
        setMovementType('');
        setFromDate('');
        setToDate('');
        setPage(1);
    };

    const handlePrevPage = () => {
        if (page > 1) setPage(page - 1);
    };

    const handleNextPage = () => {
        setPage(page + 1);
    };

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Stock Management</h1>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab('summary')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'summary'
                                ? 'border-primary-500 text-primary-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        Stock Summary
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'history'
                                ? 'border-primary-500 text-primary-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        Movements History
                    </button>
                </nav>
            </div>

            {/* Stock Summary Tab */}
            {activeTab === 'summary' && (
                <div>
                    {/* Summary Filters */}
                    <div className="mb-6 flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="Search by product name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                            />
                        </div>
                        <div className="flex items-center gap-4">
                            <label className="inline-flex items-center">
                                <input
                                    type="checkbox"
                                    checked={lowStockOnly}
                                    onChange={(e) => setLowStockOnly(e.target.checked)}
                                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                />
                                <span className="ml-2 text-sm text-gray-700">Low stock only</span>
                            </label>
                            {lowStockOnly && (
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-500">Threshold:</span>
                                    <input
                                        type="number"
                                        value={lowStockThreshold}
                                        onChange={(e) => setLowStockThreshold(parseInt(e.target.value) || 10)}
                                        className="w-20 px-2 py-1 border border-gray-300 rounded-md"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Summary Table */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        {summaryLoading ? (
                            <div className="flex justify-center py-12">
                                <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
                            </div>
                        ) : summaryError ? (
                            <div className="text-center py-12 text-red-500">
                                Failed to load stock summary
                            </div>
                        ) : (
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Product
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Current Stock
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Total In
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Total Out
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {summary?.map((item) => (
                                        <tr key={item.productId} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {item.productName}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {item.currentStock}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                                                +{item.totalIn}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                                                -{item.totalOut}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStockLevelBadge(item.currentStock, lowStockThreshold)}`}>
                                                    {item.currentStock <= 0 ? 'Out of Stock' : item.currentStock <= lowStockThreshold ? 'Low Stock' : 'In Stock'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}

                        {summary?.length === 0 && !summaryLoading && (
                            <div className="text-center py-12 text-gray-500">
                                No products found
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Movements History Tab */}
            {activeTab === 'history' && (
                <div>
                    {/* History Filters */}
                    <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                        <input
                            type="number"
                            placeholder="Product ID"
                            value={productId}
                            onChange={(e) => setProductId(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        />
                        <select
                            value={movementType}
                            onChange={(e) => setMovementType(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        >
                            <option value="">All Types</option>
                            <option value="In">In (Receipt)</option>
                            <option value="Out">Out (Sale/Usage)</option>
                            <option value="Adjustment">Adjustment</option>
                        </select>
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
                            onClick={handleResetFilters}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                        >
                            Reset Filters
                        </button>
                    </div>

                    {/* Movements Table */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        {movementsLoading ? (
                            <div className="flex justify-center py-12">
                                <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
                            </div>
                        ) : movementsError ? (
                            <div className="text-center py-12 text-red-500">
                                Failed to load movements
                            </div>
                        ) : (
                            <>
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Date
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Product
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Type
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Quantity
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Reason
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Created By
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {movements?.map((movement) => (
                                            <tr key={movement.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {formatDate(movement.createdAt)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {movement.productName}
                                                    <div className="text-xs text-gray-500">ID: {movement.productId}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getMovementTypeBadge(movement.movementType)}`}>
                                                        {movement.movementType}
                                                    </span>
                                                </td>
                                                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${movement.movementType === 'In' ? 'text-green-600' : 'text-red-600'
                                                    }`}>
                                                    {movement.movementType === 'In' ? '+' : '-'}{Math.abs(movement.quantity)}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    {movement.reason || '-'}
                                                    {movement.referenceNumber && (
                                                        <div className="text-xs text-gray-400">Ref: {movement.referenceNumber}</div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {movement.createdBy || '-'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {/* Pagination */}
                                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
                                    <div className="text-sm text-gray-500">
                                        Page {page}
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handlePrevPage}
                                            disabled={page === 1}
                                            className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Previous
                                        </button>
                                        <button
                                            onClick={handleNextPage}
                                            className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}

                        {movements?.length === 0 && !movementsLoading && (
                            <div className="text-center py-12 text-gray-500">
                                No movements found
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};