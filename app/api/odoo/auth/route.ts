import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const ODOO_BASE_URL = process.env.ODOO_BASE_URL || 'http://localhost:8069';
const ODOO_DATABASE = process.env.ODOO_DATABASE || 'odoo';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

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
        withCredentials: true,
      }
    );

    if (response.data.error) {
      return NextResponse.json(
        { error: response.data.error.message || 'Authentication failed' },
        { status: 401 }
      );
    }

    const result = response.data.result;
    
    if (!result.uid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Return user info (without sensitive data)
    return NextResponse.json({
      uid: result.uid,
      username: result.username,
      session_id: result.session_id,
      db: result.db,
      user_context: result.user_context,
    });
  } catch (error: any) {
    console.error('Odoo authentication error:', error);
    
    if (error.response?.status === 401) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Authentication service unavailable' },
      { status: 503 }
    );
  }
}