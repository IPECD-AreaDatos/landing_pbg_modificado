import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/database';

interface SectorEvolutionResult {
  año: number;
  valor: number;
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
    
    console.log(`Obteniendo evolución para sector: ${code}`);

    // Obtener evolución completa del sector (solo letra, sin números)
    const evolutionData = await executeQuery<SectorEvolutionResult>(`
      SELECT 
        año,
        valor,
        variacion_interanual
      FROM pbg_anual_desglosado 
      WHERE letra = ?
        AND LENGTH(letra) = 1
      ORDER BY año ASC
    `, [code]);

    // Obtener información básica del sector
    const sectorInfo = await executeQuery<{descripcion: string}>(`
      SELECT DISTINCT descripcion
      FROM pbg_anual_desglosado 
      WHERE letra = ?
      LIMIT 1
    `, [code]);

    console.log(`Encontrados ${evolutionData.length} años para sector ${code}`);

    // Procesar datos para los gráficos
    const processedEvolution = evolutionData.map(item => ({
      year: item.año,
      value: item.valor,
      yoy: item.variacion_interanual ? parseFloat(item.variacion_interanual) : null
    }));

    // Calcular estadísticas adicionales
    const values = processedEvolution.map(d => d.value);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const firstYear = processedEvolution[0]?.year;
    const lastYear = processedEvolution[processedEvolution.length - 1]?.year;
    const firstValue = processedEvolution[0]?.value || 0;
    const lastValue = processedEvolution[processedEvolution.length - 1]?.value || 0;
    
    // Crecimiento total
    const totalGrowth = firstValue > 0 ? ((lastValue - firstValue) / firstValue) * 100 : 0;
    
    // CAGR (Compound Annual Growth Rate)
    const years = lastYear - firstYear;
    const cagr = years > 0 && firstValue > 0 
      ? (Math.pow(lastValue / firstValue, 1/years) - 1) * 100 
      : 0;

    return NextResponse.json({
      success: true,
      data: {
        sector_code: code,
        sector_name: sectorInfo[0]?.descripcion || `Sector ${code}`,
        evolution: processedEvolution,
        statistics: {
          years_span: years,
          min_year: firstYear,
          max_year: lastYear,
          min_value: minValue,
          max_value: maxValue,
          first_value: firstValue,
          last_value: lastValue,
          total_growth_percentage: Number(totalGrowth.toFixed(2)),
          cagr: Number(cagr.toFixed(2)),
          total_records: evolutionData.length
        }
      }
    });

  } catch (error) {
    console.error('Error fetching sector evolution:', error);
    return NextResponse.json({
      success: false,
      message: 'Error fetching sector evolution'
    }, { status: 500 });
  }
}