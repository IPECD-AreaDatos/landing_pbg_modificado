import Link from 'next/link';
import { BarChart3, Home, Building2, FileText } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-slate-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo IPECD */}
          <div className="flex items-center">
            <img 
              src="https://estadistica.corrientes.gob.ar/images/ipecd.svg" 
              alt="IPECD Logo" 
              className="h-8 w-auto mr-4"
            />
          </div>
          
          {/* Logo y título del dashboard */}
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div className="hidden md:block">
              <h1 className="text-xl font-bold text-slate-800">PBG Corrientes</h1>
              <p className="text-xs text-slate-600">Dashboard Económico</p>
            </div>
          </Link>

        </div>
      </div>
    </header>
  );
}