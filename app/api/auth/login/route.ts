import { NextRequest, NextResponse } from 'next/server';

// Create a server-side instance of the API for authentication
class ServerOdooAPI {
  private baseURL: string;
  private database: string;
  private apiKey: string;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_ODOO_BASE_URL || 'http://localhost:8069';
    this.database = process.env.NEXT_PUBLIC_ODOO_DATABASE || 'test';
    this.apiKey = process.env.ODOO_API_KEY || '';
  }

  private async rpcCall(service: string, method: string, args: any[] = []): Promise<any> {
    const requestData = {
      jsonrpc: '2.0',
      method: 'call',
      params: {
        service,
        method,
        args
      },
      id: Math.floor(Math.random() * 1000000)
    };

    const response = await fetch(`${this.baseURL}/jsonrpc`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(`Odoo Error: ${data.error.message}`);
    }

    return data.result;
  }

  async authenticate(username: string, password: string): Promise<number> {
    // Use API key if available, otherwise use provided password
    const authCredential = this.apiKey || password;
    const authMethod = this.apiKey ? 'API Key' : 'Password';

    console.log(`Server auth using: ${authMethod}`);

    const result = await this.rpcCall('common', 'authenticate', [
      this.database,
      username,
      authCredential,
      {}
    ]);

    if (!result) {
      throw new Error('Authentication failed - invalid credentials');
    }

    return result;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    console.log('API Route: Login attempt for username:', username);

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    const odooAPI = new ServerOdooAPI();
    const uid = await odooAPI.authenticate(username, password);

    console.log('API Route: Login successful for UID:', uid);

    // Return user info
    return NextResponse.json({
      uid,
      username,
      session_id: `session_${uid}_${Date.now()}`,
      db: process.env.NEXT_PUBLIC_ODOO_DATABASE || 'test',
      user_context: {},
      name: username,
      partner_id: uid,
    });
  } catch (error: any) {
    console.error('API Route: Authentication error:', error.message);

    if (error.message.includes('ECONNREFUSED')) {
      return NextResponse.json(
        { error: 'Cannot connect to Odoo server. Make sure Odoo is running and accessible.' },
        { status: 503 }
      );
    }

    if (error.message.includes('invalid credentials')) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: `Authentication failed: ${error.message}` },
      { status: 503 }
    );
  }
}
