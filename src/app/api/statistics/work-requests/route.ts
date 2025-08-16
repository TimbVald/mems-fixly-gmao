import { NextRequest, NextResponse } from 'next/server';
import { getWorkRequestStatistics } from '@/server/work-requests';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const year = searchParams.get('year');
    
    const yearNumber = year ? parseInt(year, 10) : new Date().getFullYear();
    
    if (isNaN(yearNumber)) {
      return NextResponse.json(
        { success: false, message: 'Année invalide' },
        { status: 400 }
      );
    }

    const result = await getWorkRequestStatistics(yearNumber);
    
    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Erreur API statistiques:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur serveur interne' },
      { status: 500 }
    );
  }
}