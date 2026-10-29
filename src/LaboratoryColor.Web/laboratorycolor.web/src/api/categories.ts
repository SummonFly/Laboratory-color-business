import { apiClient } from './client';
import type { Category } from '../types';

export interface CreateCategoryRequest {
    name: string;
    description?: string;
    imageUrl?: string;
}

export interface UpdateCategoryRequest {
    id: number;
    name: string;
    description?: string;
    imageUrl?: string;
}

export const categoriesAPI = {
    getAll: async (): Promise<Category[]> => {
        const response = await apiClient.get<Category[]>('/Categories');
        return response.data;
    },

    getById: async (id: number): Promise<Category> => {
        const response = await apiClient.get<Category>(`/Categories/${id}`);
        return response.data;
    },

    create: async (data: CreateCategoryRequest): Promise<Category> => {
        const response = await apiClient.post<Category>('/Categories', data);
        return response.data;
    },

    update: async (data: UpdateCategoryRequest): Promise<void> => {
        await apiClient.put(`/Categories/${data.id}`, data);
    },

    delete: async (id: number): Promise<void> => {
        await apiClient.delete(`/Categories/${id}`);
    },
};