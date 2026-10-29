import { apiClient } from './client';
import type { Supplier } from '../types';

export interface CreateSupplierRequest {
    name: string;
    contactPerson?: string;
    email?: string;
    phone?: string;
    address?: string;
    inn?: string;
    bankDetails?: string;
    isActive?: boolean;
}

export interface UpdateSupplierRequest {
    id: number;
    name: string;
    contactPerson?: string;
    email?: string;
    phone?: string;
    address?: string;
    inn?: string;
    bankDetails?: string;
    isActive?: boolean;
}

export interface GetSuppliersParams {
    isActive?: boolean;
    search?: string;
}

export const suppliersAPI = {
    getAll: async (params?: GetSuppliersParams): Promise<Supplier[]> => {
        const response = await apiClient.get<Supplier[]>('/Suppliers', { params });
        return response.data;
    },

    getById: async (id: number): Promise<Supplier> => {
        const response = await apiClient.get<Supplier>(`/Suppliers/${id}`);
        return response.data;
    },

    create: async (data: CreateSupplierRequest): Promise<Supplier> => {
        const response = await apiClient.post<Supplier>('/Suppliers', data);
        return response.data;
    },

    update: async (data: UpdateSupplierRequest): Promise<void> => {
        await apiClient.put(`/Suppliers/${data.id}`, data);
    },

    delete: async (id: number): Promise<void> => {
        await apiClient.delete(`/Suppliers/${id}`);
    },
};