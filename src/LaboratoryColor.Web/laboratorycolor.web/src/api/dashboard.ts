import { apiClient } from './client';

export interface StockSummaryDto {
    totalProducts: number;
    totalStockValue: number;
    lowStockCount: number;
}

export interface SalesSummaryDto {
    totalOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
}

export interface PopularProductDto {
    productId: number;
    productName: string;
    quantitySold: number;
    revenue: number;
}

export interface LowStockProductDto {
    productId: number;
    productName: string;
    currentStock: number;
    threshold: number;
}

export interface DashboardDto {
    stockSummary: StockSummaryDto;
    salesSummary: SalesSummaryDto;
    popularProducts: PopularProductDto[];
    lowStockProducts: LowStockProductDto[];
    pendingPurchaseOrders: number;
}

export interface GetDashboardParams {
    lowStockThreshold?: number;
    topProductsCount?: number;
    fromDate?: string;
    toDate?: string;
}

export const dashboardAPI = {
    getDashboard: async (params?: GetDashboardParams): Promise<DashboardDto> => {
        const response = await apiClient.get<DashboardDto>('/Dashboard', { params });
        return response.data;
    },
};