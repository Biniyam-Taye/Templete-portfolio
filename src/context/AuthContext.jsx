import React, { createContext, useContext, useState, useEffect } from 'react';
import { settingsApi } from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const key = localStorage.getItem('admin_secret_key');
            if (!key) {
                setIsAuthenticated(false);
                setIsLoaded(true);
                return;
            }

            try {
                // Verify the stored key with the server
                await settingsApi.verify();
                setIsAuthenticated(true);
            } catch (err) {
                console.error('Auth verification failed:', err);
                // If it's a 401, the key is invalid (maybe changed elsewhere)
                localStorage.removeItem('admin_secret_key');
                setIsAuthenticated(false);
            } finally {
                setIsLoaded(true);
            }
        };

        checkAuth();
    }, []);

    const login = async (key) => {
        // Temporarily set the key in localStorage so verify() can use it
        const originalKey = localStorage.getItem('admin_secret_key');
        localStorage.setItem('admin_secret_key', key);
        
        try {
            await settingsApi.verify();
            setIsAuthenticated(true);
            return true;
        } catch (err) {
            console.error('Login verification failed:', err);
            // Revert or clear
            if (originalKey) {
                localStorage.setItem('admin_secret_key', originalKey);
            } else {
                localStorage.removeItem('admin_secret_key');
            }
            setIsAuthenticated(false);
            return false;
        }
    };

    const forceLoginState = (key) => {
        // Useful after password change when we already KNOW the new key is correct
        localStorage.setItem('admin_secret_key', key);
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem('admin_secret_key');
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, isLoaded, login, logout, forceLoginState }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAdminAuth = () => useContext(AuthContext);
