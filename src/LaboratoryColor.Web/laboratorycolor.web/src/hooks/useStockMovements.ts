import { useQuery } from '@tanstack/react-query';
import { stockMovementsAPI } from '../api';
import type { GetStockMovementsParams, GetStockSummaryParams } from '../api';

export const STOCK_MOVEMENTS_QUERY_KEY = 'stock-movements';
export const STOCK_SUMMARY_QUERY_KEY = 'stock-summary';

export const useStockMovements = (params?: GetStockMovementsParams) => {
    return useQuery({
        queryKey: [STOCK_MOVEMENTS_QUERY_KEY, params],
        queryFn: () => stockMovementsAPI.getAll(params),
        staleTime: 1000 * 60, // 1 minute
    });
};

export const useStockSummary = (params?: GetStockSummaryParams) => {
    return useQuery({
        queryKey: [STOCK_SUMMARY_QUERY_KEY, params],
        queryFn: () => stockMovementsAPI.getSummary(params),
        staleTime: 1000 * 60, // 1 minute
    });
};

export const useProductStockHistory = (productId: number, fromDate?: string, toDate?: string) => {
    return useQuery({
        queryKey: [STOCK_MOVEMENTS_QUERY_KEY, 'product', productId, fromDate, toDate],
        queryFn: () => stockMovementsAPI.getProductHistory(productId, fromDate, toDate),
        enabled: !!productId,
    });
};