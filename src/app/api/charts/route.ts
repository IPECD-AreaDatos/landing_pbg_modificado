import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/database';
import { ChartDataPoint, SectorData } from '@/types';

interface EvolutionQueryResult {
  year: number;
  value: number;
}

interface SectorQueryResult {
  letra: string;
  sector: string;
  value_absolute: number;
  year: number;
}

export async function GET() {
  try {
    // Obtener datos de PBG por año para el gráfico de evolución
    const evolutionData = await executeQuery<EvolutionQueryResult>(`
      SELECT año as year, valor as value 
      FROM pbg_anual_desglosado 
      WHERE letra = 'PBG' 
      ORDER BY año ASC
    `);

    console.log('Evolution data length:', evolutionData.length);
    console.log('First 3 evolution records:', evolutionData.slice(0, 3));
    console.log('Last 3 evolution records:', evolutionData.slice(-3));

    // Obtener datos por sectores para el último año
    const latestYear = Math.max(...evolutionData.map(d => d.year));
    
    // Usar el PBG total del año para calcular porcentajes correctos
    const pbgTotal = evolutionData.find(d => d.year === latestYear)?.value || 1;

    // Obtener sectores principales (solo letras sin números, excluyendo PBG y T)
    const sectorsData = await executeQuery<SectorQueryResult>(`
      SELECT letra, descripcion as sector, valor as value_absolute, año as year
      FROM pbg_anual_desglosado 
      WHERE LENGTH(letra) = 1 
        AND letra NOT IN ('PBG', 'T', 'P') 
        AND año = ?
      ORDER BY valor DESC
    `, [latestYear]);

    console.log('=== DEBUG CHARTS API ===');
    console.log('Año:', latestYear);
    console.log('Evolution Data:', evolutionData);
    console.log('PBG record for latest year:', evolutionData.find(d => d.year === latestYear));
    console.log('PBG Total usado:', pbgTotal);
    console.log('Sectores encontrados:', sectorsData.length);
    if (sectorsData[0]) {
      console.log('Primer sector - Letra:', sectorsData[0].letra, 'Valor:', sectorsData[0].value_absolute);
    }

    // Obtener datos del año anterior para calcular YoY
    const prevYearData = await executeQuery<{letra: string, valor: number}>(`
      SELECT letra, valor 
      FROM pbg_anual_desglosado 
      WHERE LENGTH(letra) = 1 AND letra != 'P' AND año = ?
    `, [latestYear - 1]);

    const prevYearMap = new Map(prevYearData.map(item => [item.letra, item.valor]));

    // Procesar datos de sectores con YoY
    const processedSectors: SectorData[] = sectorsData.map(sector => {
      const prevValue = prevYearMap.get(sector.letra);
      const yoy = prevValue && prevValue > 0 
        ? ((sector.value_absolute - prevValue) / prevValue) * 100 
        : undefined;

      const percentage = pbgTotal > 0 ? (sector.value_absolute / pbgTotal) * 100 : 0;
      
      // Debug para el primer sector
      if (sector.letra === 'G') {
        console.log(`Cálculo para ${sector.letra}: ${sector.value_absolute} / ${pbgTotal} * 100 = ${percentage}%`);
      }

      return {
        code: sector.letra,
        sector: sector.sector,
        value: Number(percentage.toFixed(2)), // Porcentaje redondeado a 2 decimales
        value_absolute: sector.value_absolute,
        yoy: yoy ? Number(yoy.toFixed(2)) : undefined,
        year: sector.year
      };
    });

    console.log('=== SECTORES PROCESADOS ===');
    processedSectors.slice(0, 3).forEach(s => 
      console.log(`${s.code}: ${s.value}% - $${(s.value_absolute/1000000).toFixed(1)}M`)
    );
    console.log('=== FIN DEBUG ===');

    // Formatear datos de evolución
    const formattedEvolution: ChartDataPoint[] = evolutionData.map(item => ({
      year: item.year,
      value: item.value
    }));

    return NextResponse.json({
      success: true,
      data: {
        evolution_pbg_by_year: formattedEvolution,
        sectors: processedSectors.slice(0, 10) // Top 10 sectores
      }
    });

  } catch (error) {
    console.error('Error fetching chart data:', error);
    return NextResponse.json({
      success: false,
      message: 'Error fetching chart data'
    }, { status: 500 });
  }
}