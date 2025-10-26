import Link from 'next/link';
import { BarChart3, Home, Building2, FileText } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-slate-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo y título */}
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div className="hidden md:block">
              <h1 className="text-xl font-bold text-slate-800">PBG Corrientes</h1>
              <p className="text-xs text-slate-600">Dashboard Económico</p>
            </div>
          </Link>

          {/* Navegación */}
          <nav className="flex items-center space-x-1">
            <Link 
              href="/"
              className="flex items-center space-x-2 px-3 py-2 rounded-lg text-slate-600 hover:text-green-600 hover:bg-green-50 transition-colors"
            >
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Inicio</span>
            </Link>
            
            <Link 
              href="/sectores"
              className="flex items-center space-x-2 px-3 py-2 rounded-lg text-slate-600 hover:text-green-600 hover:bg-green-50 transition-colors"
            >
              <Building2 className="h-4 w-4" />
              <span className="hidden sm:inline">Sectores</span>
            </Link>
            
            <Link 
              href="/metodologia"
              className="flex items-center space-x-2 px-3 py-2 rounded-lg text-slate-600 hover:text-green-600 hover:bg-green-50 transition-colors"
            >
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Metodología</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}