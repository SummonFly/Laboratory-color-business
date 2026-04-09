import { apiClient } from './client';
import type { Discount } from '../types';

export type DiscountType = 'Percentage' | 'FixedAmount';
export type DiscountRuleType = 'All' | 'Category' | 'Product' | 'TotalAmount';

export interface CreateDiscountRuleRequest {
    ruleType: DiscountRuleType;
    ruleValue: string;
}

export interface CreateDiscountRequest {
    name: string;
    description?: string;
    discountType: DiscountType;
    discountValue: number;
    startDate: string;
    endDate: string;
    priority: number;
    rules: CreateDiscountRuleRequest[];
}

export interface UpdateDiscountRequest {
    id: number;
    name: string;
    description?: string;
    discountType: DiscountType;
    discountValue: number;
    startDate: string;
    endDate: string;
    isActive: boolean;
    priority: number;
    rules: CreateDiscountRuleRequest[];
}

export const discountsAPI = {
    getAll: async (): Promise<Discount[]> => {
        const response = await apiClient.get<Discount[]>('/Discounts');
        return response.data;
    },

    getById: async (id: number): Promise<Discount> => {
        const response = await apiClient.get<Discount>(`/Discounts/${id}`);
        return response.data;
    },

    getActive: async (): Promise<Discount[]> => {
        const response = await apiClient.get<Discount[]>('/Discounts/active');
        return response.data;
    },

    create: async (data: CreateDiscountRequest): Promise<Discount> => {
        const response = await apiClient.post<Discount>('/Discounts', data);
        return response.data;
    },

    update: async (data: UpdateDiscountRequest): Promise<void> => {
        await apiClient.put(`/Discounts/${data.id}`, data);
    },

    delete: async (id: number): Promise<void> => {
        await apiClient.delete(`/Discounts/${id}`);
    },
};