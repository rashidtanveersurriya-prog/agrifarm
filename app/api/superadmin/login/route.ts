import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password required' },
        { status: 400 }
      );
    }

    // Query superadmin users table
    const { data: superadmins, error: queryError } = await supabase
      .from('superadmin_users')
      .select('*')
      .eq('email', email)
      .single();

    if (queryError || !superadmins) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Simple password check (in production, use bcrypt)
    if (superadmins.password_hash !== password) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    if (!superadmins.is_active) {
      return NextResponse.json(
        { error: 'Account disabled' },
        { status: 403 }
      );
    }

    // Update last login
    await supabase
      .from('superadmin_users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', superadmins.id);

    // Return token (in production, use JWT)
    const token = Buffer.from(`${superadmins.id}:${superadmins.email}:${Date.now()}`).toString('base64');

    return NextResponse.json({
      success: true,
      token,
      superadmin_id: superadmins.id,
      email: superadmins.email,
      full_name: superadmins.full_name,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
