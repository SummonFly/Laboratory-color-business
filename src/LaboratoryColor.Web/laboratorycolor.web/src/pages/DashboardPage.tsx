import { useState, useMemo } from 'react';
import {
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import { useDashboard } from '../hooks/useDashboard';

export const DashboardPage = () => {
    const [lowStockThreshold, setLowStockThreshold] = useState(10);
    const [topProductsCount, setTopProductsCount] = useState(5);
    const [dateRange, setDateRange] = useState<'week' | 'month' | 'quarter'>('month');

    // »спользуем useMemo чтобы даты не пересоздавались при каждом рендере
    const dateParams = useMemo(() => {
        const now = new Date();
        const fromDate = new Date();
        switch (dateRange) {
            case 'week':
                fromDate.setDate(now.getDate() - 7);
                break;
            case 'month':
                fromDate.setMonth(now.getMonth() - 1);
                break;
            case 'quarter':
                fromDate.setMonth(now.getMonth() - 3);
                break;
        }
        return {
            fromDate: fromDate.toISOString(),
            toDate: now.toISOString(),
        };
    }, [dateRange]); // ѕересчитываетс¤ только когда мен¤етс¤ dateRange

    const { data, isLoading, error, refetch } = useDashboard({
        lowStockThreshold,
        topProductsCount,
        fromDate: dateParams.fromDate,
        toDate: dateParams.toDate,
    });

    const handleRefresh = () => {
        refetch();
    };

    // Colors for pie chart
    const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

    // Prepare data for popular products chart
    const popularProductsData = data?.popularProducts.map(p => ({
        name: p.productName.length > 20 ? p.productName.substring(0, 20) + '...' : p.productName,
        quantity: p.quantitySold,
        revenue: p.revenue,
    })) || [];

    // Prepare data for stock distribution pie chart
    const stockDistributionData = [
        { name: 'In Stock', value: (data?.stockSummary.totalProducts || 0) - (data?.stockSummary.lowStockCount || 0) },
        { name: 'Low Stock', value: data?.stockSummary.lowStockCount || 0 },
        { name: 'Out of Stock', value: 0 },
    ].filter(item => item.value > 0);

    if (isLoading && !data) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                Failed to load dashboard data. Please try again later.
            </div>
        );
    }

    return (
        <div>
            {/* Header with controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold text-gray-950">Dashboard</h1>

                <div className="flex flex-wrap gap-3">
                    <select
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value as 'week' | 'month' | 'quarter')}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    >
                        <option value="week">Last 7 days</option>
                        <option value="month">Last 30 days</option>
                        <option value="quarter">Last 90 days</option>
                    </select>

                    {/* Low stock threshold slider */}
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Low stock alert:</span>
                        <input
                            type="range"
                            min="1"
                            max="50"
                            value={lowStockThreshold}
                            onChange={(e) => setLowStockThreshold(parseInt(e.target.value))}
                            className="w-32"
                        />
                        <span className="text-sm font-medium text-gray-900">{lowStockThreshold}</span>
                    </div>

                    {/* Top products count selector */}
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Top products:</span>
                        <select
                            value={topProductsCount}
                            onChange={(e) => setTopProductsCount(parseInt(e.target.value))}
                            className="px-2 py-1 border border-gray-300 rounded-lg text-sm"
                        >
                            <option value={3}>3</option>
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={15}>15</option>
                        </select>
                    </div>

                    <button
                        onClick={handleRefresh}
                        className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700"
                    >
                        Refresh Data
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="text-sm font-medium text-gray-500 mb-1">Total Products</div>
                    <div className="text-3xl font-bold text-gray-900">
                        {data?.stockSummary.totalProducts || 0}
                    </div>
                    <div className="text-sm text-gray-500 mt-2">
                        Low stock: {data?.stockSummary.lowStockCount || 0}
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="text-sm font-medium text-gray-500 mb-1">Total Stock Value</div>
                    <div className="text-3xl font-bold text-gray-900">
                        ${(data?.stockSummary.totalStockValue || 0).toLocaleString()}
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="text-sm font-medium text-gray-500 mb-1">Total Orders</div>
                    <div className="text-3xl font-bold text-gray-900">
                        {data?.salesSummary.totalOrders || 0}
                    </div>
                    <div className="text-sm text-gray-500 mt-2">
                        Avg: ${(data?.salesSummary.averageOrderValue || 0).toFixed(2)}
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="text-sm font-medium text-gray-500 mb-1">Total Revenue</div>
                    <div className="text-3xl font-bold text-green-600">
                        ${(data?.salesSummary.totalRevenue || 0).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500 mt-2">
                        Pending POs: {data?.pendingPurchaseOrders || 0}
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Bar Chart - Popular Products */}
                <div className="bg-white rounded-lg shadow p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Selling Products</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={popularProductsData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="quantity" fill="#4f46e5" name="Quantity Sold" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Pie Chart - Stock Distribution */}
                <div className="bg-white rounded-lg shadow p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Stock Distribution</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={stockDistributionData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, value }) => `${name}: ${value}`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {stockDistributionData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Low Stock Products Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Low Stock Products</h2>
                    <p className="text-sm text-gray-500">Products below threshold ({lowStockThreshold} units)</p>
                </div>

                {data?.lowStockProducts && data.lowStockProducts.length > 0 ? (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current Stock</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Threshold</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {data.lowStockProducts.map((product) => (
                                <tr key={product.productId} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                        {product.productName}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        {product.currentStock}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {product.threshold}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                                            Low Stock
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        No low stock products found. All products are above threshold.
                    </div>
                )}
            </div>

            {/* Auto-refresh indicator */}
            <div className="mt-4 text-right text-xs text-gray-400">
                Auto-refreshes every 30 seconds
            </div>
        </div>
    );
};