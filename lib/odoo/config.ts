// Odoo Configuration
export const ODOO_CONFIG = {
  baseURL: process.env.ODOO_BASE_URL || 'http://localhost:8069',
  database: process.env.ODOO_DATABASE || 'odoo',
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

// Common Odoo domains
export const ODOO_DOMAINS = {
  active: [['active', '=', true]],
  customers: [['customer_rank', '>', 0]],
  suppliers: [['supplier_rank', '>', 0]],
  companies: [['is_company', '=', true]],
  individuals: [['is_company', '=', false]],
};

// Common field sets
export const COMMON_FIELDS = {
  base: ['id', 'display_name', 'create_date', 'write_date'],
  partner: ['name', 'email', 'phone', 'mobile', 'is_company', 'customer_rank', 'supplier_rank'],
  student: ['name', 'email', 'phone', 'student_id', 'enrollment_date', 'course_ids', 'active'],
  course: ['name', 'code', 'description', 'credits', 'active'],
};