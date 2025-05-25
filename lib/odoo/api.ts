import type {
  OdooLoginResponse,
  OdooError,
  OdooSearchParams,
  OdooListResponse,
  OdooCreateResponse,
} from '@/types';

class OdooAPIService {
  private uid: number | null = null;

  constructor() {
    // Restore session on initialization
    this.restoreSession();
  }

  private formatError(error: any): OdooError {
    if (error?.error) {
      return {
        code: error.error.code || 400,
        message: error.error.message || error.error,
      };
    }
    return {
      code: 500,
      message: error.message || 'Network Error',
    };
  }

  private clearSession() {
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
      this.clearSession();
      console.log('Logout successful');
    } catch (error) {
      console.warn('Logout error:', error);
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
    const authenticated = !!(this.uid);
    console.log(`Auth check: ${authenticated ? 'authenticated' : 'not authenticated'}`);
    return authenticated;
  }

  // Generic CRUD operations via API routes (to avoid CORS)
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
      console.log(`Creating ${model} with data:`, data);
      const response = await fetch('/api/odoo/operation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model,
          method: 'create',
          args: [data],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw this.formatError(errorData);
      }

      const result = await response.json();
      console.log(`Created record with ID: ${result}`);
      return { id: result };
    } catch (error) {
      console.error('Create operation failed:', error);
      throw this.formatError(error);
    }
  }

  async update(model: string, id: number, data: Record<string, any>): Promise<boolean> {
    try {
      console.log(`Updating ${model} ID ${id} with data:`, data);
      const response = await fetch('/api/odoo/operation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model,
          method: 'write',
          args: [[id], data],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw this.formatError(errorData);
      }

      const result = await response.json();
      console.log(`Update result: ${result}`);
      return result;
    } catch (error) {
      console.error('Update operation failed:', error);
      throw this.formatError(error);
    }
  }

  async delete(model: string, id: number): Promise<boolean> {
    try {
      console.log(`Deleting ${model} ID ${id}`);
      const response = await fetch('/api/odoo/operation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model,
          method: 'unlink',
          args: [[id]],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw this.formatError(errorData);
      }

      const result = await response.json();
      console.log(`Delete result: ${result}`);
      return result;
    } catch (error) {
      console.error('Delete operation failed:', error);
      throw this.formatError(error);
    }
  }

  // Get record by ID
  async getById<T>(model: string, id: number, fields?: string[]): Promise<T | null> {
    const result = await this.searchRead<T>(model, {
      domain: [['id', '=', id]] as any,
      fields: fields,
      limit: 1,
    });

    return result.records.length > 0 ? result.records[0] : null;
  }
}

// Export singleton instance
export const odooAPI = new OdooAPIService();
