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
          console.log('🔐 Auth store: Starting login process...');
          console.log(`👤 Auth store: Username: ${username}`);
          
          const result: OdooLoginResponse = await odooAPI.login(username, password);
          
          console.log('✅ Auth store: Odoo login successful, result:', result);
          
          if (!result) {
            console.error('❌ Auth store: No result returned from odooAPI.login');
            return false;
          }
          
          if (!result.uid) {
            console.error('❌ Auth store: No UID in result:', result);
            return false;
          }
          
          console.log('💾 Auth store: Setting authentication state...');
          set({
            isAuthenticated: true,
            user: result,
          });
          
          console.log('✅ Auth store: Login completed successfully!');
          return true;
        } catch (error: any) {
          console.error('💥 Auth store: Login failed with error:', error);
          console.error('🔍 Auth store: Error details:', {
            message: error.message,
            code: error.code,
            data: error.data,
            stack: error.stack?.substring(0, 200)
          });
          
          set({
            isAuthenticated: false,
            user: null,
          });
          return false;
        }
      },

      logout: async () => {
        try {
          console.log('🚪 Auth store: Logging out...');
          await odooAPI.logout();
          console.log('✅ Auth store: Logout successful');
        } catch (error) {
          console.warn('⚠️ Auth store: Logout error:', error);
        } finally {
          set({
            isAuthenticated: false,
            user: null,
          });
        }
      },

      checkAuth: (): boolean => {
        const { isAuthenticated } = get();
        
        console.log(`🔍 Auth store: Current auth state: ${isAuthenticated}`);
        
        if (!isAuthenticated) {
          // Try to restore session from localStorage
          console.log('🔄 Auth store: Trying to restore session...');
          const restored = odooAPI.restoreSession();
          if (restored) {
            console.log('✅ Auth store: Session restored successfully');
            set({ isAuthenticated: true });
            return true;
          } else {
            console.log('❌ Auth store: No session to restore');
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
