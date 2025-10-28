export default function MetodologiaPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Metodología</h1>
      <div className="prose max-w-none">
        <h2>Fuente de Datos</h2>
        <p>
          Los datos del Producto Bruto Geográfico (PBG) de la Provincia de Corrientes son elaborados por el 
          Instituto Provincial de Estadística y Ciencia de Datos (IPECD) siguiendo las metodologías establecidas 
          por el INDEC para las cuentas provinciales.
        </p>
        
        <h2>Metodología de Cálculo</h2>
        <ul>
          <li>Base: Precios constantes de 2004</li>
          <li>Periodicidad: Anual</li>
          <li>Cobertura temporal: 2004-2024</li>
          <li>Clasificación sectorial: CIIU Rev. 3</li>
        </ul>

        <h2>Sectores Analizados</h2>
        <p>El PBG se desglosa en los siguientes sectores económicos:</p>
        <ul>
          <li>Agricultura, ganadería y silvicultura</li>
          <li>Pesca</li>
          <li>Explotación de minas y canteras</li>
          <li>Industria manufacturera</li>
          <li>Electricidad, gas y agua</li>
          <li>Construcción</li>
          <li>Comercio mayorista y minorista</li>
          <li>Hotelería y restaurantes</li>
          <li>Transporte y comunicaciones</li>
          <li>Intermediación financiera</li>
          <li>Actividades inmobiliarias, empresariales y de alquiler</li>
          <li>Administración gubernamental</li>
          <li>Enseñanza</li>
          <li>Servicios sociales y de salud</li>
          <li>Servicios comunitarios, sociales y personales</li>
        </ul>

        <h2>Contacto</h2>
        <p>
          Para más información sobre la metodología o los datos, contactar al IPECD - 
          Instituto Provincial de Estadística y Ciencia de Datos de Corrientes.
        </p>
      </div>
    </div>
  );
}