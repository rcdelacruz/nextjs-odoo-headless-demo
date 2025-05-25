import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const ODOO_BASE_URL = process.env.NEXT_PUBLIC_ODOO_BASE_URL || 'http://localhost:8069';
const ODOO_DATABASE = process.env.NEXT_PUBLIC_ODOO_DATABASE || 'test';

export async function POST(request: NextRequest) {
  try {
    const { model, method, args, kwargs, domain, fields, limit, offset, order } = await request.json();

    console.log('API Route: Odoo operation request:', { model, method });

    let endpoint = '/web/dataset/call_kw';
    let requestData: any = {
      jsonrpc: '2.0',
      method: 'call',
      params: {
        model,
        method,
        args: args || [],
        kwargs: kwargs || {},
      },
    };

    // Handle search_read specifically
    if (method === 'search_read') {
      endpoint = '/web/dataset/search_read';
      requestData = {
        jsonrpc: '2.0',
        method: 'call',
        params: {
          model,
          domain: domain || [],
          fields: fields || [],
          limit: limit || 80,
          offset: offset || 0,
          sort: order || '',
        },
      };
    }

    const response = await axios.post(
      `${ODOO_BASE_URL}${endpoint}`,
      requestData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      }
    );

    if (response.data.error) {
      console.error('API Route: Odoo error:', response.data.error);
      return NextResponse.json(
        { error: response.data.error.message || 'Odoo operation failed' },
        { status: 400 }
      );
    }

    console.log('API Route: Odoo operation successful');
    return NextResponse.json(response.data.result);
  } catch (error: any) {
    console.error('API Route: Odoo operation error:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      return NextResponse.json(
        { error: 'Cannot connect to Odoo server' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: 'Odoo operation failed' },
      { status: 500 }
    );
  }
}
