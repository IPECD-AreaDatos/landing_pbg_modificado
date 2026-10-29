'use client';

import { Statistics } from '@/types';

interface HeroSectionProps {
  statistics: Statistics;
}

export default function HeroSection({ statistics }: HeroSectionProps) {
  return (
    <section className="relative isolate overflow-hidden bg-[#1b2839] text-white">
      <div className="pointer-events-none absolute -right-20 -top-40 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-64 left-1/4 h-96 w-96 rounded-full bg-sky-400/10 blur-3xl" aria-hidden="true" />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 md:py-20 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.6fr)] lg:items-center">
        <div>
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-300/25 bg-emerald-300/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-emerald-200">
            Economía provincial <span aria-hidden="true">·</span> Serie histórica
          </span>
          <h1 className="max-w-4xl text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Producto Bruto Geográfico <span className="text-emerald-300">de Corrientes</span>
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-relaxed text-slate-200 sm:text-lg">
            Evolución y composición de la economía provincial, con datos oficiales del Instituto de Modernización e Innovación. Valores expresados a precios constantes de 2004.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 rounded-3xl border border-white/15 bg-white/10 p-5 shadow-2xl backdrop-blur-sm sm:p-7">
          <div className="col-span-2 border-b border-white/15 pb-4">
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-200">Período analizado</p>
            <p className="mt-2 text-3xl font-extrabold tracking-tight">{statistics.min_year}–{statistics.max_year}</p>
          </div>
          <div>
            <p className="text-2xl font-extrabold">{statistics.sectors_count}</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-200">sectores económicos</p>
          </div>
          <div>
            <p className="text-2xl font-extrabold">{statistics.total_records.toLocaleString('es-AR')}</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-200">registros históricos</p>
          </div>
        </div>
      </div>
    </section>
  );
}
