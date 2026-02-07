import { NextResponse } from 'next/server';
import { getAdhkarMasa, getTotalItemsCount } from '@/lib/categorize-adhkar';
import type { AdhkarCategory, ApiResponse } from '@/types/adhkar';

export async function GET(): Promise<NextResponse<ApiResponse<AdhkarCategory[]>>> {
  try {
    const adhkarMasa = getAdhkarMasa();
    const totalItems = getTotalItemsCount(adhkarMasa);
    
    return NextResponse.json({
      success: true,
      data: adhkarMasa,
      count: adhkarMasa.length,
      totalItems
    });
  } catch (error) {
    console.error('Error fetching Adhkar Al-Masa:', error);
    return NextResponse.json({
      success: false,
      data: [],
      count: 0,
      totalItems: 0
    }, { status: 500 });
  }
}
