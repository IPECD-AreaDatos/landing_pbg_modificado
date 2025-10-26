import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/database';
import { SectorData } from '@/types';

export async function GET() {
  try {
    // Obtener datos de sectores para el año más reciente
    const latestYear = await executeQuery<{max_year: number}>(`
      SELECT MAX(año) as max_year FROM pbg_anual_desglosado
    `);
    
    const year = latestYear[0]?.max_year || 2023;

    // Obtener datos de sectores con valores y variaciones
    const sectorsData = await executeQuery<{
      letra: string;
      descripcion: string;
      valor: number;
      variacion_interanual: number | null;
    }>(`
      SELECT 
        letra,
        descripcion,
        valor,
        variacion_interanual
      FROM pbg_anual_desglosado 
      WHERE año = ? AND (LENGTH(letra) = 1 OR letra = 'T')
      ORDER BY 
        CASE 
          WHEN letra = 'T' THEN 0 
          ELSE 1 
        END,
        valor DESC
    `, [year]);

    // Obtener el PBG total del mismo año para calcular porcentajes correctos
    const pbgData = await executeQuery<{valor: number}>(`
      SELECT valor FROM pbg_anual_desglosado 
      WHERE año = ? AND letra = 'PBG'
    `, [year]);
    
    const pbgTotal = pbgData[0]?.valor || 1;

    console.log(`=== DEBUG SECTORS API ===`);
    console.log(`Año: ${year}`);
    console.log(`PBG Total para sectores: ${pbgTotal}`);

    const formattedSectors: SectorData[] = sectorsData.map(sector => {
      const percentage = sector.letra === 'T' || sector.letra === 'PBG' 
        ? 100 
        : pbgTotal > 0 
          ? Number(((sector.valor / pbgTotal) * 100).toFixed(2))
          : 0;

      // Debug para el primer sector
      if (sector.letra === 'G') {
        console.log(`Sector G: ${sector.valor} / ${pbgTotal} * 100 = ${percentage}%`);
      }

      return {
        code: sector.letra,
        sector: sector.descripcion,
        value: percentage,
        value_absolute: Number(sector.valor),
        yoy: sector.variacion_interanual ? Number(sector.variacion_interanual) : undefined,
        year: year
      };
    });

    console.log(`=== SECTORES PRINCIPALES PROCESADOS ===`);
    formattedSectors.filter(s => s.code !== 'T' && s.code !== 'PBG').slice(0, 3).forEach(s => 
      console.log(`${s.code}: ${s.value}% - $${(s.value_absolute/1000000).toFixed(1)}M`)
    );
    console.log(`=== FIN DEBUG SECTORS ===`);

    return NextResponse.json({
      success: true,
      data: formattedSectors
    });

  } catch (error) {
    console.error('Error fetching sectors:', error);
    return NextResponse.json({
      success: false,
      message: 'Error fetching sectors'
    }, { status: 500 });
  }
}