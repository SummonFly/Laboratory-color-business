import { apiClient } from './client';
import type { StockMovement, StockMovementSummary } from '../types';

export type StockMovementType = 'In' | 'Out' | 'Adjustment';

export interface GetStockMovementsParams {
    productId?: number;
    movementType?: StockMovementType;
    fromDate?: string;
    toDate?: string;
    page?: number;
    pageSize?: number;
}

export interface CreateStockMovementRequest {
    productId: number;
    quantity: number;
    movementType: StockMovementType;
    reason: string;
    referenceId?: number;
    referenceNumber?: string;
}

export const stockMovementsAPI = {
    getAll: async (params?: GetStockMovementsParams): Promise<StockMovement[]> => {
        const response = await apiClient.get<StockMovement[]>('/StockMovements', { params });
        return response.data;
    },

    getByProduct: async (productId: number): Promise<StockMovement[]> => {
        const response = await apiClient.get<StockMovement[]>(`/StockMovements/product/${productId}`);
        return response.data;
    },

    getSummary: async (): Promise<StockMovementSummary[]> => {
        const response = await apiClient.get<StockMovementSummary[]>('/StockMovements/summary');
        return response.data;
    },

    create: async (data: CreateStockMovementRequest): Promise<StockMovement> => {
        const response = await apiClient.post<StockMovement>('/StockMovements', data);
        return response.data;
    },
};