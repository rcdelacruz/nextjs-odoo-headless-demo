import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthState, OdooLoginResponse } from '@/types';

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,

      login: async (username: string, password: string): Promise<boolean> => {
        try {
          console.log('🔐 Auth store: Starting login via Next.js API...');
          console.log(`👤 Auth store: Username: ${username}`);
          
          // Use Next.js API route instead of direct Odoo call (fixes CORS)
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
          });
          
          console.log('📡 Auth store: API response status:', response.status);
          
          if (!response.ok) {
            const errorData = await response.json();
            console.error('❌ Auth store: API error:', errorData);
            throw new Error(errorData.error || 'Authentication failed');
          }
          
          const result = await response.json();
          console.log('✅ Auth store: API login successful, result:', result);
          
          if (!result.uid) {
            console.error('❌ Auth store: No UID in result:', result);
            return false;
          }
          
          // Create compatible user object
          const user: OdooLoginResponse = {
            uid: result.uid,
            username: result.username,
            session_id: result.session_id,
            db: result.db,
            user_context: result.user_context || {},
            name: result.name,
            partner_id: result.partner_id,
          };
          
          console.log('💾 Auth store: Setting authentication state...');
          set({
            isAuthenticated: true,
            user: user,
          });
          
          // Store session in localStorage for persistence
          if (typeof window !== 'undefined') {
            localStorage.setItem('odoo_session', JSON.stringify({
              sessionId: result.session_id,
              uid: result.uid,
              username: result.username,
              db: result.db,
            }));
          }
          
          console.log('✅ Auth store: Login completed successfully!');
          return true;
        } catch (error: any) {
          console.error('💥 Auth store: Login failed with error:', error);
          console.error('🔍 Auth store: Error details:', {
            message: error.message,
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
          
          // Call logout API if available
          try {
            await fetch('/api/auth/logout', { method: 'POST' });
          } catch (error) {
            console.warn('⚠️ Auth store: Logout API error:', error);
          }
          
          // Clear localStorage
          if (typeof window !== 'undefined') {
            localStorage.removeItem('odoo_session');
          }
          
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
          
          if (typeof window !== 'undefined') {
            try {
              const stored = localStorage.getItem('odoo_session');
              if (stored) {
                const session = JSON.parse(stored);
                if (session.uid && session.sessionId) {
                  console.log('✅ Auth store: Session restored successfully');
                  set({ 
                    isAuthenticated: true,
                    user: {
                      uid: session.uid,
                      username: session.username,
                      session_id: session.sessionId,
                      db: session.db,
                      user_context: {},
                    }
                  });
                  return true;
                }
              }
            } catch (error) {
              console.warn('⚠️ Auth store: Failed to restore session:', error);
            }
          }
          
          console.log('❌ Auth store: No session to restore');
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
