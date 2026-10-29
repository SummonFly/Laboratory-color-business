import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { devAPI } from '../api';
import { toast } from 'sonner';

export const DEV_STATUS_QUERY_KEY = 'dev-status';

export const useTestDataStatus = () => {
    return useQuery({
        queryKey: [DEV_STATUS_QUERY_KEY],
        queryFn: () => devAPI.getTestDataStatus(),
        staleTime: 1000 * 30, // 30 seconds
    });
};

export const useSeedTestData = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => devAPI.seedTestData(),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: [DEV_STATUS_QUERY_KEY] });
            toast.success(data.message || 'Test data seeded successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to seed test data');
        },
    });
};

export const useClearTestData = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => devAPI.clearTestData(),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: [DEV_STATUS_QUERY_KEY] });
            toast.success(data.message || 'Test data cleared successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to clear test data');
        },
    });
};