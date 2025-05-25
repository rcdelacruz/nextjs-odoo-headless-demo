import { odooAPI } from './api';
import { COMMON_FIELDS, ODOO_DOMAINS } from './config';
import type {
  Student,
  StudentFormData,
  Partner,
  Course,
  OdooListResponse,
  OdooCreateResponse,
} from '@/types';

// Student Service
export class StudentService {
  private static model = 'res.partner'; // Students are partners with specific category

  static async getAll(limit = 50, offset = 0): Promise<OdooListResponse<Student>> {
    // Simplified query - just get individual partners that are customers
    // In a real implementation, you'd filter by a student category or custom field
    return odooAPI.searchRead<Student>(this.model, {
      domain: [
        ['is_company', '=', false],
        ['customer_rank', '>', 0], // Just get customer contacts as "students"
      ],
      fields: [...COMMON_FIELDS.base, ...COMMON_FIELDS.partner],
      limit,
      offset,
      order: 'name asc',
    });
  }

  static async getById(id: number): Promise<Student | null> {
    return odooAPI.getById<Student>(this.model, id, [
      ...COMMON_FIELDS.base,
      ...COMMON_FIELDS.partner,
    ]);
  }

  static async create(data: StudentFormData): Promise<OdooCreateResponse> {
    return odooAPI.create(this.model, {
      name: data.name,
      email: data.email,
      phone: data.phone,
      is_company: false,
      customer_rank: 1, // Mark as customer
      // Add student-specific fields if you have custom fields
      ...(data.student_id && { 'comment': `Student ID: ${data.student_id}` }),
    });
  }

  static async update(id: number, data: Partial<StudentFormData>): Promise<boolean> {
    const updateData: Record<string, any> = {};
    
    if (data.name) updateData.name = data.name;
    if (data.email) updateData.email = data.email;
    if (data.phone) updateData.phone = data.phone;
    if (data.student_id) updateData.comment = `Student ID: ${data.student_id}`;

    return odooAPI.update(this.model, id, updateData);
  }

  static async delete(id: number): Promise<boolean> {
    return odooAPI.delete(this.model, id);
  }

  static async search(term: string): Promise<OdooListResponse<Student>> {
    return odooAPI.searchRead<Student>(this.model, {
      domain: [
        ['is_company', '=', false],
        ['customer_rank', '>', 0],
        '|', '|',
        ['name', 'ilike', term],
        ['email', 'ilike', term],
        ['phone', 'ilike', term],
      ],
      fields: [...COMMON_FIELDS.base, ...COMMON_FIELDS.partner],
      limit: 20,
    });
  }
}

// Partner Service
export class PartnerService {
  private static model = 'res.partner';

  static async getCustomers(limit = 50, offset = 0): Promise<OdooListResponse<Partner>> {
    return odooAPI.searchRead<Partner>(this.model, {
      domain: ODOO_DOMAINS.customers,
      fields: [...COMMON_FIELDS.base, ...COMMON_FIELDS.partner],
      limit,
      offset,
      order: 'name asc',
    });
  }

  static async getSuppliers(limit = 50, offset = 0): Promise<OdooListResponse<Partner>> {
    return odooAPI.searchRead<Partner>(this.model, {
      domain: ODOO_DOMAINS.suppliers,
      fields: [...COMMON_FIELDS.base, ...COMMON_FIELDS.partner],
      limit,
      offset,
      order: 'name asc',
    });
  }

  static async getById(id: number): Promise<Partner | null> {
    return odooAPI.getById<Partner>(this.model, id, [
      ...COMMON_FIELDS.base,
      ...COMMON_FIELDS.partner,
      'street',
      'city',
      'country_id',
      'vat',
    ]);
  }

  static async create(data: Partial<Partner>): Promise<OdooCreateResponse> {
    return odooAPI.create(this.model, data);
  }

  static async update(id: number, data: Partial<Partner>): Promise<boolean> {
    return odooAPI.update(this.model, id, data);
  }

  static async delete(id: number): Promise<boolean> {
    return odooAPI.delete(this.model, id);
  }
}

// Course Service (if you have course model)
export class CourseService {
  private static model = 'school.course'; // Custom model

  static async getAll(limit = 50, offset = 0): Promise<OdooListResponse<Course>> {
    return odooAPI.searchRead<Course>(this.model, {
      domain: ODOO_DOMAINS.active,
      fields: [...COMMON_FIELDS.base, ...COMMON_FIELDS.course],
      limit,
      offset,
      order: 'name asc',
    });
  }

  static async getById(id: number): Promise<Course | null> {
    return odooAPI.getById<Course>(this.model, id, [
      ...COMMON_FIELDS.base,
      ...COMMON_FIELDS.course,
    ]);
  }

  static async create(data: Partial<Course>): Promise<OdooCreateResponse> {
    return odooAPI.create(this.model, data);
  }

  static async update(id: number, data: Partial<Course>): Promise<boolean> {
    return odooAPI.update(this.model, id, data);
  }

  static async delete(id: number): Promise<boolean> {
    return odooAPI.delete(this.model, id);
  }
}