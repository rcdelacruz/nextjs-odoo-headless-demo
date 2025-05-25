import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const ODOO_BASE_URL = process.env.NEXT_PUBLIC_ODOO_BASE_URL || 'http://localhost:8069';
const ODOO_DATABASE = process.env.NEXT_PUBLIC_ODOO_DATABASE || 'test';
const ODOO_USERNAME = process.env.ODOO_USERNAME || 'admin';
const ODOO_API_KEY = process.env.ODOO_API_KEY;
const ODOO_PASSWORD = process.env.ODOO_PASSWORD;

export async function POST(request: NextRequest) {
  try {
    const { model, method, args, kwargs, domain, fields, limit, offset, order } = await request.json();

    console.log('=== ODOO API DEBUG ===');
    console.log('URL:', ODOO_BASE_URL);
    console.log('Database:', ODOO_DATABASE);
    console.log('Request:', { model, method, domain, fields });
    console.log('Using API Key:', !!ODOO_API_KEY);

    // Use the JSONRPC endpoint that actually works
    const endpoint = '/jsonrpc';

    let requestData: any = {
      jsonrpc: '2.0',
      method: 'call',
      id: Math.floor(Math.random() * 1000000),
      params: {}
    };

    // Use API key if available, otherwise password
    const authCredential = ODOO_API_KEY || ODOO_PASSWORD;

    if (method === 'search_read') {
      requestData.params = {
        service: 'object',
        method: 'execute',
        args: [
          ODOO_DATABASE,
          2, // Use your UID directly since auth is working
          authCredential,
          model,
          'search_read',
          domain || [],
          fields || [],
          offset || 0,
          limit || 80,
          order || ''
        ]
      };
    } else if (method === 'fields_get') {
      // Add method to get available fields
      requestData.params = {
        service: 'object',
        method: 'execute',
        args: [
          ODOO_DATABASE,
          2,
          authCredential,
          model,
          'fields_get',
          [],
          ['string', 'type']
        ]
      };
    } else if (method === 'create') {
      requestData.params = {
        service: 'object',
        method: 'execute',
        args: [
          ODOO_DATABASE,
          2,
          authCredential,
          model,
          'create',
          args?.[0] || {}
        ]
      };
    } else {
      // Default call
      requestData.params = {
        service: 'object',
        method: 'execute',
        args: [
          ODOO_DATABASE,
          2,
          authCredential,
          model,
          method,
          ...(args || [])
        ]
      };
    }

    console.log('Full URL:', `${ODOO_BASE_URL}${endpoint}`);
    console.log('Request data:', JSON.stringify(requestData, null, 2));

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

    console.log('Response status:', response.status);
    console.log('Response data:', response.data);

    if (response.data.error) {
      console.error('Odoo error:', response.data.error);
      return NextResponse.json(
        { error: response.data.error.message || 'Odoo operation failed' },
        { status: 400 }
      );
    }

    const result = response.data.result;

    if (method === 'search_read') {
      if (Array.isArray(result)) {
        return NextResponse.json({
          records: result,
          length: result.length,
        });
      }
    }

    return NextResponse.json(result);

  } catch (error: any) {
    console.error('=== ODOO API ERROR ===');
    console.error('Error message:', error.message);
    console.error('Error response:', error.response?.data);
    console.error('Error status:', error.response?.status);

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
