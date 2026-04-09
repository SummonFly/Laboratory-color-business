import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { suppliersAPI } from '../api';
import type { CreateSupplierRequest, UpdateSupplierRequest } from '../api';
import { toast } from 'sonner';

export const SUPPLIERS_QUERY_KEY = 'suppliers';

interface UseSuppliersParams {
    isActive?: boolean;
    search?: string;
}

export const useSuppliers = (params?: UseSuppliersParams) => {
    return useQuery({
        queryKey: [SUPPLIERS_QUERY_KEY, params],
        queryFn: () => suppliersAPI.getAll(params),
    });
};

export const useSupplier = (id: number) => {
    return useQuery({
        queryKey: [SUPPLIERS_QUERY_KEY, id],
        queryFn: () => suppliersAPI.getById(id),
        enabled: !!id,
    });
};

export const useCreateSupplier = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateSupplierRequest) => suppliersAPI.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [SUPPLIERS_QUERY_KEY] });
            toast.success('Supplier created successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to create supplier');
        },
    });
};

export const useUpdateSupplier = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateSupplierRequest) => suppliersAPI.update(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [SUPPLIERS_QUERY_KEY] });
            toast.success('Supplier updated successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update supplier');
        },
    });
};

export const useDeleteSupplier = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => suppliersAPI.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [SUPPLIERS_QUERY_KEY] });
            toast.success('Supplier deleted successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to delete supplier');
        },
    });
};