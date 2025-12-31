import { NextResponse } from 'next/server';
import { getAdhkarGeneral, getTotalItemsCount } from '@/lib/categorize-adhkar';
import type { AdhkarCategory, ApiResponse } from '@/types/adhkar';

export async function GET(): Promise<NextResponse<ApiResponse<AdhkarCategory[]>>> {
  try {
    const adhkarGeneral = getAdhkarGeneral();
    const totalItems = getTotalItemsCount(adhkarGeneral);
    
    return NextResponse.json({
      success: true,
      data: adhkarGeneral,
      count: adhkarGeneral.length,
      totalItems
    });
  } catch (error) {
    console.error('Error fetching General Adhkar:', error);
    return NextResponse.json({
      success: false,
      data: [],
      count: 0,
      totalItems: 0
    }, { status: 500 });
  }
}
