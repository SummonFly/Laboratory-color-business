import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersAPI } from '../api';
import type { GetOrdersParams, UpdateOrderStatusRequest } from '../api';
import { toast } from 'sonner';

export const ORDERS_QUERY_KEY = 'orders';

export const useOrders = (params?: GetOrdersParams) => {
    return useQuery({
        queryKey: [ORDERS_QUERY_KEY, params],
        queryFn: () => ordersAPI.getAll(params),
    });
};

export const useOrder = (id: number) => {
    return useQuery({
        queryKey: [ORDERS_QUERY_KEY, id],
        queryFn: () => ordersAPI.getById(id),
        enabled: !!id,
    });
};

export const useUpdateOrderStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateOrderStatusRequest) => ordersAPI.updateStatus(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [ORDERS_QUERY_KEY] });
            toast.success('Order status updated successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update order status');
        },
    });
};