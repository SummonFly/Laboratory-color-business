import { apiClient } from './client';
import type { AuthResponse, IdentityResult, ApplicationUser } from '../types';

export interface LoginRequest {
    userName: string;
    password: string;
}

export interface RegisterRequest {
    userName: string;
    email: string;
    password: string;
}

export interface RefreshTokenRequest {
    refreshToken: string;
}

export const authAPI = {
    login: async (data: LoginRequest): Promise<AuthResponse> => {
        const response = await apiClient.post<AuthResponse>('/Auth/login', data);
        return response.data;
    },

    register: async (data: RegisterRequest): Promise<IdentityResult> => {
        const response = await apiClient.post<IdentityResult>('/Auth/register', data);
        return response.data;
    },

    refreshToken: async (data: RefreshTokenRequest): Promise<AuthResponse> => {
        const response = await apiClient.post<AuthResponse>('/Auth/refresh', data);
        return response.data;
    },

    getCurrentUser: async (): Promise<ApplicationUser> => {
        const response = await apiClient.get<ApplicationUser>('/Auth/me');
        return response.data;
    },

    logout: async (): Promise<void> => {
        await apiClient.post('/Auth/logout');
    },
};