import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    let query = supabase.from('roznamcha').select('*, roznamcha_details(*, accounts(*))', { count: 'exact' });
    if (userId) query = query.eq('user_id', userId);

    const offset = (page - 1) * limit;
    const { data, error, count } = await query
      .order('entry_date', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return NextResponse.json({
      success: true,
      data,
      total: count,
      page,
      limit,
      totalPages: count ? Math.ceil(count / limit) : 0,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { roznamcha_details, ...roznamchaData } = body;

    const { data: roznamcha, error: rozError } = await supabase
      .from('roznamcha')
      .insert([roznamchaData])
      .select()
      .single();

    if (rozError) throw rozError;

    if (roznamcha_details && roznamcha_details.length > 0) {
      const detailsWithId = roznamcha_details.map((detail: any) => ({
        ...detail,
        roznamcha_id: roznamcha.id,
      }));

      const { error: detError } = await supabase
        .from('roznamcha_details')
        .insert(detailsWithId);

      if (detError) throw detError;
    }

    return NextResponse.json({ success: true, data: roznamcha });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
