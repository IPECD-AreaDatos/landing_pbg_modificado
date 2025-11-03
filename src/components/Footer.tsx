import Link from 'next/link';
import { ExternalLink, Mail, MapPin, Calendar } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Información del Instituto */}
          <div className="col-span-1 lg:col-span-2">
            <h3 className="text-lg font-bold mb-4">
              Instituto Provincial de Estadística y Ciencia de Datos
            </h3>
            <p className="text-slate-300 leading-relaxed mb-4">
              Organismo técnico especializado en la producción, análisis y difusión
              de información estadística oficial de la Provincia de Corrientes.
            </p>
            <div className="flex flex-col space-y-2 text-sm text-slate-300">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Corrientes, Argentina</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <a
                  href="mailto:Estadistica@corrientes.gob.ar"
                  className="hover:text-green-400 transition-colors"
                >
                  Estadistica@corrientes.gob.ar
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Actualizado: {new Date().getFullYear()}</span>
              </div>
            </div>
          </div>

          {/* Enlaces Útiles */}
          <div>
            <h4 className="font-semibold mb-4">Enlaces Útiles</h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>
                <a
                  href="https://estadistica.corrientes.gob.ar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 hover:text-green-400 transition-colors"
                >
                  <span>Sitio Institucional</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Información Técnica */}
          <div>
            <h4 className="font-semibold mb-4">Información Técnica</h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>Precios constantes base 2004</li>
              <li>Actualización anual</li>
              <li>17 sectores económicos</li>
            </ul>
          </div>
        </div>

        {/* Línea divisoria y copyright */}
        <div className="border-t border-slate-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-slate-400">
            <p>
              © {new Date().getFullYear()} IPECD - Instituto Provincial de Estadística y Ciencia de Datos.
              Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}