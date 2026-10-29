import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { discountsAPI } from '../api';
import type { CreateDiscountRequest, UpdateDiscountRequest, GetDiscountsParams } from '../api';
import { toast } from 'sonner';

export const DISCOUNTS_QUERY_KEY = 'discounts';

export const useDiscounts = (params?: GetDiscountsParams) => {
    return useQuery({
        queryKey: [DISCOUNTS_QUERY_KEY, params],
        queryFn: () => discountsAPI.getAll(params),
    });
};

export const useDiscount = (id: number) => {
    return useQuery({
        queryKey: [DISCOUNTS_QUERY_KEY, id],
        queryFn: () => discountsAPI.getById(id),
        enabled: !!id,
    });
};

export const useCreateDiscount = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateDiscountRequest) => discountsAPI.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [DISCOUNTS_QUERY_KEY] });
            toast.success('Discount created successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to create discount');
        },
    });
};

export const useUpdateDiscount = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateDiscountRequest) => discountsAPI.update(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [DISCOUNTS_QUERY_KEY] });
            toast.success('Discount updated successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update discount');
        },
    });
};

export const useDeleteDiscount = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => discountsAPI.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [DISCOUNTS_QUERY_KEY] });
            toast.success('Discount deleted successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to delete discount');
        },
    });
};

export const useValidateCoupon = () => {
    return useMutation({
        mutationFn: ({ code, userId, orderTotal }: { code: string; userId?: string; orderTotal?: number }) =>
            discountsAPI.validateCoupon(code, userId, orderTotal),
    });
};