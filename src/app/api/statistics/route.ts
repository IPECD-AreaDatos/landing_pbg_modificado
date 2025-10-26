import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/database';
import { PbgData, Statistics } from '@/types';

export async function GET() {
  try {
    console.log('=== Statistics API called ===');
    console.log('DB Config check:', {
      host: process.env.DB_HOST ? 'Set' : 'Missing',
      user: process.env.DB_USER ? 'Set' : 'Missing',
      database: process.env.DB_NAME ? 'Set' : 'Missing'
    });

    // Obtener todos los datos
    const allData = await executeQuery<PbgData>(`
      SELECT año, letra, descripcion, valor, variacion_interanual 
      FROM pbg_anual_desglosado 
      ORDER BY año ASC, letra ASC
    `);

    console.log('Total datos obtenidos:', allData.length);
    console.log('Primeros 5 registros:', allData.slice(0, 5));
    
    // Ver qué letras únicas tenemos
    const uniqueLetters = [...new Set(allData.map(item => item.letra))].sort();
    console.log('Letras únicas encontradas:', uniqueLetters.slice(0, 20));

    if (!allData || allData.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No data found'
      }, { status: 404 });
    }

    // Calcular estadísticas
    const minYear = Math.min(...allData.map(d => d.año));
    const maxYear = Math.max(...allData.map(d => d.año));
    const yearsSpan = maxYear - minYear + 1;
    const yearsSpanIntervals = Math.max(1, maxYear - minYear);

    // Datos PBG (total) - usando letra 'PBG' para Total
    const pbgData = allData.filter(item => item.letra === 'PBG');
    console.log('Datos PBG encontrados:', pbgData.length);
    console.log('PBG datos:', pbgData.slice(0, 3));
    
    const totalValue = pbgData.reduce((sum, item) => sum + item.valor, 0);
    const totalValueBillions = totalValue / 1_000_000_000;

    // Crecimiento acumulado
    const startValue = pbgData.find(item => item.año === minYear)?.valor || 0;
    const endValue = pbgData.find(item => item.año === maxYear)?.valor || 0;
    const growthPercentage = startValue > 0 ? ((endValue - startValue) / startValue) * 100 : 0;

    // CAGR
    const cagr = startValue > 0 ? (Math.pow((endValue / startValue), 1 / yearsSpanIntervals) - 1) * 100 : 0;

    // Variación interanual del PBG
    const latestPbg = pbgData.find(item => item.año === maxYear);
    const prevPbg = pbgData.find(item => item.año === maxYear - 1);
    const latestValue = latestPbg?.valor || 0;
    const previousValue = prevPbg?.valor || 0;
    const variationYoY = previousValue > 0 ? ((latestValue - previousValue) / previousValue) * 100 : 0;
    
    console.log('Año más reciente:', maxYear);
    console.log('PBG último año:', latestPbg);
    console.log('PBG año anterior:', prevPbg);
    console.log('Valor último:', latestValue);
    console.log('Valor anterior:', previousValue);

    // Contar sectores principales (excluyendo el total 'T')
    const mainSectorsCount = allData
      .filter(item => item.letra.length === 1 && item.letra !== 'T')
      .map(item => item.letra)
      .filter((value, index, self) => self.indexOf(value) === index)
      .length;

    // Calcular el valor final en millones
    const latestPbgInMillions = Number((latestValue / 1_000_000).toFixed(2));
    console.log('Cálculo valor final:', {
      latestValue,
      division: latestValue / 1_000_000,
      rounded: latestPbgInMillions
    });

    const statistics: Statistics = {
      total_value_billions: Number(totalValueBillions.toFixed(2)),
      years_span: yearsSpan,
      min_year: minYear,
      max_year: maxYear,
      growth_percentage: Number(growthPercentage.toFixed(1)),
      total_records: allData.length,
      sectors_count: mainSectorsCount,
      latest_pbg_value: latestPbgInMillions, // en millones
      latest_pbg_year: maxYear,
      variation_yoy: Number(variationYoY.toFixed(2)),
      cagr: Number(cagr.toFixed(2))
    };

    console.log('Estadísticas finales:', statistics);

    return NextResponse.json({
      success: true,
      data: statistics
    });

  } catch (error) {
    console.error('Error fetching statistics:', error);
    return NextResponse.json({
      success: false,
      message: 'Error fetching statistics'
    }, { status: 500 });
  }
}