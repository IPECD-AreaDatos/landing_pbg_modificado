import { Pool, types } from 'pg';

// PostgreSQL devuelve BIGINT y NUMERIC como strings por defecto. Los datos de
// PBG están dentro del rango seguro de JavaScript y la aplicación realiza
// cálculos aritméticos con estos campos, por lo que los normalizamos a number.
types.setTypeParser(types.builtins.INT8, Number);
types.setTypeParser(types.builtins.NUMERIC, Number);

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: false, // Poné { rejectUnauthorized: false } si el Postgres exige SSL
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

export async function executeQuery<T = any>(query: string, params: any[] = []): Promise<T[]> {
  try {
    console.log('Executing query:', query.substring(0, 100) + '...');
    console.log('With params:', params);

    // En PostgreSQL los placeholders parametrizados usan $1, $2 en vez de ?
    // Si tu código pasa queries con ?, las convertimos a $1, $2, etc.
    let paramIndex = 1;
    const formattedQuery = query.replace(/\?/g, () => `$${paramIndex++}`);

    const result = await pool.query(formattedQuery, params);
    console.log('Query returned', result.rows.length, 'rows');

    return result.rows as T[];
  } catch (error) {
    console.error('Database query error details:', {
      error: error instanceof Error ? error.message : error,
      query: query.substring(0, 100) + '...',
      params,
      config: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT,
      },
    });
    throw new Error(`Database error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export default pool;


