import { useState, useEffect } from 'react';
import {
    PlayIcon,
    StopIcon,
    Cog6ToothIcon,
    ClipboardDocumentListIcon,
    TrashIcon,
    ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { useSimulationStatus, useSimulationLogs, useStartSimulation, useStopSimulation, useUpdateSimulationConfig, useClearSimulationLogs } from '../hooks/useSimulation';
import type { SimulationConfig } from '../api';
import { format } from 'date-fns';

export const SimulationPanelPage = () => {
    const [isConfigOpen, setIsConfigOpen] = useState(false);
    const [config, setConfig] = useState<SimulationConfig | null>(null);

    const { data: status, isLoading: statusLoading, refetch: refetchStatus } = useSimulationStatus();
    const { data: logs, isLoading: logsLoading } = useSimulationLogs();
    const startSimulation = useStartSimulation();
    const stopSimulation = useStopSimulation();
    const updateConfig = useUpdateSimulationConfig();
    const clearLogs = useClearSimulationLogs();

    useEffect(() => {
        if (status?.config) {
            setConfig(status.config);
        }
    }, [status]);

    const handleStart = () => {
        startSimulation.mutate();
    };

    const handleStop = () => {
        stopSimulation.mutate();
    };

    const handleSaveConfig = () => {
        if (config) {
            updateConfig.mutate(config);
            setIsConfigOpen(false);
        }
    };

    const handleClearLogs = () => {
        if (window.confirm('Clear all simulation logs?')) {
            clearLogs.mutate();
        }
    };

    const handleRefresh = () => {
        refetchStatus();
    };

    const formatTimestamp = (timestamp: string) => {
        try {
            return format(new Date(timestamp), 'HH:mm:ss');
        } catch {
            return timestamp;
        }
    };

    const getLogLevelColor = (level: string | undefined) => {
        if (!level) return 'text-gray-600 bg-gray-50';

        switch (level.toLowerCase()) {
            case 'error':
                return 'text-red-600 bg-red-50';
            case 'warning':
                return 'text-yellow-600 bg-yellow-50';
            case 'info':
                return 'text-blue-600 bg-blue-50';
            default:
                return 'text-gray-600 bg-gray-50';
        }
    };

    if (statusLoading) {
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
                    <h1 className="text-2xl font-bold text-gray-950">Simulation Panel</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Control automated order generation and stock simulation
                    </p>
                </div>
                <button
                    onClick={handleRefresh}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                >
                    <ArrowPathIcon className="w-4 h-4" />
                    Refresh
                </button>
            </div>

            {/* Status Card */}
            <div className="bg-white rounded-lg shadow mb-8">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-900">Simulation Status</h2>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setIsConfigOpen(true)}
                            className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
                        >
                            <Cog6ToothIcon className="w-4 h-4" />
                            Configure
                        </button>
                        {!status?.isRunning ? (
                            <button
                                onClick={handleStart}
                                disabled={startSimulation.isPending}
                                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                            >
                                <PlayIcon className="w-4 h-4" />
                                {startSimulation.isPending ? 'Starting...' : 'Start'}
                            </button>
                        ) : (
                            <button
                                onClick={handleStop}
                                disabled={stopSimulation.isPending}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
                            >
                                <StopIcon className="w-4 h-4" />
                                {stopSimulation.isPending ? 'Stopping...' : 'Stop'}
                            </button>
                        )}
                    </div>
                </div>

                <div className="p-6">
                    <div className="flex items-center gap-4 mb-6">
                        <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${status?.isRunning
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                            {status?.isRunning ? '● Running' : '○ Stopped'}
                        </div>
                        <div className="text-sm text-gray-500">
                            Enabled: {status?.isEnabled ? 'Yes' : 'No'}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-gray-50 rounded-lg p-3">
                            <div className="text-xs text-gray-500">Order Interval</div>
                            <div className="text-lg font-semibold">{status?.config.orderGenerationIntervalSeconds}s</div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                            <div className="text-xs text-gray-500">Auto Receive</div>
                            <div className="text-lg font-semibold">{status?.config.autoReceiveIntervalSeconds}s</div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                            <div className="text-xs text-gray-500">Probability</div>
                            <div className="text-lg font-semibold">{status?.config.probabilityPercent}%</div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                            <div className="text-xs text-gray-500">Low Stock Alert</div>
                            <div className="text-lg font-semibold">&lt; {status?.config.lowStockThreshold}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Logs Card */}
            <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <ClipboardDocumentListIcon className="w-5 h-5" />
                        Simulation Logs
                    </h2>
                    <button
                        onClick={handleClearLogs}
                        disabled={clearLogs.isPending}
                        className="px-3 py-1 text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
                    >
                        <TrashIcon className="w-4 h-4" />
                        Clear
                    </button>
                </div>

                <div className="p-4 max-h-96 overflow-y-auto">
                    {logsLoading ? (
                        <div className="flex justify-center py-8">
                            <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : logs && logs.length > 0 ? (
                        <div className="space-y-2">
                            {logs.map((log, index) => (
                                <div
                                    key={index}
                                    className={`font-mono text-sm p-2 rounded ${getLogLevelColor(log.level)}`}
                                >
                                    <span className="text-gray-500 mr-3">{formatTimestamp(log.timestamp)}</span>
                                    <span className="font-medium">[{log.level}]</span>
                                    <span className="ml-3">{log.message}</span>
                                    {log.source && (
                                        <span className="text-gray-500 text-xs ml-2">({log.source})</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            No logs yet. Start simulation to see events.
                        </div>
                    )}
                </div>
            </div>

            {/* Config Modal */}
            {isConfigOpen && config && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={() => setIsConfigOpen(false)} />

                        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-medium text-gray-900">Simulation Configuration</h3>
                            </div>

                            <div className="px-6 py-4 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Order Generation Interval (seconds)</label>
                                        <input
                                            type="number"
                                            value={config.orderGenerationIntervalSeconds}
                                            onChange={(e) => setConfig({ ...config, orderGenerationIntervalSeconds: parseInt(e.target.value) })}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Auto Receive Interval (seconds)</label>
                                        <input
                                            type="number"
                                            value={config.autoReceiveIntervalSeconds}
                                            onChange={(e) => setConfig({ ...config, autoReceiveIntervalSeconds: parseInt(e.target.value) })}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Low Stock Threshold</label>
                                        <input
                                            type="number"
                                            value={config.lowStockThreshold}
                                            onChange={(e) => setConfig({ ...config, lowStockThreshold: parseInt(e.target.value) })}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Probability (%)</label>
                                        <input
                                            type="number"
                                            value={config.probabilityPercent}
                                            onChange={(e) => setConfig({ ...config, probabilityPercent: parseInt(e.target.value) })}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Min Items Per Order</label>
                                        <input
                                            type="number"
                                            value={config.minItemsPerOrder}
                                            onChange={(e) => setConfig({ ...config, minItemsPerOrder: parseInt(e.target.value) })}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Max Items Per Order</label>
                                        <input
                                            type="number"
                                            value={config.maxItemsPerOrder}
                                            onChange={(e) => setConfig({ ...config, maxItemsPerOrder: parseInt(e.target.value) })}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Default Delivery Days</label>
                                        <input
                                            type="number"
                                            value={config.defaultDeliveryDays}
                                            onChange={(e) => setConfig({ ...config, defaultDeliveryDays: parseInt(e.target.value) })}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Default Order Quantity</label>
                                        <input
                                            type="number"
                                            value={config.defaultOrderQuantity}
                                            onChange={(e) => setConfig({ ...config, defaultOrderQuantity: parseInt(e.target.value) })}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Default Supplier ID</label>
                                    <input
                                        type="number"
                                        value={config.defaultSupplierId}
                                        onChange={(e) => setConfig({ ...config, defaultSupplierId: parseInt(e.target.value) })}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                </div>

                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={config.isEnabled}
                                        onChange={(e) => setConfig({ ...config, isEnabled: e.target.checked })}
                                        className="h-4 w-4 text-primary-600 rounded"
                                    />
                                    <label className="ml-2 block text-sm text-gray-700">Enable Simulation</label>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200">
                                <button
                                    onClick={() => setIsConfigOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveConfig}
                                    className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
                                >
                                    Save Configuration
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};