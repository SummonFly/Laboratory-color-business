import { apiClient } from './client';
import type { Discount } from '../types';

export type DiscountType = 'Percentage' | 'FixedAmount';
export type DiscountRuleType = 'All' | 'Category' | 'Product' | 'AttributeValue' | 'CustomerRole' | 'TotalAmount';


export const discountTypeToNumber = (type: DiscountType): number => {
    return type === 'Percentage' ? 1 : 2; // Percentage = 1, FixedAmount = 2
};

export const discountTypeToString = (type: number): DiscountType => {
    return type === 1 ? 'Percentage' : 'FixedAmount';
};

export const ruleTypeToNumber = (type: DiscountRuleType): number => {
    const map: Record<DiscountRuleType, number> = {
        'All': 1,
        'Category': 2,
        'Product': 3,
        'AttributeValue': 4,
        'CustomerRole': 5,
        'TotalAmount': 6,
    };
    return map[type];
};

export const ruleTypeToString = (type: number): DiscountRuleType => {
    const map: Record<number, DiscountRuleType> = {
        1: 'All',
        2: 'Category',
        3: 'Product',
        4: 'AttributeValue',
        5: 'CustomerRole',
        6: 'TotalAmount',
    };
    return map[type];
};



export interface CreateDiscountRuleRequest {
    ruleType: number; 
    ruleValue: string;
}

export interface CreateCouponRequest {
    code: string;
    usageLimit?: number;
    userId?: string;
}

export interface CreateDiscountRequest {
    name: string;
    description?: string;
    discountType: number;
    discountValue: number;
    startDate: string;
    endDate: string;
    priority: number;
    rules: CreateDiscountRuleRequest[];
    coupons?: CreateCouponRequest[];
}

export interface UpdateDiscountRequest {
    id: number;
    name: string;
    description?: string;
    discountType: number;
    discountValue: number;
    startDate: string;
    endDate: string;
    priority: number;
    isActive: boolean;
}

export interface ValidateCouponResponse {
    isValid: boolean;
    message: string;
    discount: Discount | null;
    discountAmount: number | null;
}

export interface GetDiscountsParams {
    isActive?: boolean;
    date?: string;
}

export const discountsAPI = {
    getAll: async (params?: GetDiscountsParams): Promise<Discount[]> => {
        const response = await apiClient.get<Discount[]>('/Discounts', { params });
        return response.data;
    },

    getById: async (id: number): Promise<Discount> => {
        const response = await apiClient.get<Discount>(`/Discounts/${id}`);
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

    validateCoupon: async (code: string, userId?: string, orderTotal?: number): Promise<ValidateCouponResponse> => {
        const response = await apiClient.get<ValidateCouponResponse>('/Discounts/validate-coupon', {
            params: { code, userId, orderTotal },
        });
        return response.data;
    },
};

