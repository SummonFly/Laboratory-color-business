import { useQuery } from '@tanstack/react-query';
import { dashboardAPI } from '../api';
import type { GetDashboardParams } from '../api';

export const DASHBOARD_QUERY_KEY = 'dashboard';

export const useDashboard = (params?: GetDashboardParams) => {
    return useQuery({
        queryKey: [DASHBOARD_QUERY_KEY, params],
        queryFn: () => dashboardAPI.getDashboard(params),
        staleTime: 1000 * 30, // 30 seconds
        refetchInterval: 30000, // Auto-refresh every 30 seconds
    });
};