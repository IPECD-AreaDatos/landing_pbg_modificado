'use client';

import { useEffect } from 'react';

export default function ProxyPathFixer() {
  useEffect(() => {
    // Solo ejecutar en el navegador y si estamos en un proxy
    if (typeof window === 'undefined') return;
    
    const currentPath = window.location.pathname;
    
    // Si estamos en /pbg-dashboard/ y hay links internos mal formados
    if (currentPath.startsWith('/pbg-dashboard/')) {
      // Interceptar clicks en links internos
      const handleClick = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const link = target.closest('a');
        
        if (link && link.href) {
          const url = new URL(link.href);
          
          // Si es un link interno que no empieza con /pbg-dashboard/
          if (url.origin === window.location.origin && 
              url.pathname.match(/^\/(sectores|metodologia|diagnostics|proxy-test)/) &&
              !url.pathname.startsWith('/pbg-dashboard/')) {
            
            e.preventDefault();
            
            // Reescribir la URL correctamente
            const newPath = `/pbg-dashboard${url.pathname}`;
            window.location.href = newPath + url.search + url.hash;
          }
        }
      };
      
      // Agregar event listener
      document.addEventListener('click', handleClick, true);
      
      // Cleanup
      return () => {
        document.removeEventListener('click', handleClick, true);
      };
    }
  }, []);

  return null;
}