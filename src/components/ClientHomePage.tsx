'use client';

import { useEffect, useState } from 'react';
import HeroSection from '@/components/HeroSection';
import IndicatorsGrid from '@/components/IndicatorsGrid';
import ChartsGrid from '@/components/ChartsGrid';
import SectorsGrid from '@/components/SectorsGrid';
import SectorEvolutionInteractive from '@/components/SectorEvolutionInteractive';
import { Statistics, ChartDataPoint, SectorData } from '@/types';
import { getApiUrl } from '@/lib/api-utils';

interface DashboardData {
  statistics: Statistics;
  evolution: ChartDataPoint[];
  sectors: SectorData[];
  sectorsForCharts: SectorData[];
}

// Datos por defecto
const defaultData: DashboardData = {
  statistics: {
    total_value_billions: 0,
    years_span: 0,
    min_year: 2004,
    max_year: 2023,
    growth_percentage: 0,
    total_records: 0,
    sectors_count: 17,
    latest_pbg_value: 0,
    latest_pbg_year: 2023,
    variation_yoy: 0,
    cagr: 0,
  },
  evolution: [],
  sectors: [],
  sectorsForCharts: [],
};

export default function ClientHomePage() {
  const [data, setData] = useState<DashboardData>(defaultData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        // Hacer las llamadas API del lado del cliente
        const [statsRes, chartsRes, sectorsRes] = await Promise.all([
          fetch(getApiUrl('statistics')),
          fetch(getApiUrl('charts')),
          fetch(getApiUrl('sectors'))
        ]);

        if (!statsRes.ok) {
          const errorText = await statsRes.text();
          throw new Error(`Error fetching statistics (${statsRes.status}): ${errorText}`);
        }
        if (!chartsRes.ok) {
          const errorText = await chartsRes.text();
          throw new Error(`Error fetching charts (${chartsRes.status}): ${errorText}`);
        }
        if (!sectorsRes.ok) {
          const errorText = await sectorsRes.text();
          throw new Error(`Error fetching sectors (${sectorsRes.status}): ${errorText}`);
        }

        const [statsData, chartsData, sectorsData] = await Promise.all([
          statsRes.json(),
          chartsRes.json(),
          sectorsRes.json()
        ]);

        setData({
          statistics: statsData.data,
          evolution: chartsData.data.evolution_pbg_by_year,
          sectors: sectorsData.data,
          sectorsForCharts: chartsData.data.sectors,
        });

      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
        // Mantener datos por defecto en caso de error
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4 mx-4">
          <div className="flex">
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium text-red-800">
                Error de conexión con la base de datos
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>No se pudieron cargar los datos. Detalles técnicos:</p>
                <p className="mt-1 font-mono text-xs bg-red-100 p-2 rounded">
                  {error}
                </p>
                <p className="mt-2">
                  Por favor, verifica que las variables de entorno estén configuradas correctamente en Vercel.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Hero Section */}
      <HeroSection statistics={data.statistics} />
      
      {/* Indicadores Principales */}
      <IndicatorsGrid statistics={data.statistics} />
      
      {/* Gráficos */}
      <ChartsGrid 
        evolutionData={data.evolution}
        sectorsData={data.sectorsForCharts}
      />
      
      {/* Sectores */}
      <SectorsGrid sectors={data.sectors} />
      
      {/* Evolución Sectorial Interactiva */}
      <SectorEvolutionInteractive />
    </div>
  );
}