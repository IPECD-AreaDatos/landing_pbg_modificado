'use client';

import { useState, useEffect } from 'react';
import { ChevronUp, X } from 'lucide-react';
import { SubcategoryData, SectorData } from '@/types';

interface SubcategoriesListProps {
  sectorCode: string;
  sectorName: string;
  sectorData: SectorData; // Datos del sector principal
  onClose: () => void;
}

export default function SubcategoriesList({ sectorCode, sectorName, sectorData, onClose }: SubcategoriesListProps) {
  const [subcategories, setSubcategories] = useState<SubcategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSubcategories();
  }, [sectorCode]);

  const fetchSubcategories = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/sectors/${sectorCode}/subcategories`);
      
      if (!response.ok) {
        throw new Error('Error al cargar subcategorías');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setSubcategories(data.data.subcategories);
        setError(null);
      } else {
        setError(data.message || 'Error desconocido');
      }
    } catch (err) {
      console.error('Error fetching subcategories:', err);
      setError('Error al cargar las subcategorías');
    } finally {
      setLoading(false);
    }
  };

  const getVariationColor = (yoy: number | undefined) => {
    if (!yoy) return 'text-slate-500';
    if (yoy > 0) return 'text-green-600';
    if (yoy < 0) return 'text-red-600';
    return 'text-slate-500';
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-white/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white/95 backdrop-blur-lg rounded-xl p-8 max-w-md w-full shadow-xl border border-white/20">
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-slate-700">Cargando...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-white/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white/95 backdrop-blur-lg rounded-xl p-8 max-w-md w-full shadow-xl border border-white/20">
          <div className="text-center">
            <div className="text-red-600 text-lg font-semibold mb-2">Error</div>
            <div className="text-slate-700 mb-4">{error}</div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors shadow-lg"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-white/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 backdrop-blur-lg rounded-xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden border border-white/20">
        
        {/* Header con info del sector principal */}
        <div className="p-4 border-b border-slate-200/50 bg-gradient-to-r from-blue-50/80 to-slate-50/80">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">{sectorCode}</span>
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 text-sm">{sectorName}</h3>
                <ChevronUp className="h-4 w-4 text-slate-400 mt-1" />
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors hover:bg-white/60 rounded-full p-1"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-slate-800">{sectorData.value.toFixed(1)}%</div>
              <div className="text-xs text-slate-500">participación</div>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-slate-800">
                ${(sectorData.value_absolute / 1000000).toFixed(1)}M
              </div>
              <div className="text-xs text-slate-500">2024 • precios 2004</div>
            </div>
          </div>
          
          {sectorData.yoy && (
            <div className="mt-2">
              <span className={`text-sm font-semibold ${getVariationColor(sectorData.yoy)}`}>
                {sectorData.yoy > 0 ? '+' : ''}{sectorData.yoy.toFixed(1)}% YoY
              </span>
            </div>
          )}
          
          <div className="mt-3 text-xs text-slate-600">
            {subcategories.length} subcategorías
          </div>
        </div>

        {/* Lista scrolleable de subcategorías */}
        <div className="overflow-y-auto max-h-96">
          {subcategories.length === 0 ? (
            <div className="p-6 text-center text-slate-500">
              No hay subcategorías disponibles
            </div>
          ) : (
            <div className="space-y-0">
              {subcategories.map((sub, index) => (
                <div 
                  key={sub.code}
                  className="px-4 py-3 border-b border-slate-100/50 hover:bg-white/60 transition-all duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-slate-800 leading-tight">
                        {sub.subcategory}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 ml-3">
                      <div className="text-right">
                        <div className="text-sm font-semibold text-slate-800">
                          ${(sub.value_absolute / 1000000).toFixed(1)}M
                        </div>
                        <div className="text-xs text-slate-500">2024</div>
                      </div>
                      
                      {sub.yoy && (
                        <div className={`text-sm font-semibold ${getVariationColor(sub.yoy)} min-w-[60px] text-right`}>
                          {sub.yoy > 0 ? '+' : ''}{sub.yoy.toFixed(1)}% YoY
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Barra azul a la izquierda */}
                  <div className="w-1 h-full bg-blue-400 absolute left-0 top-0"></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}