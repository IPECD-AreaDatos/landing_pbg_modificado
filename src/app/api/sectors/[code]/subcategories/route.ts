import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/database';

interface SubcategoryQueryResult {
  letra: string;
  descripcion: string;
  valor: number;
  año: number;
  variacion_interanual: string | null;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    
    // Validar que code no sea undefined o vacío
    if (!code || typeof code !== 'string') {
      return NextResponse.json({
        success: false,
        message: 'Código de sector inválido'
      }, { status: 400 });
    }
    
    console.log(`Buscando subcategorías para sector: ${code}`);
    
    // Obtener el año más reciente
    const latestYearResult = await executeQuery<{año: number}>(`
      SELECT MAX(año) as año FROM pbg_anual_desglosado 
    `);
    const latestYear = latestYearResult[0]?.año || 2024;

    // Obtener subcategorías del sector principal para el año más reciente
    // Por ejemplo, si code = 'A', obtener A1, A2, A3, etc.
    console.log(`Buscando subcategorías para año: ${latestYear}`);
    
    const subcategoriesData = await executeQuery<SubcategoryQueryResult>(`
      SELECT 
        letra,
        descripcion,
        valor,
        año,
        variacion_interanual
      FROM pbg_anual_desglosado 
      WHERE letra LIKE ? 
        AND LENGTH(letra) > 1 
        AND año = ?
      ORDER BY valor DESC
    `, [`${code}%`, latestYear]);

    // Obtener año anterior para calcular YoY si no viene en la base
    const prevYear = latestYear - 1;
    console.log(`Buscando datos año anterior: ${prevYear}`);
    
    const prevYearData = await executeQuery<SubcategoryQueryResult>(`
      SELECT letra, valor
      FROM pbg_anual_desglosado 
      WHERE letra LIKE ? 
        AND LENGTH(letra) > 1 
        AND año = ?
    `, [`${code}%`, prevYear]);

    const prevYearMap = new Map(prevYearData.map(item => [item.letra, item.valor]));

    // Procesar subcategorías con cálculo YoY
    const processedSubcategories = subcategoriesData.map(sub => {
      const prevValue = prevYearMap.get(sub.letra);
      let yoy = undefined;
      
      // Usar variacion_interanual si existe, sino calcular
      if (sub.variacion_interanual && sub.variacion_interanual !== null) {
        yoy = parseFloat(sub.variacion_interanual);
      } else if (prevValue && prevValue > 0) {
        yoy = ((sub.valor - prevValue) / prevValue) * 100;
      }

      return {
        code: sub.letra,
        subcategory: sub.descripcion,
        value_absolute: sub.valor,
        year: sub.año,
        yoy: yoy ? Number(yoy.toFixed(2)) : undefined,
        // Calcular participación dentro del sector principal
        participation_in_sector: 0 // Lo calcularemos después
      };
    });

    // Calcular participación de cada subcategoría dentro del sector
    const totalSectorValue = processedSubcategories.reduce((sum, sub) => sum + sub.value_absolute, 0);
    
    const finalSubcategories = processedSubcategories.map(sub => ({
      ...sub,
      participation_in_sector: totalSectorValue > 0 
        ? Number(((sub.value_absolute / totalSectorValue) * 100).toFixed(2))
        : 0
    }));

    console.log(`Subcategorías para sector ${code}:`, finalSubcategories.length);

    return NextResponse.json({
      success: true,
      data: {
        sector_code: code,
        year: latestYear,
        subcategories: finalSubcategories,
        total_subcategories: finalSubcategories.length
      }
    });

  } catch (error) {
    console.error('Error fetching subcategories:', error);
    return NextResponse.json({
      success: false,
      message: 'Error fetching subcategories'
    }, { status: 500 });
  }
}