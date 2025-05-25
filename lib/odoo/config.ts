// Odoo Configuration
export const ODOO_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_ODOO_BASE_URL || 'http://localhost:8069',
  database: process.env.NEXT_PUBLIC_ODOO_DATABASE || 'odoo',
  timeout: 10000,
  endpoints: {
    login: '/web/session/authenticate',
    logout: '/web/session/destroy',
    search_read: '/web/dataset/search_read',
    call_kw: '/web/dataset/call_kw',
    create: '/web/dataset/call_kw',
    write: '/web/dataset/call_kw',
    unlink: '/web/dataset/call_kw',
  },
};

// API Headers
export const getApiHeaders = (sessionId?: string) => ({
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  ...(sessionId && { 'Cookie': `session_id=${sessionId}` }),
});

// Common Odoo domains - Using only fields that exist
export const ODOO_DOMAINS = {
  active: [['active', '=', true]],
  customers: [['is_company', '=', false]], // Individuals as "customers"
  suppliers: [['is_company', '=', true]], // Companies as "suppliers"
  companies: [['is_company', '=', true]],
  individuals: [['is_company', '=', false]],
};

// Common field sets - Using only fields that exist
export const COMMON_FIELDS = {
  base: ['id', 'display_name', 'create_date', 'write_date'],
  partner: ['name', 'email', 'phone', 'mobile', 'is_company', 'active', 'comment'],
  student: ['name', 'email', 'phone', 'comment', 'active'],
  course: ['name', 'active'],
};
