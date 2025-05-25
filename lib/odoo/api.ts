import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { ODOO_CONFIG, getApiHeaders } from './config';
import type {
  OdooLoginResponse,
  OdooError,
  OdooFilter,
  OdooSearchParams,
  OdooListResponse,
  OdooCreateResponse,
} from '@/types';

class OdooAPIService {
  private api: AxiosInstance;
  private sessionId: string | null = null;
  private uid: number | null = null;

  constructor() {
    this.api = axios.create({
      baseURL: ODOO_CONFIG.baseURL,
      timeout: ODOO_CONFIG.timeout,
      withCredentials: true,
    });

    // Request interceptor
    this.api.interceptors.request.use((config) => {
      config.headers = {
        ...config.headers,
        ...getApiHeaders(this.sessionId || undefined),
      };
      return config;
    });

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.clearSession();
        }
        return Promise.reject(this.formatError(error));
      }
    );
  }

  private formatError(error: any): OdooError {
    if (error.response?.data?.error) {
      return {
        code: error.response.status,
        message: error.response.data.error.message || 'Odoo API Error',
        data: error.response.data.error.data,
      };
    }
    return {
      code: error.response?.status || 500,
      message: error.message || 'Network Error',
    };
  }

  private clearSession() {
    this.sessionId = null;
    this.uid = null;
    localStorage.removeItem('odoo_session');
  }

  // Authentication
  async login(username: string, password: string): Promise<OdooLoginResponse> {
    try {
      const response: AxiosResponse = await this.api.post(ODOO_CONFIG.endpoints.login, {
        jsonrpc: '2.0',
        method: 'call',
        params: {
          db: ODOO_CONFIG.database,
          login: username,
          password: password,
        },
      });

      if (response.data.error) {
        throw new Error(response.data.error.message);
      }

      const result = response.data.result;
      this.sessionId = result.session_id;
      this.uid = result.uid;

      // Store session in localStorage
      localStorage.setItem('odoo_session', JSON.stringify({
        sessionId: this.sessionId,
        uid: this.uid,
        username: result.username,
        db: result.db,
      }));

      return result;
    } catch (error) {
      throw this.formatError(error);
    }
  }

  async logout(): Promise<void> {
    try {
      await this.api.post(ODOO_CONFIG.endpoints.logout, {
        jsonrpc: '2.0',
        method: 'call',
        params: {},
      });
    } catch (error) {
      console.warn('Logout error:', error);
    } finally {
      this.clearSession();
    }
  }

  // Restore session from localStorage
  restoreSession(): boolean {
    try {
      const stored = localStorage.getItem('odoo_session');
      if (stored) {
        const session = JSON.parse(stored);
        this.sessionId = session.sessionId;
        this.uid = session.uid;
        return true;
      }
    } catch (error) {
      console.warn('Failed to restore session:', error);
    }
    return false;
  }

  // Check if authenticated
  isAuthenticated(): boolean {
    return !!(this.sessionId && this.uid);
  }

  // Generic CRUD operations
  async searchRead<T>(
    model: string,
    params: OdooSearchParams = {}
  ): Promise<OdooListResponse<T>> {
    const response = await this.api.post(ODOO_CONFIG.endpoints.search_read, {
      jsonrpc: '2.0',
      method: 'call',
      params: {
        model: model,
        domain: params.domain || [],
        fields: params.fields || [],
        limit: params.limit || 80,
        offset: params.offset || 0,
        sort: params.order || '',
      },
    });

    if (response.data.error) {
      throw this.formatError(response.data.error);
    }

    return {
      records: response.data.result.records,
      length: response.data.result.length,
    };
  }

  async create(model: string, data: Record<string, any>): Promise<OdooCreateResponse> {
    const response = await this.api.post(ODOO_CONFIG.endpoints.create, {
      jsonrpc: '2.0',
      method: 'call',
      params: {
        model: model,
        method: 'create',
        args: [data],
        kwargs: {},
      },
    });

    if (response.data.error) {
      throw this.formatError(response.data.error);
    }

    return { id: response.data.result };
  }

  async update(model: string, id: number, data: Record<string, any>): Promise<boolean> {
    const response = await this.api.post(ODOO_CONFIG.endpoints.write, {
      jsonrpc: '2.0',
      method: 'call',
      params: {
        model: model,
        method: 'write',
        args: [[id], data],
        kwargs: {},
      },
    });

    if (response.data.error) {
      throw this.formatError(response.data.error);
    }

    return response.data.result;
  }

  async delete(model: string, id: number): Promise<boolean> {
    const response = await this.api.post(ODOO_CONFIG.endpoints.unlink, {
      jsonrpc: '2.0',
      method: 'call',
      params: {
        model: model,
        method: 'unlink',
        args: [[id]],
        kwargs: {},
      },
    });

    if (response.data.error) {
      throw this.formatError(response.data.error);
    }

    return response.data.result;
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