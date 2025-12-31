import { NextResponse } from 'next/server';
import { getAdhkarSabah, getTotalItemsCount } from '@/lib/categorize-adhkar';
import type { AdhkarCategory, ApiResponse } from '@/types/adhkar';

export async function GET(): Promise<NextResponse<ApiResponse<AdhkarCategory[]>>> {
  try {
    const adhkarSabah = getAdhkarSabah();
    const totalItems = getTotalItemsCount(adhkarSabah);
    
    return NextResponse.json({
      success: true,
      data: adhkarSabah,
      count: adhkarSabah.length,
      totalItems
    });
  } catch (error) {
    console.error('Error fetching Adhkar Al-Sabah:', error);
    return NextResponse.json({
      success: false,
      data: [],
      count: 0,
      totalItems: 0
    }, { status: 500 });
  }
}
