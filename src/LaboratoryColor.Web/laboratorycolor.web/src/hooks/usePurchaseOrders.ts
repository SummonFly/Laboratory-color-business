import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { purchaseOrdersAPI } from '../api';
import type { CreatePurchaseOrderRequest, UpdatePurchaseOrderStatusRequest, ReceivePurchaseOrderRequest, GetPurchaseOrdersParams } from '../api';
import { toast } from 'sonner';

export const PURCHASE_ORDERS_QUERY_KEY = 'purchase-orders';

export const usePurchaseOrders = (params?: GetPurchaseOrdersParams) => {
    return useQuery({
        queryKey: [PURCHASE_ORDERS_QUERY_KEY, params],
        queryFn: () => purchaseOrdersAPI.getAll(params),
    });
};

export const usePurchaseOrder = (id: number) => {
    return useQuery({
        queryKey: [PURCHASE_ORDERS_QUERY_KEY, id],
        queryFn: () => purchaseOrdersAPI.getById(id),
        enabled: !!id,
    });
};

export const useCreatePurchaseOrder = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreatePurchaseOrderRequest) => purchaseOrdersAPI.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [PURCHASE_ORDERS_QUERY_KEY] });
            toast.success('Purchase order created successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to create purchase order');
        },
    });
};

export const useUpdatePurchaseOrderStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdatePurchaseOrderStatusRequest) => purchaseOrdersAPI.updateStatus(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [PURCHASE_ORDERS_QUERY_KEY] });
            toast.success('Order status updated');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update status');
        },
    });
};

export const useReceivePurchaseOrder = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: ReceivePurchaseOrderRequest) => purchaseOrdersAPI.receive(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [PURCHASE_ORDERS_QUERY_KEY] });
            toast.success('Goods received successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to receive goods');
        },
    });
};