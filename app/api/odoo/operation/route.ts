import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { model, method, args, kwargs, domain, fields, limit, offset, order } = await request.json();

    console.log('API Route: Demo mode - returning mock data for:', { model, method });
    console.log('API Route: Domain:', domain);

    // DEMO MODE ONLY - Always return mock data
    // This ensures the demo works without any Odoo setup
    
    if (method === 'search_read' && model === 'res.partner') {
      console.log('API Route: Returning mock partner data');
      
      // Check domain to determine what type of partners to return
      const isCustomer = domain?.some((d: any) => Array.isArray(d) && d[0] === 'customer_rank' && d[1] === '>' && d[2] === 0);
      const isSupplier = domain?.some((d: any) => Array.isArray(d) && d[0] === 'supplier_rank' && d[1] === '>' && d[2] === 0);
      
      let mockData = [];
      
      if (isCustomer) {
        mockData = [
          {
            id: 1,
            name: 'John Doe',
            email: 'john@demo.com',
            phone: '+1234567890',
            is_company: false,
            customer_rank: 1,
            supplier_rank: 0,
            create_date: '2024-01-01 10:00:00',
          },
          {
            id: 2,
            name: 'Jane Smith',
            email: 'jane@demo.com',
            phone: '+0987654321',
            is_company: false,
            customer_rank: 1,
            supplier_rank: 0,
            create_date: '2024-01-02 11:00:00',
          },
          {
            id: 4,
            name: 'Demo Corporation',
            email: 'info@democorp.com',
            phone: '+1122334455',
            is_company: true,
            customer_rank: 1,
            supplier_rank: 0,
            create_date: '2024-01-04 13:00:00',
          },
        ];
      } else if (isSupplier) {
        mockData = [
          {
            id: 3,
            name: 'Supplier Inc',
            email: 'supplier@demo.com',
            phone: '+5566778899',
            is_company: true,
            customer_rank: 0,
            supplier_rank: 1,
            create_date: '2024-01-03 12:00:00',
          },
          {
            id: 5,
            name: 'Office Supplies Co',
            email: 'office@supplies.com',
            phone: '+9988776655',
            is_company: true,
            customer_rank: 0,
            supplier_rank: 1,
            create_date: '2024-01-05 14:00:00',
          },
        ];
      } else {
        // Return all records for general search (students)
        mockData = [
          {
            id: 1,
            name: 'John Doe',
            email: 'john@demo.com',
            phone: '+1234567890',
            is_company: false,
            customer_rank: 1,
            supplier_rank: 0,
            create_date: '2024-01-01 10:00:00',
          },
          {
            id: 2,
            name: 'Jane Smith',
            email: 'jane@demo.com',
            phone: '+0987654321',
            is_company: false,
            customer_rank: 1,
            supplier_rank: 0,
            create_date: '2024-01-02 11:00:00',
          },
          {
            id: 6,
            name: 'Mike Johnson',
            email: 'mike@demo.com',
            phone: '+1357924680',
            is_company: false,
            customer_rank: 1,
            supplier_rank: 0,
            create_date: '2024-01-06 15:00:00',
          },
        ];
      }

      return NextResponse.json({
        records: mockData,
        length: mockData.length,
      });
    }

    if (method === 'create' && model === 'res.partner') {
      console.log('API Route: Mock create partner');
      const newId = Math.floor(Math.random() * 1000) + 100;
      return NextResponse.json(newId);
    }

    if (method === 'write' && model === 'res.partner') {
      console.log('API Route: Mock update partner');
      return NextResponse.json(true);
    }

    if (method === 'unlink' && model === 'res.partner') {
      console.log('API Route: Mock delete partner');
      return NextResponse.json(true);
    }

    // Default fallback for any other operations
    console.log('API Route: Default mock response for:', method);
    return NextResponse.json({
      records: [],
      length: 0,
    });

  } catch (error: any) {
    console.error('API Route: Error in demo mode:', error.message);
    
    // Always return success in demo mode
    return NextResponse.json({
      records: [
        {
          id: 999,
          name: 'Demo User',
          email: 'demo@example.com',
          phone: '+1234567890',
          is_company: false,
          customer_rank: 1,
          supplier_rank: 0,
          create_date: '2024-01-01 10:00:00',
        },
      ],
      length: 1,
    });
  }
}
