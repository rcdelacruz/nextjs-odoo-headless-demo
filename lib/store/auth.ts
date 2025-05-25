import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { odooAPI } from '@/lib/odoo/api';
import type { AuthState, OdooLoginResponse } from '@/types';

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,

      login: async (username: string, password: string): Promise<boolean> => {
        try {
          const result: OdooLoginResponse = await odooAPI.login(username, password);
          
          set({
            isAuthenticated: true,
            user: result,
          });
          
          return true;
        } catch (error) {
          console.error('Login failed:', error);
          set({
            isAuthenticated: false,
            user: null,
          });
          return false;
        }
      },

      logout: async () => {
        try {
          await odooAPI.logout();
        } catch (error) {
          console.warn('Logout error:', error);
        } finally {
          set({
            isAuthenticated: false,
            user: null,
          });
        }
      },

      checkAuth: (): boolean => {
        const { isAuthenticated } = get();
        
        if (!isAuthenticated) {
          // Try to restore session from localStorage
          const restored = odooAPI.restoreSession();
          if (restored) {
            set({ isAuthenticated: true });
            return true;
          }
        }
        
        return isAuthenticated;
      },
    }),
    {
      name: 'odoo-auth-store',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
    }
  )
);
