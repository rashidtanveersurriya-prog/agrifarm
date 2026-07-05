import { supabase } from './supabase';
import { ApiResponse, PaginatedResponse } from '@/types';

// Generic database operations
export class Database {
  static async create<T>(table: string, data: any): Promise<ApiResponse<T>> {
    try {
      const { data: result, error } = await supabase
        .from(table)
        .insert([data])
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: result as T };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  static async read<T>(table: string, id: string): Promise<ApiResponse<T>> {
    try {
      const { data: result, error } = await supabase
        .from(table)
        .select()
        .eq('id', id)
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: result as T };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  static async list<T>(
    table: string,
    filter?: Record<string, any>,
    page = 1,
    limit = 20,
    orderBy = 'created_at',
    ascending = false
  ): Promise<ApiResponse<PaginatedResponse<T>>> {
    try {
      let query = supabase.from(table).select('*', { count: 'exact' });

      if (filter) {
        Object.entries(filter).forEach(([key, value]) => {
          query = query.eq(key, value);
        });
      }

      const offset = (page - 1) * limit;
      const { data, error, count } = await query
        .order(orderBy, { ascending })
        .range(offset, offset + limit - 1);

      if (error) {
        return { success: false, error: error.message };
      }

      const totalPages = count ? Math.ceil(count / limit) : 0;

      return {
        success: true,
        data: {
          data: data as T[],
          total: count || 0,
          page,
          limit,
          total_pages: totalPages,
        },
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  static async update<T>(table: string, id: string, data: any): Promise<ApiResponse<T>> {
    try {
      const { data: result, error } = await supabase
        .from(table)
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: result as T };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  static async delete(table: string, id: string): Promise<ApiResponse<null>> {
    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: null };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  static async query<T>(table: string, query: any): Promise<ApiResponse<T[]>> {
    try {
      let dbQuery = supabase.from(table).select();

      // Apply filters
      if (query.filters) {
        Object.entries(query.filters).forEach(([key, value]) => {
          dbQuery = dbQuery.eq(key, value);
        });
      }

      // Apply ordering
      if (query.orderBy) {
        dbQuery = dbQuery.order(query.orderBy, {
          ascending: query.ascending !== false,
        });
      }

      const { data, error } = await dbQuery;

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: data as T[] };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}

// Batch operations
export async function batchCreate<T>(table: string, items: any[]): Promise<ApiResponse<T[]>> {
  try {
    const { data, error } = await supabase
      .from(table)
      .insert(items)
      .select();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: data as T[] };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function batchDelete(table: string, ids: string[]): Promise<ApiResponse<null>> {
  try {
    const { error } = await supabase
      .from(table)
      .delete()
      .in('id', ids);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: null };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
