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
      console.log(`🔄 API Request: ${config.method?.toUpperCase()} ${config.url}`);
      console.log('📤 Request data:', config.data);
      console.log('🔗 Base URL:', config.baseURL);
      
      config.headers = {
        ...config.headers,
        ...getApiHeaders(this.sessionId || undefined),
      };
      return config;
    });

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => {
        console.log(`✅ API Response: ${response.status}`);
        console.log('📥 Response data:', response.data);
        return response;
      },
      (error) => {
        console.error(`❌ API Error:`, error.message);
        console.error('🔍 Error details:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          config: {
            url: error.config?.url,
            method: error.config?.method,
            baseURL: error.config?.baseURL,
          }
        });
        
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
    if (typeof window !== 'undefined') {
      localStorage.removeItem('odoo_session');
    }
  }

  // Authentication
  async login(username: string, password: string): Promise<OdooLoginResponse> {
    try {
      console.log(`🔐 Starting login process...`);
      console.log(`👤 Username: ${username}`);
      console.log(`🔗 Odoo URL: ${ODOO_CONFIG.baseURL}`);
      console.log(`🗄️ Database: ${ODOO_CONFIG.database}`);
      console.log(`📡 Endpoint: ${ODOO_CONFIG.endpoints.login}`);

      const loginData = {
        jsonrpc: '2.0',
        method: 'call',
        params: {
          db: ODOO_CONFIG.database,
          login: username,
          password: password,
        },
      };

      console.log('📤 Login payload:', { ...loginData, params: { ...loginData.params, password: '***' } });

      const response: AxiosResponse = await this.api.post(ODOO_CONFIG.endpoints.login, loginData);

      console.log('📊 Raw login response:', response.data);

      if (response.data.error) {
        console.error('🚫 Odoo returned error:', response.data.error);
        throw new Error(response.data.error.message || 'Authentication failed');
      }

      const result = response.data.result;
      
      if (!result) {
        console.error('🚫 No result in response');
        throw new Error('No result returned from Odoo');
      }

      if (!result.uid) {
        console.error('🚫 No UID in response, login failed');
        console.error('Result object:', result);
        throw new Error('Invalid credentials - no user ID returned');
      }

      this.sessionId = result.session_id;
      this.uid = result.uid;

      console.log(`✅ Login successful!`);
      console.log(`👤 UID: ${result.uid}`);
      console.log(`🔑 Session: ${result.session_id?.substring(0, 10)}...`);
      console.log(`👤 Username: ${result.username}`);
      console.log(`🗄️ Database: ${result.db}`);

      // Store session in localStorage
      if (typeof window !== 'undefined') {
        const sessionData = {
          sessionId: this.sessionId,
          uid: this.uid,
          username: result.username,
          db: result.db,
        };
        localStorage.setItem('odoo_session', JSON.stringify(sessionData));
        console.log('💾 Session stored in localStorage');
      }

      return result;
    } catch (error: any) {
      console.error('💥 Login failed with error:', error);
      
      if (error.code === 'ECONNREFUSED') {
        console.error('🔌 Connection refused - Odoo server may not be running');
      } else if (error.code === 'ETIMEDOUT') {
        console.error('⏰ Connection timeout - Odoo server may be slow or unreachable');
      } else if (error.response?.status === 404) {
        console.error('🔍 404 Not Found - Check if the endpoint URL is correct');
      }
      
      throw this.formatError(error);
    }
  }

  async logout(): Promise<void> {
    try {
      console.log('🚪 Logging out...');
      await this.api.post(ODOO_CONFIG.endpoints.logout, {
        jsonrpc: '2.0',
        method: 'call',
        params: {},
      });
      console.log('✅ Logout successful');
    } catch (error) {
      console.warn('⚠️ Logout error:', error);
    } finally {
      this.clearSession();
    }
  }

  // Restore session from localStorage
  restoreSession(): boolean {
    try {
      if (typeof window === 'undefined') {
        console.log('🔄 SSR detected, skipping session restore');
        return false;
      }
      
      const stored = localStorage.getItem('odoo_session');
      if (stored) {
        const session = JSON.parse(stored);
        this.sessionId = session.sessionId;
        this.uid = session.uid;
        console.log(`🔄 Session restored: UID ${session.uid}`);
        return true;
      } else {
        console.log('🔄 No stored session found');
      }
    } catch (error) {
      console.warn('⚠️ Failed to restore session:', error);
    }
    return false;
  }

  // Check if authenticated
  isAuthenticated(): boolean {
    const authenticated = !!(this.sessionId && this.uid);
    console.log(`🔍 Auth check: ${authenticated ? 'authenticated' : 'not authenticated'}`);
    return authenticated;
  }

  // Generic CRUD operations
  async searchRead<T>(
    model: string,
    params: OdooSearchParams = {}
  ): Promise<OdooListResponse<T>> {
    console.log(`🔍 Searching ${model} with params:`, params);
    
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

    const result = {
      records: response.data.result.records,
      length: response.data.result.length,
    };
    
    console.log(`📋 Found ${result.records.length} records`);
    return result;
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
