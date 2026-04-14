import { apiClient } from './client';

export interface TestDataStatusDto {
    hasTestData: boolean;
    productsCount: number;
    categoriesCount: number;
    suppliersCount: number;
    ordersCount: number;
    purchaseOrdersCount: number;
    stockMovementsCount: number;
}

export interface OperationResultDto {
    success: boolean;
    message: string;
    details?: string;
}

export const devAPI = {
    seedTestData: async (): Promise<OperationResultDto> => {
        const response = await apiClient.post<OperationResultDto>('/Dev/seed-test-data');
        return response.data;
    },

    clearTestData: async (): Promise<OperationResultDto> => {
        const response = await apiClient.delete<OperationResultDto>('/Dev/clear-test-data');
        return response.data;
    },

    getTestDataStatus: async (): Promise<TestDataStatusDto> => {
        const response = await apiClient.get<TestDataStatusDto>('/Dev/test-data-status');
        return response.data;
    },
};