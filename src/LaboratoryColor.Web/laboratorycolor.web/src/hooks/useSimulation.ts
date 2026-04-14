import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { simulationAPI } from '../api';
import type { SimulationConfig } from '../api';
import { toast } from 'sonner';

export const SIMULATION_STATUS_KEY = 'simulation-status';
export const SIMULATION_LOGS_KEY = 'simulation-logs';

export const useSimulationStatus = () => {
    return useQuery({
        queryKey: [SIMULATION_STATUS_KEY],
        queryFn: () => simulationAPI.getStatus(),
        refetchInterval: 5000, // Refresh every 5 seconds
        staleTime: 2000,
    });
};

export const useSimulationLogs = () => {
    return useQuery({
        queryKey: [SIMULATION_LOGS_KEY],
        queryFn: () => simulationAPI.getLogs(),
        refetchInterval: 3000, // Refresh every 3 seconds
        staleTime: 1000,
    });
};

export const useStartSimulation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => simulationAPI.start(),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: [SIMULATION_STATUS_KEY] });
            toast.success(data.message || 'Simulation started');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to start simulation');
        },
    });
};

export const useStopSimulation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => simulationAPI.stop(),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: [SIMULATION_STATUS_KEY] });
            toast.success(data.message || 'Simulation stopped');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to stop simulation');
        },
    });
};

export const useUpdateSimulationConfig = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (config: SimulationConfig) => simulationAPI.updateConfig(config),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: [SIMULATION_STATUS_KEY] });
            toast.success(data.message || 'Configuration updated');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update configuration');
        },
    });
};

export const useClearSimulationLogs = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => simulationAPI.clearLogs(),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: [SIMULATION_LOGS_KEY] });
            toast.success(data.message || 'Logs cleared');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to clear logs');
        },
    });
};