import { apiClient } from './client';
import type { StockMovement, StockMovementSummary } from '../types';

export type StockMovementType = 'In' | 'Out' | 'Adjustment';

export interface GetStockMovementsParams {
    productId?: number;
    movementType?: StockMovementType;
    fromDate?: string;
    toDate?: string;
    referenceId?: number;
    page?: number;
    pageSize?: number;
}

export interface GetStockSummaryParams {
    categoryId?: number;
    searchTerm?: string;
    lowStockOnly?: boolean;
    lowStockThreshold?: number;
}

export interface ProductStockHistory {
    productId: number;
    productName: string;
    currentStock: number;
    movements: StockMovement[];
    totalIn: number;
    totalOut: number;
}

export const stockMovementsAPI = {
    getAll: async (params?: GetStockMovementsParams): Promise<StockMovement[]> => {
        const response = await apiClient.get<StockMovement[]>('/StockMovements', { params });
        return response.data;
    },

    getSummary: async (params?: GetStockSummaryParams): Promise<StockMovementSummary[]> => {
        const response = await apiClient.get<StockMovementSummary[]>('/StockMovements/summary', { params });
        return response.data;
    },

    getProductHistory: async (productId: number, fromDate?: string, toDate?: string): Promise<ProductStockHistory> => {
        const response = await apiClient.get<ProductStockHistory>(`/StockMovements/product/${productId}`, {
            params: { fromDate, toDate },
        });
        return response.data;
    },
};