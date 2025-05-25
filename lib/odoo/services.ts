import { odooAPI } from './api';
import { COMMON_FIELDS, ODOO_DOMAINS } from './config';
import type {
  Student,
  StudentFormData,
  Partner,
  Course,
  AcademicYear,
  Enrollment,
  FeeStructure,
  Payment,
  Grade,
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
        ['customer_rank', '>', 0], // Use Odoo 18 customer_rank field
      ],
      fields: [...COMMON_FIELDS.base, ...COMMON_FIELDS.student],
      limit,
      offset,
      order: 'name asc',
    });
  }

  static async getById(id: number): Promise<Student | null> {
    return odooAPI.getById<Student>(this.model, id, [
      ...COMMON_FIELDS.base,
      ...COMMON_FIELDS.student,
    ]);
  }

  static async create(data: StudentFormData): Promise<OdooCreateResponse> {
    // Create comprehensive comment with all enhanced data
    const enhancedInfo = [
      data.student_id ? `Student ID: ${data.student_id}` : '',
      data.grade_level ? `Grade: ${data.grade_level}` : '',
      data.section ? `Section: ${data.section}` : '',
      data.guardian_name ? `Guardian: ${data.guardian_name}` : '',
      data.guardian_phone ? `Guardian Phone: ${data.guardian_phone}` : '',
      data.guardian_email ? `Guardian Email: ${data.guardian_email}` : '',
      data.birth_date ? `Birth Date: ${data.birth_date}` : '',
      data.emergency_contact ? `Emergency: ${data.emergency_contact}` : '',
      data.enrollment_date ? `Enrolled: ${data.enrollment_date}` : ''
    ].filter(Boolean).join(' | ');

    return odooAPI.create(this.model, {
      name: data.name,
      email: data.email,
      phone: data.phone,
      mobile: data.guardian_phone, // Use mobile for guardian phone
      street: data.address, // Use street for address
      is_company: false,
      customer_rank: 1, // Mark as customer using Odoo 18 field
      // Store all enhanced info in comment field
      comment: enhancedInfo || `Student enrolled on ${new Date().toLocaleDateString()}`,
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
      fields: [...COMMON_FIELDS.base, ...COMMON_FIELDS.student],
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

// Course Service - Using mock data for demo
export class CourseService {
  private static model = 'product.template'; // Fallback to product template for demo

  static async getAll(limit = 50, offset = 0): Promise<OdooListResponse<Course>> {
    // For demo purposes, create mock course data
    const mockData: Course[] = [
      {
        id: 1,
        name: 'Mathematics 101',
        code: 'MATH101',
        description: 'Basic Mathematics for Grade 1',
        credits: 3,
        active: true,
        department_id: [1, 'Mathematics Department'],
        instructor_id: [1, 'John Doe'],
        academic_year_id: [1, '2024-2025'],
        semester: 'First Semester',
        max_students: 30,
        enrolled_students: 25,
        schedule: 'MWF 9:00-10:00 AM',
        room: 'Room 101',
        prerequisites: 'None',
        fee_amount: 5000,
        display_name: 'Mathematics 101',
        create_date: '2024-01-01',
        write_date: '2024-01-01'
      },
      {
        id: 2,
        name: 'English Literature',
        code: 'ENG201',
        description: 'Introduction to English Literature',
        credits: 3,
        active: true,
        department_id: [2, 'English Department'],
        instructor_id: [2, 'Jane Smith'],
        academic_year_id: [1, '2024-2025'],
        semester: 'First Semester',
        max_students: 25,
        enrolled_students: 20,
        schedule: 'TTH 10:00-11:30 AM',
        room: 'Room 205',
        prerequisites: 'Basic English',
        fee_amount: 4500,
        display_name: 'English Literature',
        create_date: '2024-01-01',
        write_date: '2024-01-01'
      },
      {
        id: 3,
        name: 'Science Laboratory',
        code: 'SCI301',
        description: 'Hands-on Science Experiments',
        credits: 4,
        active: true,
        department_id: [3, 'Science Department'],
        instructor_id: [3, 'Dr. Brown'],
        academic_year_id: [1, '2024-2025'],
        semester: 'First Semester',
        max_students: 20,
        enrolled_students: 18,
        schedule: 'MW 2:00-4:00 PM',
        room: 'Science Lab 1',
        prerequisites: 'Basic Science',
        fee_amount: 6000,
        display_name: 'Science Laboratory',
        create_date: '2024-01-01',
        write_date: '2024-01-01'
      }
    ];

    return {
      records: mockData.slice(offset, offset + limit),
      length: mockData.length,
      total_records: mockData.length
    };
  }

  static async getById(id: number): Promise<Course | null> {
    const result = await this.getAll();
    return result.records.find(course => course.id === id) || null;
  }

  static async create(data: Partial<Course>): Promise<OdooCreateResponse> {
    // For demo purposes, simulate creation
    console.log('Course creation simulated:', data);
    return { id: Math.floor(Math.random() * 1000) + 100 };
  }

  static async update(id: number, data: Partial<Course>): Promise<boolean> {
    // For demo purposes, simulate update
    console.log('Course update simulated:', { id, data });
    return true;
  }

  static async delete(id: number): Promise<boolean> {
    // For demo purposes, simulate deletion
    console.log('Course deletion simulated:', id);
    return true;
  }
}

// Academic Year Service - Using fallback approach with existing models
export class AcademicYearService {
  private static model = 'res.company'; // Fallback to company model for demo

  static async getAll(limit = 50, offset = 0): Promise<OdooListResponse<AcademicYear>> {
    // For demo purposes, create mock academic year data
    const mockData: AcademicYear[] = [
      {
        id: 1,
        name: '2024-2025',
        start_date: '2024-08-01',
        end_date: '2025-05-31',
        is_current: true,
        enrollment_start: '2024-06-01',
        enrollment_end: '2024-07-31',
        active: true,
        display_name: '2024-2025',
        create_date: '2024-01-01',
        write_date: '2024-01-01'
      },
      {
        id: 2,
        name: '2023-2024',
        start_date: '2023-08-01',
        end_date: '2024-05-31',
        is_current: false,
        enrollment_start: '2023-06-01',
        enrollment_end: '2023-07-31',
        active: true,
        display_name: '2023-2024',
        create_date: '2023-01-01',
        write_date: '2023-01-01'
      }
    ];

    return {
      records: mockData.slice(offset, offset + limit),
      length: mockData.length,
      total_records: mockData.length
    };
  }

  static async getCurrent(): Promise<AcademicYear | null> {
    const result = await this.getAll(1, 0);
    const currentYear = result.records.find(year => year.is_current);
    return currentYear || null;
  }

  static async create(data: Partial<AcademicYear>): Promise<OdooCreateResponse> {
    // For demo purposes, simulate creation
    console.log('Academic Year creation simulated:', data);
    return { id: Math.floor(Math.random() * 1000) + 100 };
  }
}

// Enrollment Service - Using mock data for demo
export class EnrollmentService {
  private static model = 'res.partner'; // Fallback to partner model for demo

  static async getByStudent(studentId: number): Promise<OdooListResponse<Enrollment>> {
    // For demo purposes, create mock enrollment data
    const mockData: Enrollment[] = [
      {
        id: 1,
        student_id: [studentId, 'Student Name'],
        course_id: [1, 'Mathematics 101'],
        academic_year_id: [1, '2024-2025'],
        enrollment_date: '2024-08-15',
        status: 'enrolled',
        grade: 'A',
        credits_earned: 3,
        display_name: 'Enrollment 1',
        create_date: '2024-08-15',
        write_date: '2024-08-15'
      }
    ];

    return {
      records: mockData,
      length: mockData.length,
      total_records: mockData.length
    };
  }

  static async enrollStudent(studentId: number, courseId: number, academicYearId: number): Promise<OdooCreateResponse> {
    // For demo purposes, simulate enrollment
    console.log('Student enrollment simulated:', { studentId, courseId, academicYearId });
    return { id: Math.floor(Math.random() * 1000) + 100 };
  }

  static async updateEnrollmentStatus(id: number, status: string): Promise<boolean> {
    // For demo purposes, simulate status update
    console.log('Enrollment status update simulated:', { id, status });
    return true;
  }
}
