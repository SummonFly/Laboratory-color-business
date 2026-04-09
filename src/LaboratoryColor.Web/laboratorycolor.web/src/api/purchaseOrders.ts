import { apiClient } from './client';
import type { PurchaseOrder, PurchaseOrderItem } from '../types';

export type PurchaseOrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface CreatePurchaseOrderRequest {
    supplierId: number;
    expectedDeliveryDate?: string;
    notes?: string;
    items: Omit<PurchaseOrderItem, 'id' | 'productName' | 'receivedQuantity' | 'isFullyReceived'>[];
}

export interface UpdatePurchaseOrderStatusRequest {
    id: number;
    status: PurchaseOrderStatus;
}

export interface ReceivePurchaseOrderRequest {
    id: number;
    items: {
        itemId: number;
        receivedQuantity: number;
    }[];
}

export const purchaseOrdersAPI = {
    getAll: async (): Promise<PurchaseOrder[]> => {
        const response = await apiClient.get<PurchaseOrder[]>('/PurchaseOrders');
        return response.data;
    },

    getById: async (id: number): Promise<PurchaseOrder> => {
        const response = await apiClient.get<PurchaseOrder>(`/PurchaseOrders/${id}`);
        return response.data;
    },

    create: async (data: CreatePurchaseOrderRequest): Promise<PurchaseOrder> => {
        const response = await apiClient.post<PurchaseOrder>('/PurchaseOrders', data);
        return response.data;
    },

    updateStatus: async (data: UpdatePurchaseOrderStatusRequest): Promise<void> => {
        await apiClient.patch(`/PurchaseOrders/${data.id}/status`, { status: data.status });
    },

    receive: async (data: ReceivePurchaseOrderRequest): Promise<void> => {
        await apiClient.post(`/PurchaseOrders/${data.id}/receive`, { items: data.items });
    },

    cancel: async (id: number): Promise<void> => {
        await apiClient.post(`/PurchaseOrders/${id}/cancel`);
    },
};