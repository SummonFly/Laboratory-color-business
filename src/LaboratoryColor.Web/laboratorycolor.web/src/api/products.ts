import { apiClient } from './client';
import type { Product } from '../types';

export interface CreateProductRequest {
    name: string;
    price: number;
    categoryId: number;
    description?: string;
}

export interface UpdateProductRequest {
    id: number;
    name: string;
    price: number;
    categoryId: number;
    description?: string;
}

export const productsAPI = {
    getAll: async (): Promise<Product[]> => {
        const response = await apiClient.get<Product[]>('/Products');
        return response.data;
    },

    getById: async (id: number): Promise<Product> => {
        const response = await apiClient.get<Product>(`/Products/${id}`);
        return response.data;
    },

    create: async (data: CreateProductRequest): Promise<Product> => {
        const response = await apiClient.post<Product>('/Products', data);
        return response.data;
    },

    update: async (data: UpdateProductRequest): Promise<void> => {
        await apiClient.put(`/Products/${data.id}`, data);
    },

    delete: async (id: number): Promise<void> => {
        await apiClient.delete(`/Products/${id}`);
    },
};