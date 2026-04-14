import { apiClient } from './client';
import type { PurchaseOrder } from '../types';

export type PurchaseOrderStatus = 'Pending' | 'Shipped' | 'Received' | 'Cancelled';

export interface GetPurchaseOrdersParams {
    supplierId?: number;
    status?: PurchaseOrderStatus;
    fromDate?: string;
    toDate?: string;
}

export interface CreatePurchaseOrderItemRequest {
    productId: number;
    quantity: number;
    unitPrice: number;
}

export interface CreatePurchaseOrderRequest {
    supplierId: number;
    expectedDeliveryDate?: string;
    notes?: string;
    items: CreatePurchaseOrderItemRequest[];
}

export interface UpdatePurchaseOrderStatusRequest {
    purchaseOrderId: number;
    status: number; 
}

export interface ReceivePurchaseOrderItemRequest {
    itemId: number;
    receivedQuantity: number;
}

export interface ReceivePurchaseOrderRequest {
    purchaseOrderId: number;
    items: ReceivePurchaseOrderItemRequest[];
}

export const purchaseOrdersAPI = {
    getAll: async (params?: GetPurchaseOrdersParams): Promise<PurchaseOrder[]> => {
        const response = await apiClient.get<PurchaseOrder[]>('/PurchaseOrders', { params });
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
        await apiClient.patch(`/PurchaseOrders/${data.purchaseOrderId}/status`, {
            purchaseOrderId: data.purchaseOrderId,
            status: data.status,
        });
    },

    receive: async (data: ReceivePurchaseOrderRequest): Promise<void> => {
        await apiClient.post(`/PurchaseOrders/${data.purchaseOrderId}/receive`, { items: data.items });
    },
};