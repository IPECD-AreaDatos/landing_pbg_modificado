# Dashboard PBG Corrientes

Dashboard interactivo para visualización de datos del Producto Bruto Geográfico de Corrientes.

## Configuración de Entorno

### Variables de Entorno Principales

Copia `.env.example` a `.env.local` y configura:

```bash
# Database Configuration
DB_HOST=tu-host-de-bd
DB_PORT=3306
DB_USER=tu-usuario
DB_PASSWORD=tu-password
DB_NAME=tu-base-datos

# Configuración de Despliegue
NEXT_PUBLIC_BASE_PATH=/pbg-dashboard  # Para proxy reverso
NEXT_PUBLIC_API_URL=                  # API externa (opcional)
```

### Modos de Configuración

**1. Desarrollo Local (sin proxy):**
```bash
# No configurar NEXT_PUBLIC_BASE_PATH
# La app estará en http://localhost:3000
```

**2. Producción con Proxy Reverso:**
```bash
NEXT_PUBLIC_BASE_PATH=/pbg-dashboard
# La app estará en https://tu-dominio.com/pbg-dashboard/
```

**3. API Externa:**
```bash
NEXT_PUBLIC_API_URL=https://tu-api.com/api
# Las llamadas irán a la API externa en lugar de /api/*
```

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
