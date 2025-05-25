import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('API Route: Logout request received');
    
    // For now, just return success since the client handles clearing localStorage
    // In a full implementation, you might want to invalidate the Odoo session
    
    return NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error: any) {
    console.error('API Route: Logout error:', error.message);
    
    return NextResponse.json({
      success: false,
      error: 'Logout failed'
    }, { status: 500 });
  }
}
