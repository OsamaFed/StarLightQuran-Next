import { NextResponse } from 'next/server';
import { getDuas, getTotalItemsCount } from '@/lib/categorize-adhkar';
import type { AdhkarCategory, ApiResponse } from '@/types/adhkar';

export async function GET(): Promise<NextResponse<ApiResponse<AdhkarCategory[]>>> {
  try {
    const duas = getDuas();
    const totalItems = getTotalItemsCount(duas);
    
    return NextResponse.json({
      success: true,
      data: duas,
      count: duas.length,
      totalItems
    });
  } catch (error) {
    console.error('Error fetching Duas:', error);
    return NextResponse.json({
      success: false,
      data: [],
      count: 0,
      totalItems: 0
    }, { status: 500 });
  }
}
