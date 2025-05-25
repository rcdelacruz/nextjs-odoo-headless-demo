import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const ODOO_BASE_URL = process.env.NEXT_PUBLIC_ODOO_BASE_URL || 'http://localhost:8069';
const ODOO_DATABASE = process.env.NEXT_PUBLIC_ODOO_DATABASE || 'test';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    console.log('API Route: Login attempt for username:', username);
    console.log('API Route: Odoo URL:', ODOO_BASE_URL);
    console.log('API Route: Database:', ODOO_DATABASE);

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Authenticate with Odoo
    const response = await axios.post(
      `${ODOO_BASE_URL}/web/session/authenticate`,
      {
        jsonrpc: '2.0',
        method: 'call',
        params: {
          db: ODOO_DATABASE,
          login: username,
          password: password,
        },
      },
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
      console.error('API Route: Odoo error:', response.data.error);
      return NextResponse.json(
        { error: response.data.error.message || 'Authentication failed' },
        { status: 401 }
      );
    }

    const result = response.data.result;
    
    if (!result || !result.uid) {
      console.error('API Route: No UID in response');
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    console.log('API Route: Login successful for UID:', result.uid);

    // Return user info (without sensitive data)
    return NextResponse.json({
      uid: result.uid,
      username: result.username,
      session_id: result.session_id,
      db: result.db,
      user_context: result.user_context,
      name: result.name,
      partner_id: result.partner_id,
    });
  } catch (error: any) {
    console.error('API Route: Authentication error:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      return NextResponse.json(
        { error: 'Cannot connect to Odoo server. Make sure Odoo is running and accessible.' },
        { status: 503 }
      );
    }

    if (error.response?.status === 401) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    if (error.response?.status === 404) {
      return NextResponse.json(
        { error: 'Odoo authentication endpoint not found. Check your Odoo URL.' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: `Authentication failed: ${error.message}` },
      { status: 503 }
    );
  }
}
