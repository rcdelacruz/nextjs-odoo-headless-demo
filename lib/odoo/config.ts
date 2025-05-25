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

// Common Odoo domains - Enhanced for Educational Management
export const ODOO_DOMAINS = {
  active: [['active', '=', true]],
  customers: [['is_company', '=', false]], // Individuals as "customers"
  suppliers: [['is_company', '=', true]], // Companies as "suppliers"
  companies: [['is_company', '=', true]],
  individuals: [['is_company', '=', false]],
  // Educational domains
  students: [['is_company', '=', false], ['customer_rank', '>', 0]],
  current_academic_year: [['is_current', '=', true]],
  enrolled_students: [['enrollment_status', '=', 'enrolled']],
  pending_payments: [['payment_status', 'in', ['pending', 'overdue']]],
};

// Common field sets - Enhanced for Educational Management
export const COMMON_FIELDS = {
  base: ['id', 'display_name', 'create_date', 'write_date'],
  partner: ['name', 'email', 'phone', 'mobile', 'is_company', 'active', 'comment'],
  student: [
    'name', 'email', 'phone', 'comment', 'active',
    // Only use existing res.partner fields for now
    'mobile', 'street', 'city', 'country_id', 'category_id'
  ],
  course: [
    'name', 'active', 'code', 'description', 'credits',
    // Enhanced course fields
    'department_id', 'instructor_id', 'academic_year_id', 'semester',
    'max_students', 'enrolled_students', 'schedule', 'room', 'prerequisites', 'fee_amount'
  ],
  academic_year: ['name', 'start_date', 'end_date', 'is_current', 'enrollment_start', 'enrollment_end', 'active'],
  enrollment: ['student_id', 'course_id', 'academic_year_id', 'enrollment_date', 'status', 'grade', 'credits_earned'],
  fee_structure: [
    'name', 'academic_year_id', 'grade_level', 'tuition_fee', 'miscellaneous_fee',
    'laboratory_fee', 'library_fee', 'total_amount', 'payment_terms', 'due_date'
  ],
  payment: [
    'student_id', 'fee_structure_id', 'amount', 'payment_date', 'payment_method',
    'reference_number', 'status', 'receipt_number'
  ],
  grade: [
    'student_id', 'course_id', 'academic_year_id', 'semester', 'midterm_grade',
    'final_grade', 'overall_grade', 'letter_grade', 'remarks', 'instructor_id'
  ],
};
