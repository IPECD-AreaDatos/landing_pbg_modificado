// Tipos principales para el dashboard PBG
export interface PbgData {
  año: number;
  letra: string;
  descripcion: string;
  valor: number;
  variacion_interanual?: number;
}

export interface SectorData {
  code: string;
  sector: string;
  value: number; // Porcentaje
  value_absolute: number; // Valor absoluto
  yoy?: number; // Variación interanual
  year: number;
}

export interface SubcategoryData {
  code: string;
  subcategory: string;
  value_absolute: number;
  year: number;
  yoy?: number;
  participation_in_sector: number; // Porcentaje dentro del sector
}

export interface SectorEvolutionData {
  year: number;
  value: number;
  yoy: number | null;
}

export interface SectorEvolutionStats {
  years_span: number;
  min_year: number;
  max_year: number;
  min_value: number;
  max_value: number;
  first_value: number;
  last_value: number;
  total_growth_percentage: number;
  cagr: number;
  total_records: number;
}

export interface ChartDataPoint {
  year: number;
  value: number;
}

export interface Statistics {
  total_value_billions: number;
  years_span: number;
  min_year: number;
  max_year: number;
  growth_percentage: number;
  total_records: number;
  sectors_count: number;
  latest_pbg_value: number;
  latest_pbg_year: number;
  variation_yoy: number;
  cagr: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}