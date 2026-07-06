import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

function verifyToken(token: string): boolean {
  try {
    // Basic token verification
    return !!(token && token.length > 0);
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token || !verifyToken(token)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get all shops (users who have shop_name)
    const { data: shops, error } = await supabase
      .from('users')
      .select('id, email, full_name, shop_name, phone, city, country, is_approved, created_at')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: shops || [],
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
