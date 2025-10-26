import HeroSection from '@/components/HeroSection';
import IndicatorsGrid from '@/components/IndicatorsGrid';
import ChartsGrid from '@/components/ChartsGrid';
import SectorsGrid from '@/components/SectorsGrid';
import SectorEvolutionInteractive from '@/components/SectorEvolutionInteractive';
import { Statistics, ChartDataPoint, SectorData } from '@/types';

// Función para obtener datos del servidor
async function getDashboardData() {
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? process.env.NEXT_PUBLIC_VERCEL_URL 
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` 
      : 'https://landing-pbg-modificado.vercel.app'
    : 'http://localhost:3000';
  
  try {
    // Obtener estadísticas
    const statsRes = await fetch(`${baseUrl}/api/statistics`, { 
      cache: 'no-store' 
    });
    if (!statsRes.ok) throw new Error('Error fetching statistics');
    const statsData = await statsRes.json();

    // Obtener datos de gráficos
    const chartsRes = await fetch(`${baseUrl}/api/charts`, { 
      cache: 'no-store' 
    });
    if (!chartsRes.ok) throw new Error('Error fetching charts');
    const chartsData = await chartsRes.json();

    // Obtener sectores
    const sectorsRes = await fetch(`${baseUrl}/api/sectors`, { 
      cache: 'no-store' 
    });
    if (!sectorsRes.ok) throw new Error('Error fetching sectors');
    const sectorsData = await sectorsRes.json();

    return {
      statistics: statsData.data as Statistics,
      evolution: chartsData.data.evolution_pbg_by_year as ChartDataPoint[],
      sectors: sectorsData.data as SectorData[],
      sectorsForCharts: chartsData.data.sectors as SectorData[], // Sectores con porcentajes correctos
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    
    // Datos de fallback para desarrollo
    return {
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
      } as Statistics,
      evolution: [] as ChartDataPoint[],
      sectors: [] as SectorData[],
      sectorsForCharts: [] as SectorData[],
    };
  }
}

export default async function HomePage() {
  const { statistics, evolution, sectors, sectorsForCharts } = await getDashboardData();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <HeroSection statistics={statistics} />
      
      {/* Indicadores Principales */}
      <IndicatorsGrid statistics={statistics} />
      
      {/* Gráficos */}
      <ChartsGrid 
        evolutionData={evolution}
        sectorsData={sectorsForCharts || []}
      />
      
      {/* Sectores */}
      <SectorsGrid sectors={sectors} />
      
      {/* Evolución Sectorial Interactiva */}
      <SectorEvolutionInteractive />
    </div>
  );
}
