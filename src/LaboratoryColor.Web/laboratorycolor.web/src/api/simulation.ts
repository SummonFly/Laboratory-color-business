import { apiClient } from './client';

export interface SimulationConfig {
    isEnabled: boolean;
    orderGenerationIntervalSeconds: number;
    autoReceiveIntervalSeconds: number;
    lowStockThreshold: number;
    minItemsPerOrder: number;
    maxItemsPerOrder: number;
    probabilityPercent: number;
    defaultDeliveryDays: number;
    defaultOrderQuantity: number;
    defaultSupplierId: number;
}

export interface SimulationStatusDto {
    isRunning: boolean;
    isEnabled: boolean;
    config: SimulationConfig;
}

export interface SimulationLogDto {
    id: number;
    timestamp: string;
    level: string;
    message: string;
    source: string;
}

export const simulationAPI = {
    start: async (): Promise<{ message: string }> => {
        const response = await apiClient.post('/Simulation/start');
        return response.data;
    },

    stop: async (): Promise<{ message: string }> => {
        const response = await apiClient.post('/Simulation/stop');
        return response.data;
    },

    getStatus: async (): Promise<SimulationStatusDto> => {
        const response = await apiClient.get<SimulationStatusDto>('/Simulation/status');
        return response.data;
    },

    updateConfig: async (config: SimulationConfig): Promise<{ message: string; config: SimulationConfig }> => {
        const response = await apiClient.put('/Simulation/config', config);
        return response.data;
    },

    getLogs: async (): Promise<SimulationLogDto[]> => {
        const response = await apiClient.get<SimulationLogDto[]>('/Simulation/logs');
        return response.data;
    },

    clearLogs: async (): Promise<{ message: string }> => {
        const response = await apiClient.delete('/Simulation/logs');
        return response.data;
    },
};