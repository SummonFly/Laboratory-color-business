import { useState } from 'react';
import {
    BeakerIcon,
    TrashIcon,
    InformationCircleIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { useTestDataStatus, useSeedTestData, useClearTestData } from '../hooks/useDev';

export const DevPanelPage = () => {
    const [isSeeding, setIsSeeding] = useState(false);
    const [isClearing, setIsClearing] = useState(false);

    const { data: status, isLoading, refetch } = useTestDataStatus();
    const seedMutation = useSeedTestData();
    const clearMutation = useClearTestData();

    const handleSeedData = async () => {
        if (window.confirm('This will generate test data. Continue?')) {
            setIsSeeding(true);
            await seedMutation.mutateAsync();
            setIsSeeding(false);
            refetch();
        }
    };

    const handleClearData = async () => {
        if (window.confirm('WARNING: This will delete ALL test data. This action cannot be undone. Continue?')) {
            setIsClearing(true);
            await clearMutation.mutateAsync();
            setIsClearing(false);
            refetch();
        }
    };

    const handleRefresh = () => {
        refetch();
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-950">Developer Panel</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Tools for managing test data (Developer access only)
                    </p>
                </div>
                <button
                    onClick={handleRefresh}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                    Refresh Status
                </button>
            </div>

            {/* Test Data Status Card */}
            <div className="bg-white rounded-lg shadow mb-8">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <InformationCircleIcon className="w-5 h-5 text-blue-500" />
                        Test Data Status
                    </h2>
                </div>

                <div className="p-6">
                    {status?.hasTestData ? (
                        <div className="flex items-center gap-2 text-green-600 mb-4">
                            <CheckCircleIcon className="w-5 h-5" />
                            <span className="font-medium">Test data is present</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 text-yellow-600 mb-4">
                            <ExclamationTriangleIcon className="w-5 h-5" />
                            <span className="font-medium">No test data found</span>
                        </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="text-sm text-gray-500">Products</div>
                            <div className="text-2xl font-bold text-gray-900">
                                {status?.productsCount || 0}
                            </div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="text-sm text-gray-500">Categories</div>
                            <div className="text-2xl font-bold text-gray-900">
                                {status?.categoriesCount || 0}
                            </div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="text-sm text-gray-500">Suppliers</div>
                            <div className="text-2xl font-bold text-gray-900">
                                {status?.suppliersCount || 0}
                            </div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="text-sm text-gray-500">Customer Orders</div>
                            <div className="text-2xl font-bold text-gray-900">
                                {status?.ordersCount || 0}
                            </div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="text-sm text-gray-500">Purchase Orders</div>
                            <div className="text-2xl font-bold text-gray-900">
                                {status?.purchaseOrdersCount || 0}
                            </div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="text-sm text-gray-500">Stock Movements</div>
                            <div className="text-2xl font-bold text-gray-900">
                                {status?.stockMovementsCount || 0}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions Card */}
            <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Actions</h2>
                </div>

                <div className="p-6 space-y-6">
                    {/* Seed Data */}
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                        <div>
                            <div className="font-medium text-green-800 flex items-center gap-2">
                                <BeakerIcon className="w-5 h-5" />
                                Seed Test Data
                            </div>
                            <p className="text-sm text-green-600 mt-1">
                                Generate sample products, categories, suppliers, orders, and stock movements
                            </p>
                        </div>
                        <button
                            onClick={handleSeedData}
                            disabled={isSeeding}
                            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50"
                        >
                            {isSeeding ? 'Seeding...' : 'Seed Data'}
                        </button>
                    </div>

                    {/* Clear Data */}
                    <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                        <div>
                            <div className="font-medium text-red-800 flex items-center gap-2">
                                <TrashIcon className="w-5 h-5" />
                                Clear Test Data
                            </div>
                            <p className="text-sm text-red-600 mt-1">
                                Delete ALL test data from the database (irreversible)
                            </p>
                        </div>
                        <button
                            onClick={handleClearData}
                            disabled={isClearing || !status?.hasTestData}
                            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50"
                        >
                            {isClearing ? 'Clearing...' : 'Clear All'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Warning */}
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                    ⚠️ This panel is for development purposes only. Test data operations affect the database directly.
                    Use with caution in production environments.
                </p>
            </div>
        </div>
    );
};