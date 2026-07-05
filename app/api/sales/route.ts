import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    let query = supabase
      .from('sales')
      .select('*, customers(name, email, phone), sales_items(*, products(*))', {
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
    const { sales_items, ...saleData } = body;

    // Insert sale
    const { data: sale, error: saleError } = await supabase
      .from('sales')
      .insert([saleData])
      .select()
      .single();

    if (saleError) throw saleError;

    // Insert sales items
    if (sales_items && sales_items.length > 0) {
      const itemsWithSaleId = sales_items.map((item: any) => ({
        ...item,
        sale_id: sale.id,
      }));

      const { error: itemsError } = await supabase
        .from('sales_items')
        .insert(itemsWithSaleId);

      if (itemsError) throw itemsError;
    }

    // Update inventory
    if (sales_items) {
      for (const item of sales_items) {
        const { data: inventory, error: invError } = await supabase
          .from('inventory')
          .select()
          .eq('product_id', item.product_id)
          .single();

        if (!invError && inventory) {
          await supabase
            .from('inventory')
            .update({ quantity: inventory.quantity - item.quantity })
            .eq('id', inventory.id);
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: sale,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
