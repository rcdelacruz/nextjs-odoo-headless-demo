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

// Student Types
export interface Student extends OdooRecord {
  name: string;
  email?: string;
  phone?: string;
  student_id?: string;
  enrollment_date?: string;
  course_ids?: number[];
  partner_id?: [number, string];
  active?: boolean;
}

export interface StudentFormData {
  name: string;
  email?: string;
  phone?: string;
  student_id?: string;
  enrollment_date?: string;
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

// Course Types
export interface Course extends OdooRecord {
  name: string;
  code?: string;
  description?: string;
  credits?: number;
  active?: boolean;
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