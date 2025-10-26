'use client';

import { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { SectorEvolutionData, SectorEvolutionStats } from '@/types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Lista de sectores disponibles
const AVAILABLE_SECTORS = [
  { code: 'A', name: 'Agricultura, ganadería y silvicultura' },
  { code: 'B', name: 'Pesca' },
  { code: 'C', name: 'Explotación de minas y canteras' },
  { code: 'D', name: 'Industria manufacturera' },
  { code: 'E', name: 'Electricidad, gas y agua' },
  { code: 'F', name: 'Construcción' },
  { code: 'G', name: 'Comercio mayorista y minorista' },
  { code: 'H', name: 'Hotelería y restaurantes' },
  { code: 'I', name: 'Transporte y comunicaciones' },
  { code: 'J', name: 'Intermediación financiera' },
  { code: 'K', name: 'Actividades inmobiliarias, empresariales y de alquiler' },
  { code: 'L', name: 'Administración gubernamental' },
  { code: 'M', name: 'Enseñanza' },
  { code: 'N', name: 'Servicios sociales y de salud' },
  { code: 'O', name: 'Servicios comunitarios, sociales y personales' }
];

export default function SectorEvolutionInteractive() {
  const [selectedSector, setSelectedSector] = useState('E'); // Electricidad por defecto
  const [evolutionData, setEvolutionData] = useState<SectorEvolutionData[]>([]);
  const [statistics, setStatistics] = useState<SectorEvolutionStats | null>(null);
  const [sectorName, setSectorName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEvolutionData(selectedSector);
  }, [selectedSector]);

  const fetchEvolutionData = async (sectorCode: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/sectors/${sectorCode}/evolution`);
      
      if (!response.ok) {
        throw new Error('Error al cargar datos de evolución');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setEvolutionData(data.data.evolution);
        setStatistics(data.data.statistics);
        setSectorName(data.data.sector_name);
      } else {
        setError(data.message || 'Error desconocido');
      }
    } catch (err) {
      console.error('Error fetching evolution data:', err);
      setError('Error al cargar los datos de evolución');
    } finally {
      setLoading(false);
    }
  };

  // Configuración del gráfico de evolución (línea)
  const evolutionChartData = {
    labels: evolutionData.map(item => item.year.toString()),
    datasets: [
      {
        label: 'Valor (millones $ de 2004)',
        data: evolutionData.map(item => item.value / 1000000), // Convertir a millones
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        borderWidth: 3,
        pointBackgroundColor: 'rgb(34, 197, 94)',
        pointBorderColor: 'white',
        pointBorderWidth: 2,
        pointRadius: 5,
      },
    ],
  };

  const evolutionChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Evolución del valor (millones $ de 2004)',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const valueInMillions = context.parsed.y;
            const year = context.label;
            const actualValue = evolutionData[context.dataIndex]?.value || 0;
            return [
              `Valor: $${valueInMillions.toFixed(1)}M`,
              `Valor completo: $${actualValue.toLocaleString('es-AR')}`,
              `Año: ${year}`
            ];
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          callback: function(value: any) {
            return `$${value.toFixed(1)}M`;
          }
        }
      },
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        }
      }
    },
  };

  // Configuración del gráfico de variación YoY (barras)
  const yoyData = evolutionData.filter(item => item.yoy !== null);
  
  const yoyChartData = {
    labels: yoyData.map(item => item.year.toString()),
    datasets: [
      {
        label: 'Variación YoY (%)',
        data: yoyData.map(item => item.yoy),
        backgroundColor: yoyData.map(item => 
          item.yoy && item.yoy > 0 ? 'rgba(34, 197, 94, 0.8)' : 'rgba(239, 68, 68, 0.8)'
        ),
        borderColor: yoyData.map(item => 
          item.yoy && item.yoy > 0 ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)'
        ),
        borderWidth: 1,
      },
    ],
  };

  const yoyChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Variación anual (%)',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const yoy = context.parsed.y;
            return `${yoy > 0 ? '+' : ''}${yoy.toFixed(1)}%`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          callback: function(value: any) {
            return `${value}%`;
          }
        }
      },
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        }
      }
    },
  };

  if (loading) {
    return (
      <div className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <span className="ml-3 text-slate-600">Cargando evolución sectorial...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <div className="text-red-600 text-lg font-semibold mb-2">Error</div>
            <div className="text-slate-600">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">
            Evolución Sectorial Interactiva ({statistics?.min_year}–{statistics?.max_year})
          </h2>
          <p className="text-slate-600 mb-6">
            Seleccioná un sector para ver su evolución y su variación anual
          </p>
          
          {/* Selector de sectores */}
          <div className="max-w-md mx-auto">
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="w-full px-4 py-3 text-lg border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
            >
              {AVAILABLE_SECTORS.map(sector => (
                <option key={sector.code} value={sector.code}>
                  {sector.code} - {sector.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Estadísticas rápidas */}
        {statistics && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-slate-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                ${(statistics.last_value / 1000000).toFixed(1)}M
              </div>
              <div className="text-sm text-slate-600">Valor {statistics.max_year}</div>
            </div>
            <div className="bg-slate-50 rounded-lg p-4 text-center">
              <div className={`text-2xl font-bold ${statistics.total_growth_percentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {statistics.total_growth_percentage >= 0 ? '+' : ''}{statistics.total_growth_percentage.toFixed(1)}%
              </div>
              <div className="text-sm text-slate-600">Crecimiento total</div>
            </div>
            <div className="bg-slate-50 rounded-lg p-4 text-center">
              <div className={`text-2xl font-bold ${statistics.cagr >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {statistics.cagr >= 0 ? '+' : ''}{statistics.cagr.toFixed(1)}%
              </div>
              <div className="text-sm text-slate-600">CAGR anual</div>
            </div>
            <div className="bg-slate-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-slate-800">
                {statistics.years_span}
              </div>
              <div className="text-sm text-slate-600">años de datos</div>
            </div>
          </div>
        )}

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Gráfico de evolución */}
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
            <div style={{ height: '400px' }}>
              <Line data={evolutionChartData} options={evolutionChartOptions} />
            </div>
          </div>

          {/* Gráfico de variación YoY */}
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
            <div style={{ height: '400px' }}>
              <Bar data={yoyChartData} options={yoyChartOptions} />
            </div>
          </div>
        </div>

        {/* Nota explicativa */}
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-500">
            * Valores en millones de pesos a precios constantes de 2004. La variación anual es interanual (YoY).
          </p>
        </div>
      </div>
    </div>
  );
}