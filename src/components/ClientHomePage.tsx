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
        console.log('Current URL:', window.location.href);
        console.log('User Agent:', navigator.userAgent);
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[50vh] bg-[#f1f5f9] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4" aria-hidden="true"></div>
          <p className="text-slate-600">Cargando datos del PBG...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-[#f1f5f9] px-5 py-16">
        <div role="alert" className="max-w-xl rounded-3xl border border-rose-200 bg-white p-8 text-center shadow-[0_18px_42px_rgba(27,40,57,0.08)]">
          <h1 className="text-2xl font-bold text-[#1b2839]">No se pudieron cargar los datos</h1>
          <p className="mt-3 text-slate-600">El tablero no puede mostrar información actual en este momento. Intentá de nuevo en unos minutos.</p>
          <button type="button" onClick={() => window.location.reload()} className="mt-6 rounded-xl bg-[#047857] px-5 py-3 font-semibold text-white transition-colors hover:bg-[#065f46] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700">
            Volver a intentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f1f5f9]">
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
