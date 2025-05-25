import type {
  OdooLoginResponse,
  OdooError,
  OdooFilter,
  OdooSearchParams,
  OdooListResponse,
  OdooCreateResponse,
} from '@/types';

class OdooAPIService {
  private sessionId: string | null = null;
  private uid: number | null = null;

  constructor() {
    // Restore session on initialization
    this.restoreSession();
  }

  private formatError(error: any): OdooError {
    if (error?.error) {
      return {
        code: 400,
        message: error.error,
      };
    }
    return {
      code: 500,
      message: error.message || 'Network Error',
    };
  }

  private clearSession() {
    this.sessionId = null;
    this.uid = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('odoo_session');
    }
  }

  // Authentication - this already works via API route
  async login(username: string, password: string): Promise<OdooLoginResponse> {
    // This method should not be used directly - use the auth store instead
    throw new Error('Use auth store login method instead');
  }

  async logout(): Promise<void> {
    try {
      console.log('Logging out...');
      await fetch('/api/auth/logout', { method: 'POST' });
      console.log('Logout successful');
    } catch (error) {
      console.warn('Logout error:', error);
    } finally {
      this.clearSession();
    }
  }

  // Restore session from localStorage
  restoreSession(): boolean {
    try {
      if (typeof window === 'undefined') {
        console.log('SSR detected, skipping session restore');
        return false;
      }
      
      const stored = localStorage.getItem('odoo_session');
      if (stored) {
        const session = JSON.parse(stored);
        this.sessionId = session.sessionId;
        this.uid = session.uid;
        console.log(`Session restored: UID ${session.uid}`);
        return true;
      } else {
        console.log('No stored session found');
      }
    } catch (error) {
      console.warn('Failed to restore session:', error);
    }
    return false;
  }

  // Check if authenticated
  isAuthenticated(): boolean {
    const authenticated = !!(this.sessionId && this.uid);
    console.log(`Auth check: ${authenticated ? 'authenticated' : 'not authenticated'}`);
    return authenticated;
  }

  // Generic CRUD operations via Next.js API routes
  async searchRead<T>(
    model: string,
    params: OdooSearchParams = {}
  ): Promise<OdooListResponse<T>> {
    console.log(`Searching ${model} with params:`, params);
    
    try {
      const response = await fetch('/api/odoo/operation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model,
          method: 'search_read',
          domain: params.domain || [],
          fields: params.fields || [],
          limit: params.limit || 80,
          offset: params.offset || 0,
          order: params.order || '',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw this.formatError(errorData);
      }

      const result = await response.json();
      
      // Handle different response formats
      if (result.records) {
        console.log(`Found ${result.records.length} records`);
        return {
          records: result.records,
          length: result.length || result.records.length,
        };
      } else if (Array.isArray(result)) {
        console.log(`Found ${result.length} records`);
        return {
          records: result,
          length: result.length,
        };
      } else {
        console.log('No records found');
        return {
          records: [],
          length: 0,
        };
      }
    } catch (error) {
      console.error('Search operation failed:', error);
      throw this.formatError(error);
    }
  }

  async create(model: string, data: Record<string, any>): Promise<OdooCreateResponse> {
    try {
      const response = await fetch('/api/odoo/operation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model,
          method: 'create',
          args: [data],
          kwargs: {},
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw this.formatError(errorData);
      }

      const result = await response.json();
      return { id: result };
    } catch (error) {
      console.error('Create operation failed:', error);
      throw this.formatError(error);
    }
  }

  async update(model: string, id: number, data: Record<string, any>): Promise<boolean> {
    try {
      const response = await fetch('/api/odoo/operation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model,
          method: 'write',
          args: [[id], data],
          kwargs: {},
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw this.formatError(errorData);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Update operation failed:', error);
      throw this.formatError(error);
    }
  }

  async delete(model: string, id: number): Promise<boolean> {
    try {
      const response = await fetch('/api/odoo/operation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model,
          method: 'unlink',
          args: [[id]],
          kwargs: {},
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw this.formatError(errorData);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Delete operation failed:', error);
      throw this.formatError(error);
    }
  }

  // Get record by ID
  async getById<T>(model: string, id: number, fields?: string[]): Promise<T | null> {
    const result = await this.searchRead<T>(model, {
      domain: [['id', '=', id]],
      fields: fields,
      limit: 1,
    });

    return result.records.length > 0 ? result.records[0] : null;
  }
}

// Export singleton instance
export const odooAPI = new OdooAPIService();
