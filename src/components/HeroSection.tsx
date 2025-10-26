import { Statistics } from '@/types';

interface HeroSectionProps {
  statistics: Statistics;
}

export default function HeroSection({ statistics }: HeroSectionProps) {
  return (
    <section className="hero-section bg-gradient-to-br from-slate-50 to-slate-100 py-16">
      <div className="container mx-auto px-4">
        <h1 className="hero-title text-4xl md:text-6xl font-bold text-slate-800 mb-6 text-center">
          Producto Bruto<br />
          Geográfico de <span className="hero-subtitle text-green-600">Corrientes</span>
        </h1>
        <p className="hero-description text-lg text-slate-600 leading-relaxed max-w-5xl mx-auto text-center">
          Análisis oficial del <strong>Producto Bruto Geográfico (PBG) de Corrientes</strong>, correspondiente al período {statistics.min_year}–{statistics.max_year}.
          Datos elaborados por el <strong>Instituto Provincial de Estadística y Ciencia de Datos de Corrientes</strong>,
          expresados en precios constantes de 2004.<br />
          <strong>El conjunto abarca {statistics.sectors_count} categorías económicas principales</strong> 
          (16 sectores productivos + PBG total) con mas de 35 fuentes de información diferentes y
          <strong> {statistics.total_records.toLocaleString('es-AR')} registros históricos</strong>, 
          lo que permite un análisis detallado del desarrollo económico provincial.
        </p>
      </div>
    </section>
  );
}