import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authAPI } from '../api';
import type { ApplicationUser, AuthResponse } from '../types';

interface AuthContextType {
    user: ApplicationUser | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (userName: string, password: string) => Promise<void>;
    register: (userName: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<ApplicationUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            const token = localStorage.getItem('access_token');
            if (!token) {
                setIsLoading(false);
                return;
            }

            try {
                const currentUser = await authAPI.getCurrentUser();
                setUser(currentUser);
            } catch (error) {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        loadUser();
    }, []);

    const login = async (userName: string, password: string) => {
        setIsLoading(true);
        try {
            const response: AuthResponse = await authAPI.login({ userName, password });

            localStorage.setItem('access_token', response.token);
            localStorage.setItem('refresh_token', response.refreshToken);

            setUser({
                id: response.userId,
                userName: response.userName,
                email: response.email,
            });
        } catch (error) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (userName: string, email: string, password: string) => {
        setIsLoading(true);
        try {
            const result = await authAPI.register({ userName, email, password });

            if (!result.succeeded) {
                throw new Error(result.errors.join(', '));
            }

            await login(userName, password);
        } catch (error) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        setIsLoading(true);
        try {
            await authAPI.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            setUser(null);
            setIsLoading(false);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                isLoading,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};