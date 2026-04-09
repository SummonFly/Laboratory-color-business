import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoriesAPI } from '../api';
import type { CreateCategoryRequest, UpdateCategoryRequest } from '../api';
import { toast } from 'sonner';

export const CATEGORIES_QUERY_KEY = 'categories';

export const useCategories = () => {
    return useQuery({
        queryKey: [CATEGORIES_QUERY_KEY],
        queryFn: () => categoriesAPI.getAll(),
    });
};

export const useCreateCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateCategoryRequest) => categoriesAPI.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [CATEGORIES_QUERY_KEY] });
            toast.success('Category created successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to create category');
        },
    });
};

export const useUpdateCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateCategoryRequest) => categoriesAPI.update(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [CATEGORIES_QUERY_KEY] });
            toast.success('Category updated successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update category');
        },
    });
};

export const useDeleteCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => categoriesAPI.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [CATEGORIES_QUERY_KEY] });
            toast.success('Category deleted successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to delete category');
        },
    });
};