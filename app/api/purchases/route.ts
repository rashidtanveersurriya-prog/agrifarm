import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    let query = supabase
      .from('purchases')
      .select('*, traders(name, email, phone), purchase_items(*, products(*))', {
        count: 'exact',
      });

    if (userId) query = query.eq('user_id', userId);

    const offset = (page - 1) * limit;
    const { data, error, count } = await query
      .order('created_at', { ascending: false })
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
    const { purchase_items, ...purchaseData } = body;

    // Insert purchase
    const { data: purchase, error: purchaseError } = await supabase
      .from('purchases')
      .insert([purchaseData])
      .select()
      .single();

    if (purchaseError) throw purchaseError;

    // Insert purchase items
    if (purchase_items && purchase_items.length > 0) {
      const itemsWithPurchaseId = purchase_items.map((item: any) => ({
        ...item,
        purchase_id: purchase.id,
      }));

      const { error: itemsError } = await supabase
        .from('purchase_items')
        .insert(itemsWithPurchaseId);

      if (itemsError) throw itemsError;
    }

    // Update inventory
    if (purchase_items) {
      for (const item of purchase_items) {
        const { data: inventory, error: invError } = await supabase
          .from('inventory')
          .select()
          .eq('product_id', item.product_id)
          .single();

        if (invError && invError.code === 'PGRST116') {
          // No inventory record exists, create one
          await supabase.from('inventory').insert([
            {
              user_id: purchase.user_id,
              product_id: item.product_id,
              quantity: item.quantity,
              value: item.line_total,
            },
          ]);
        } else if (!invError && inventory) {
          await supabase
            .from('inventory')
            .update({
              quantity: inventory.quantity + item.quantity,
              value: inventory.value + item.line_total,
            })
            .eq('id', inventory.id);
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: purchase,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
