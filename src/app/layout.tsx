import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PBG Corrientes - Dashboard Económico",
  description: "Análisis del Producto Bruto Geográfico de la Provincia de Corrientes. Datos oficiales del IPECD con información sectorial, evolutiva y estadísticas económicas detalladas.",
  keywords: "PBG, Corrientes, economía, estadísticas, IPECD, producto bruto geográfico",
  authors: [{ name: "IPECD - Instituto Provincial de Estadística y Ciencia de Datos" }],
  openGraph: {
    title: "PBG Corrientes - Dashboard Económico",
    description: "Análisis oficial del Producto Bruto Geográfico de Corrientes",
    type: "website",
    locale: "es_AR",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es-AR">
      <head>
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" 
          integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw==" 
          crossOrigin="anonymous" 
          referrerPolicy="no-referrer" 
        />
      </head>
      <body className={`${inter.className} antialiased min-h-screen bg-slate-50 flex flex-col`}>
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
