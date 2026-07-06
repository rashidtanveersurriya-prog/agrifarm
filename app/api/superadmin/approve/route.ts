import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

function extractUserIdFromToken(token: string): string | null {
  try {
    const decoded = Buffer.from(token, 'base64').toString();
    const parts = decoded.split(':');
    return parts[0];
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const superadminId = extractUserIdFromToken(token);
    if (!superadminId) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const { shop_id, approval_notes } = await request.json();

    if (!shop_id) {
      return NextResponse.json(
        { error: 'Shop ID required' },
        { status: 400 }
      );
    }

    // Update shop approval status
    const { error: updateError } = await supabase
      .from('users')
      .update({
        is_approved: true,
        approval_notes,
        approved_at: new Date().toISOString(),
        approved_by: superadminId,
      })
      .eq('id', shop_id);

    if (updateError) throw updateError;

    // Log approval
    await supabase
      .from('approval_logs')
      .insert({
        user_id: shop_id,
        superadmin_id: superadminId,
        action: 'approved',
        notes: approval_notes,
      });

    return NextResponse.json({
      success: true,
      message: 'Shop approved successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
