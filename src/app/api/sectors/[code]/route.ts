import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/database';

interface SectorTimeSeriesData {
  year: number;
  value: number;
  yoy_variation?: number;
}

interface SubsectorData {
  sector: string;
  description: string;
  data: SectorTimeSeriesData[];
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;

    if (!code) {
      return NextResponse.json({
        success: false,
        message: 'Sector code is required'
      }, { status: 400 });
    }

    // Si es PBG, devolver solo los datos del PBG
    if (code === 'PBG') {
      const pbgData = await executeQuery<{año: number, valor: number, variacion_interanual?: number}>(`
        SELECT año, valor, variacion_interanual
        FROM pbg_anual_desglosado 
        WHERE letra = 'PBG' 
        ORDER BY año ASC
      `);

      const timeSeries: SectorTimeSeriesData[] = pbgData.map(row => ({
        year: row.año,
        value: row.valor,
        yoy_variation: row.variacion_interanual || undefined
      }));

      return NextResponse.json({
        success: true,
        data: {
          data: timeSeries
        }
      });
    }

    // Para sectores principales (A-P), obtener subsectores
    const subsectorsData = await executeQuery<{letra: string, descripcion: string, año: number, valor: number, variacion_interanual?: number}>(`
      SELECT letra, descripcion, año, valor, variacion_interanual
      FROM pbg_anual_desglosado 
      WHERE letra LIKE ? OR letra = ?
      ORDER BY letra ASC, año ASC
    `, [`${code}%`, code]);

    if (subsectorsData.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Sector not found'
      }, { status: 404 });
    }

    // Agrupar por sector/subsector
    const sectorsMap = new Map<string, SubsectorData>();

    subsectorsData.forEach(row => {
      if (!sectorsMap.has(row.letra)) {
        sectorsMap.set(row.letra, {
          sector: row.letra,
          description: row.descripcion,
          data: []
        });
      }

      sectorsMap.get(row.letra)!.data.push({
        year: row.año,
        value: row.valor,
        yoy_variation: row.variacion_interanual || undefined
      });
    });

    const subsectors = Array.from(sectorsMap.values());

    return NextResponse.json({
      success: true,
      data: {
        subsectors
      }
    });

  } catch (error) {
    console.error('Error fetching sector data:', error);
    return NextResponse.json({
      success: false,
      message: 'Error fetching sector data'
    }, { status: 500 });
  }
}