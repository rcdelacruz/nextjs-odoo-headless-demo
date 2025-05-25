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
          console.log('Auth: Starting login process for username:', username);
          
          // Use Next.js API route instead of direct Odoo call (fixes CORS)
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
          });
          
          console.log('Auth: API response status:', response.status);
          
          if (!response.ok) {
            const errorData = await response.json();
            console.error('Auth: API error:', errorData);
            throw new Error(errorData.error || 'Authentication failed');
          }
          
          const result = await response.json();
          console.log('Auth: Login successful for user:', result.username);
          
          if (!result.uid) {
            console.error('Auth: No UID in result');
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
          
          console.log('Auth: Setting authentication state');
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
          
          console.log('Auth: Login completed successfully');
          return true;
        } catch (error: any) {
          console.error('Auth: Login failed:', error.message);
          
          set({
            isAuthenticated: false,
            user: null,
          });
          return false;
        }
      },

      logout: async () => {
        try {
          console.log('Auth: Logging out user');
          
          // Call logout API if available
          try {
            await fetch('/api/auth/logout', { method: 'POST' });
          } catch (error) {
            console.warn('Auth: Logout API error:', error);
          }
          
          // Clear localStorage
          if (typeof window !== 'undefined') {
            localStorage.removeItem('odoo_session');
          }
          
          console.log('Auth: Logout completed');
        } catch (error) {
          console.warn('Auth: Logout error:', error);
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
          if (typeof window !== 'undefined') {
            try {
              const stored = localStorage.getItem('odoo_session');
              if (stored) {
                const session = JSON.parse(stored);
                if (session.uid && session.sessionId) {
                  console.log('Auth: Session restored for user:', session.username);
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
              console.warn('Auth: Failed to restore session:', error);
            }
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
