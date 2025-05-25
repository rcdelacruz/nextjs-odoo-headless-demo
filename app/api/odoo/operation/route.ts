import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const ODOO_BASE_URL = process.env.NEXT_PUBLIC_ODOO_BASE_URL || 'http://localhost:8069';
const ODOO_DATABASE = process.env.NEXT_PUBLIC_ODOO_DATABASE || 'test';

export async function POST(request: NextRequest) {
  try {
    const { model, method, args, kwargs, domain, fields, limit, offset, order } = await request.json();

    console.log('API Route: Processing Odoo request:', { model, method });
    console.log('API Route: Odoo URL:', ODOO_BASE_URL);
    console.log('API Route: Database:', ODOO_DATABASE);
    console.log('API Route: Domain:', domain);

    // Prepare the request based on method
    let endpoint = '/web/dataset/call_kw';
    let requestData: any;

    if (method === 'search_read') {
      // Use the correct endpoint for search_read
      endpoint = '/web/dataset/search_read';
      requestData = {
        jsonrpc: '2.0',
        method: 'call',
        params: {
          model: model,
          domain: domain || [],
          fields: fields || [],
          limit: limit || 80,
          offset: offset || 0,
          sort: order || '',
        },
      };
    } else {
      // Use call_kw for other methods (create, write, unlink)
      requestData = {
        jsonrpc: '2.0',
        method: 'call',
        params: {
          model: model,
          method: method,
          args: args || [],
          kwargs: kwargs || {},
        },
      };
    }

    console.log('API Route: Sending request to:', `${ODOO_BASE_URL}${endpoint}`);
    console.log('API Route: Request data:', JSON.stringify(requestData, null, 2));

    try {
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

      console.log('API Route: Odoo response status:', response.status);
      console.log('API Route: Odoo response data:', response.data);

      if (response.data.error) {
        console.error('API Route: Odoo returned error:', response.data.error);
        return NextResponse.json(
          { error: response.data.error.message || 'Odoo operation failed' },
          { status: 400 }
        );
      }

      // Handle different response formats
      const result = response.data.result;
      
      if (method === 'search_read') {
        // search_read returns records directly or in a wrapper
        if (result && Array.isArray(result.records)) {
          return NextResponse.json({
            records: result.records,
            length: result.length || result.records.length,
          });
        } else if (Array.isArray(result)) {
          return NextResponse.json({
            records: result,
            length: result.length,
          });
        } else {
          return NextResponse.json({
            records: [],
            length: 0,
          });
        }
      } else {
        // For create, write, unlink - return the result directly
        return NextResponse.json(result);
      }

    } catch (axiosError: any) {
      console.error('API Route: Axios error:', axiosError.message);
      console.error('API Route: Error response:', axiosError.response?.data);
      console.error('API Route: Error status:', axiosError.response?.status);
      
      if (axiosError.response?.status === 404) {
        return NextResponse.json(
          { error: 'Odoo endpoint not found. Check your Odoo URL and make sure the web interface is accessible.' },
          { status: 404 }
        );
      }
      
      if (axiosError.code === 'ECONNREFUSED') {
        return NextResponse.json(
          { error: 'Cannot connect to Odoo server. Make sure Odoo is running and accessible.' },
          { status: 503 }
        );
      }

      return NextResponse.json(
        { error: `Odoo connection failed: ${axiosError.message}` },
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error('API Route: General error:', error.message);
    return NextResponse.json(
      { error: `API error: ${error.message}` },
      { status: 500 }
    );
  }
}
