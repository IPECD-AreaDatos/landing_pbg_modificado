'use client';

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
import { ChartDataPoint, SectorData } from '@/types';

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

interface ChartsGridProps {
  evolutionData: ChartDataPoint[];
  sectorsData: SectorData[];
}

export default function ChartsGrid({ evolutionData, sectorsData }: ChartsGridProps) {
  // Verificar que los datos sean arrays válidos
  if (!Array.isArray(evolutionData) || !Array.isArray(sectorsData)) {
    console.error('ChartsGrid: Invalid data props', { evolutionData, sectorsData });
    return null;
  }

  // Verificar que tenemos datos válidos

  // Configuración del gráfico de evolución del PBG
  const evolutionChartData = {
    labels: evolutionData.map(item => item.year.toString()),
    datasets: [
      {
        label: 'PBG Total (Miles de millones)',
        data: evolutionData.map(item => item.value), // Valor completo tal como viene de la base
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        borderWidth: 3,
        pointBackgroundColor: 'rgb(34, 197, 94)',
        pointBorderColor: 'white',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  const evolutionOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            size: 12,
            weight: 'bold' as const,
          },
        },
      },
      title: {
        display: true,
        text: 'Evolución del PBG Total',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const valueInMillions = (context.parsed.y / 1000000);
            const valueComplete = context.parsed.y.toLocaleString('es-AR');
            return [
              `${context.dataset.label}: $${valueInMillions.toFixed(2)}M`,
              `Valor completo: $${valueComplete}`,
              `Año: ${context.label}`
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
            return `$${(value / 1000000).toFixed(2)}M`;
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

  // Configuración del gráfico de sectores (todas las categorías principales)
  const allSectors = sectorsData
    .filter(sector => sector.code !== 'T' && sector.code !== 'PBG')
    .sort((a, b) => b.value - a.value); // Ordenar por porcentaje de participación (value es el %)

  const sectorsChartData = {
    labels: allSectors.map(sector => sector.sector),
    datasets: [
      {
        label: 'Participación (%)',
        data: allSectors.map(sector => sector.value), // value ya es el porcentaje
        backgroundColor: '#22c55e', // Verde uniforme como en tu imagen
        borderColor: '#16a34a',
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const sectorsOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false, // Ocultar leyenda para el gráfico de barras
      },
      title: {
        display: true,
        text: 'Distribución Sectorial 2024',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
      subtitle: {
        display: true,
        text: 'Participación porcentual en el PBG total',
        font: {
          size: 12,
        },
        color: '#6b7280',
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const sectorData = allSectors[context.dataIndex];
            const percentage = context.parsed.y; // Este ya es el porcentaje correcto
            const valueInMillions = sectorData.value_absolute / 1000000;
            const valueComplete = sectorData.value_absolute.toLocaleString('es-AR');
            return [
              `Participación: ${percentage.toFixed(2)}%`,
              `Valor: $${valueInMillions.toFixed(2)}M`,
              `Valor completo: $${valueComplete}`,
              `Año: 2024`
            ];
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return `${Number(value).toFixed(2)}%`;
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        }
      },
      x: {
        ticks: {
          maxRotation: 90,
          minRotation: 45,
          font: {
            size: 9,
          }
        },
        grid: {
          display: false,
        }
      }
    },
  };

  return (
    <div className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-slate-800 text-center mb-10">
          Análisis Gráfico
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Gráfico de Evolución */}
          <div className="bg-slate-50 rounded-xl p-6 shadow-md">
            <div className="h-80">
              <Line data={evolutionChartData} options={evolutionOptions} />
            </div>
          </div>

          {/* Gráfico de Sectores */}
          <div className="bg-slate-50 rounded-xl p-6 shadow-md">
            <div className="h-80">
              <Bar data={sectorsChartData} options={sectorsOptions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}