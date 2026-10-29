import Link from 'next/link';
import Image from 'next/image';
import logoModernizacion from '@/../public/logo-modernizacion.png';
import { BarChart3 } from 'lucide-react';

export default function Header() {
  return (
    <header className="border-b-4 border-[#10b981] bg-[#1b2839] text-white shadow-lg">
      <div className="mx-auto flex min-h-24 max-w-7xl flex-wrap items-center justify-between gap-5 px-5 py-4 sm:px-8">
        <Link href="/" aria-label="Inicio del tablero PBG Corrientes" className="rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-300">
          <Image
            src={logoModernizacion}
            alt="Gobierno de Corrientes e Instituto de Modernización e Innovación"
            className="h-12 w-auto object-contain sm:h-14"
            priority
          />
        </Link>
        <div className="flex items-center gap-3 text-right">
          <div className="hidden sm:block">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">Tablero público</p>
            <p className="text-sm font-semibold text-slate-100">PBG Corrientes</p>
          </div>
          <span className="grid h-11 w-11 place-items-center rounded-xl border border-white/15 bg-white/10 text-emerald-300" aria-hidden="true">
            <BarChart3 className="h-5 w-5" />
          </span>
        </div>
      </div>
    </header>
  );
}
