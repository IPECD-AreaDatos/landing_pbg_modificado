'use client';

import { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, ChevronRight } from 'lucide-react';
import { SectorData } from '@/types';
import SubcategoriesList from './SubcategoriesList';

interface SectorsGridProps {
  sectors: SectorData[];
}

export default function SectorsGrid({ sectors }: SectorsGridProps) {
  const [expandedSector, setExpandedSector] = useState<{ code: string; name: string; data: SectorData } | null>(null);
  
  // Verificar que sectors sea un array válido
  if (!Array.isArray(sectors)) {
    console.error('SectorsGrid: sectors prop is not an array', sectors);
    return null;
  }

  const handleSectorClick = (sectorCode: string, sectorName: string, sectorData: SectorData) => {
    setExpandedSector({ code: sectorCode, name: sectorName, data: sectorData });
  };

  const handleCloseModal = () => {
    setExpandedSector(null);
  };

  // Filtrar y ordenar sectores (excluir el total)
  const sortedSectors = sectors
    .filter(sector => sector.code !== 'T')
    .sort((a, b) => (b.value_absolute || 0) - (a.value_absolute || 0));

  const getVariationIcon = (yoy: number | undefined) => {
    if (!yoy) return <Minus className="h-4 w-4 text-slate-400" />;
    if (yoy > 0) return <TrendingUp className="h-4 w-4 text-emerald-700" />;
    if (yoy < 0) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-slate-400" />;
  };

  const getVariationColor = (yoy: number | undefined) => {
    if (!yoy) return 'text-slate-500';
    if (yoy > 0) return 'text-emerald-700';
    if (yoy < 0) return 'text-red-600';
    return 'text-slate-500';
  };

  return (
    <div className="py-12 bg-slate-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-slate-800 text-center mb-10">
          Sectores Económicos
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sortedSectors.map((sector, index) => (
            <button
              type="button"
              key={sector.code}
              className="group w-full rounded-2xl text-left focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-emerald-600"
              onClick={() => handleSectorClick(sector.code, sector.sector, sector)}
            >
              <div className="h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_10px_28px_rgba(27,40,57,0.05)] transition-all duration-300 group-hover:-translate-y-1 group-hover:border-emerald-300 group-hover:shadow-xl">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">
                        #{index + 1}
                      </span>
                      <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">
                        {sector.code}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-slate-800 leading-tight group-hover:text-emerald-700 transition-colors">
                      {sector.sector}
                    </h3>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {/* Participación */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-slate-600">Participación</span>
                      <span className="text-sm font-bold text-slate-800">
                        {typeof sector.value === 'number' ? sector.value.toFixed(1) : '0.0'}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, typeof sector.value === 'number' ? sector.value : 0)}%` }}
                      />
                    </div>
                  </div>

                  {/* Valor Absoluto */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-600">Valor</span>
                    <span className="text-sm font-semibold text-slate-700">
                      ${typeof sector.value_absolute === 'number' ? (sector.value_absolute / 1000000).toFixed(1) : '0.0'}M
                    </span>
                  </div>

                  {/* Variación Interanual */}
                  {sector.yoy !== undefined && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-600">Variación YoY</span>
                      <div className="flex items-center gap-1">
                        {getVariationIcon(sector.yoy)}
                        <span className={`text-sm font-semibold ${getVariationColor(sector.yoy)}`}>
                          {sector.yoy && sector.yoy > 0 ? '+' : ''}{typeof sector.yoy === 'number' ? sector.yoy.toFixed(1) : '0.0'}%
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Indicador de hover */}
                <div className="mt-4 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-xs text-emerald-700 font-medium">
                      Ver subcategorías
                    </span>
                    <ChevronRight className="h-3 w-3 text-emerald-700" />
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Modal de Subcategorías */}
      {expandedSector && (
        <SubcategoriesList
          sectorCode={expandedSector.code}
          sectorName={expandedSector.name}
          sectorData={expandedSector.data}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
