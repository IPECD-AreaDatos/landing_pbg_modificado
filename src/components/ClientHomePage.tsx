'use client';

import { useEffect, useState } from 'react';
import HeroSection from '@/components/HeroSection';
import IndicatorsGrid from '@/components/IndicatorsGrid';
import ChartsGrid from '@/components/ChartsGrid';
import SectorsGrid from '@/components/SectorsGrid';
import SectorEvolutionInteractive from '@/components/SectorEvolutionInteractive';
import { Statistics, ChartDataPoint, SectorData } from '@/types';

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
          fetch('/api/statistics'),
          fetch('/api/charts'),
          fetch('/api/sectors')
        ]);

        if (!statsRes.ok) throw new Error('Error fetching statistics');
        if (!chartsRes.ok) throw new Error('Error fetching charts');
        if (!sectorsRes.ok) throw new Error('Error fetching sectors');

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
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Advertencia: Algunos datos podrían no estar disponibles. {error}
              </p>
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