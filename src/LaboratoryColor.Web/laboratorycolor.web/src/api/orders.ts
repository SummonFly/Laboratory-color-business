import { apiClient } from './client';

export type OrderStatus = 'New' | 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface OrderItemDto {
    id: number;
    productId: number;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
}

export interface OrderDto {
    id: number;
    status: OrderStatus;
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    comment: string | null;
    totalAmount: number;
    items: OrderItemDto[];
    createdAt: string;
}

export interface GetOrdersParams {
    fromDate?: string;
    toDate?: string;
    status?: OrderStatus;
}

export interface UpdateOrderStatusRequest {
    orderId: number;
    status: OrderStatus;
}

export const ordersAPI = {
    getAll: async (params?: GetOrdersParams): Promise<OrderDto[]> => {
        const response = await apiClient.get<OrderDto[]>('/Orders', { params });
        return response.data;
    },

    getById: async (id: number): Promise<OrderDto> => {
        const response = await apiClient.get<OrderDto>(`/Orders/${id}`);
        return response.data;
    },

    updateStatus: async (data: UpdateOrderStatusRequest): Promise<void> => {
        await apiClient.patch(`/Orders/${data.orderId}/status`, { status: data.status });
    },
};