// Odoo API Types
export interface OdooLoginResponse {
  uid: number;
  session_id: string;
  username: string;
  user_context: Record<string, any>;
  db: string;
  name?: string;
  partner_id?: number;
}

export interface OdooError {
  code: number;
  message: string;
  data?: any;
}

export interface OdooRecord {
  id: number;
  display_name?: string;
  create_date?: string;
  write_date?: string;
  create_uid?: [number, string];
  write_uid?: [number, string];
}

// Student Types - Enhanced for Educational Management
export interface Student extends OdooRecord {
  name: string;
  email?: string;
  phone?: string;
  student_id?: string;
  enrollment_date?: string;
  course_ids?: number[];
  partner_id?: [number, string];
  active?: boolean;
  // Enhanced fields for Phase 1
  academic_year_id?: [number, string];
  grade_level?: string;
  section?: string;
  parent_ids?: number[];
  guardian_name?: string;
  guardian_phone?: string;
  guardian_email?: string;
  fee_structure_id?: [number, string];
  payment_status?: 'paid' | 'partial' | 'pending' | 'overdue';
  enrollment_status?: 'enrolled' | 'pending' | 'graduated' | 'dropped';
  birth_date?: string;
  address?: string;
  emergency_contact?: string;
  medical_info?: string;
}

export interface StudentFormData {
  name: string;
  email?: string;
  phone?: string;
  student_id?: string;
  enrollment_date?: string;
  // Enhanced form fields
  academic_year_id?: number;
  grade_level?: string;
  section?: string;
  guardian_name?: string;
  guardian_phone?: string;
  guardian_email?: string;
  birth_date?: string;
  address?: string;
  emergency_contact?: string;
}

// Partner Types
export interface Partner extends OdooRecord {
  name: string;
  email?: string;
  phone?: string;
  mobile?: string;
  is_company?: boolean;
  customer_rank?: number;
  supplier_rank?: number;
  street?: string;
  city?: string;
  country_id?: [number, string];
  vat?: string;
}

// Course Types - Enhanced for Educational Management
export interface Course extends OdooRecord {
  name: string;
  code?: string;
  description?: string;
  credits?: number;
  active?: boolean;
  // Enhanced fields
  department_id?: [number, string];
  instructor_id?: [number, string];
  academic_year_id?: [number, string];
  semester?: string;
  max_students?: number;
  enrolled_students?: number;
  schedule?: string;
  room?: string;
  prerequisites?: string;
  fee_amount?: number;
}

// Academic Year Types
export interface AcademicYear extends OdooRecord {
  name: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  enrollment_start?: string;
  enrollment_end?: string;
  active?: boolean;
}

// Enrollment Types
export interface Enrollment extends OdooRecord {
  student_id: [number, string];
  course_id: [number, string];
  academic_year_id: [number, string];
  enrollment_date: string;
  status: 'enrolled' | 'completed' | 'dropped' | 'pending';
  grade?: string;
  credits_earned?: number;
}

// Fee Structure Types
export interface FeeStructure extends OdooRecord {
  name: string;
  academic_year_id: [number, string];
  grade_level?: string;
  tuition_fee: number;
  miscellaneous_fee?: number;
  laboratory_fee?: number;
  library_fee?: number;
  total_amount: number;
  payment_terms?: string;
  due_date?: string;
}

// Payment Types
export interface Payment extends OdooRecord {
  student_id: [number, string];
  fee_structure_id: [number, string];
  amount: number;
  payment_date: string;
  payment_method: 'cash' | 'bank_transfer' | 'gcash' | 'paymaya' | 'credit_card';
  reference_number?: string;
  status: 'pending' | 'confirmed' | 'failed';
  receipt_number?: string;
}

// Grade Types
export interface Grade extends OdooRecord {
  student_id: [number, string];
  course_id: [number, string];
  academic_year_id: [number, string];
  semester?: string;
  midterm_grade?: number;
  final_grade?: number;
  overall_grade?: number;
  letter_grade?: string;
  remarks?: string;
  instructor_id?: [number, string];
}

// API Response Types
export interface OdooListResponse<T> {
  records: T[];
  length: number;
}

export interface OdooCreateResponse {
  id: number;
}

// Auth Store Types
export interface AuthState {
  isAuthenticated: boolean;
  user: OdooLoginResponse | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => boolean;
}

// Filter Types
export interface OdooFilter {
  field: string;
  operator: '=' | '!=' | '>' | '<' | '>=' | '<=' | 'like' | 'ilike' | 'in' | 'not in';
  value: any;
}

export interface OdooSearchParams {
  domain?: OdooFilter[];
  fields?: string[];
  limit?: number;
  offset?: number;
  order?: string;
}
